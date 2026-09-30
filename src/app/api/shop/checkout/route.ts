import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DEFAULT_PRODUCTS, createShopOrder, getShopSettings, type ShopOrderItem } from '@/lib/shop';

// POST /api/shop/checkout - 创建 Stripe PaymentIntent 并保存订单
export async function POST(request: NextRequest) {
  try {
    const settings = await getShopSettings();
    const secretKey = settings.stripeSecretKey;
    if (!secretKey) {
      return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 503 });
    }

    const body = await request.json();
    const {
      items: rawItems,
      customerName,
      customerEmail,
      customerPhone,
      country,
      address,
      message,
    } = body;

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    // 校验并规范化购物车条目（价格以服务端产品数据为准，杜绝前端篡改）
    const items: ShopOrderItem[] = [];
    for (const it of rawItems) {
      const p = DEFAULT_PRODUCTS.find((x) => x.id === it.productId);
      if (!p) {
        return NextResponse.json({ error: `Unknown product: ${it.productId}` }, { status: 400 });
      }
      const qty = Math.max(1, parseInt(it.qty, 10) || 1);
      items.push({ productId: p.id, name: p.name, price: p.price, qty, image: p.image });
    }

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    // 运费暂为 0，可按需扩展
    const shipping = 0;
    const total = subtotal + shipping;

    const stripe = new Stripe(secretKey);
    const currencyLower = (settings.currency || 'usd').toLowerCase();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: currencyLower,
      // 不自动确认，由前端用 Stripe Elements 确认后走 webhook
      automatic_payment_methods: { enabled: true },
      metadata: { integration_check: 'next_shop' },
    });

    // 先落一条 pending 订单，绑定 payment_intent
    const order = await createShopOrder({
      items,
      subtotal,
      total,
      currency: currencyLower,
      customer_name: customerName || undefined,
      customer_email: customerEmail || undefined,
      customer_phone: customerPhone || undefined,
      country: country || undefined,
      address: address || undefined,
      message: message || undefined,
      payment_status: 'pending',
      stripe_payment_intent: paymentIntent.id,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderNumber: order.order_number,
      orderId: order.id,
      total,
      currency: currencyLower.toUpperCase(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Checkout failed';
    console.error('[shop/checkout]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}