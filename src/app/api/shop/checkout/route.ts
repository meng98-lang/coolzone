import { NextRequest, NextResponse } from 'next/server';
import { SquareError } from 'square';
import {
  DEFAULT_PRODUCTS, createShopOrder, getShopSettings, squareClient,
  updateShopOrder, type ShopOrderItem,
} from '@/lib/shop';
import type { Currency } from 'square';

// POST /api/shop/checkout - 用前端 Square token 一次性收款并保存订单
export async function POST(request: NextRequest) {
  try {
    const settings = await getShopSettings();
    const accessToken = settings.squareAccessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'Square is not configured yet.' }, { status: 503 });
    }

    const body = await request.json();
    const {
      items: rawItems,
      sourceId,
      customerName,
      customerEmail,
      customerPhone,
      country,
      address,
      message,
    } = body as {
      items?: Array<{ productId: string; qty: number }>;
      sourceId?: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      country?: string;
      address?: string;
      message?: string;
    };

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }
    if (!sourceId) {
      return NextResponse.json({ error: 'Payment token (sourceId) is required.' }, { status: 400 });
    }

    // 价格一律以服务端目录为准，防止前端篡改金额
    const items: ShopOrderItem[] = [];
    for (const it of rawItems) {
      const p = DEFAULT_PRODUCTS.find((x) => x.id === it.productId);
      if (!p) {
        return NextResponse.json(
          { error: `Unknown product: ${it.productId}` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.floor(Number(it.qty)) || 1);
      items.push({ productId: p.id, name: p.name, price: p.price, qty, image: p.image });
    }

    const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const total = subtotal;
    const currency = settings.currency.toUpperCase();
    const amount = BigInt(Math.round(total * 100));

    // 先落本地 pending 订单，用其 order id 作为幂等键
    const localOrder = await createShopOrder({
      items, subtotal, total,
      currency: settings.currency,
      customer_name: customerName || undefined,
      customer_email: customerEmail || undefined,
      customer_phone: customerPhone || undefined,
      country: country || undefined,
      address: address || undefined,
      message: message || undefined,
      payment_status: 'pending',
    });

    const client = squareClient(accessToken, settings.squareEnvironment);

    const paymentResp = await client.payments.create({
      sourceId,
      idempotencyKey: localOrder.id,
      amountMoney: { amount, currency: currency as Currency },
      ...(settings.squareLocationId
        ? { locationId: settings.squareLocationId }
        : {}),
      ...(customerEmail ? { buyerEmailAddress: customerEmail } : {}),
    });

    const payment = paymentResp.payment;
    const paymentId = payment?.id;
    if (!paymentId) {
      return NextResponse.json(
        { error: 'Square payment was not created.' },
        { status: 500 }
      );
    }

    const paid = payment.status === 'COMPLETED';
    await updateShopOrder(localOrder.id, {
      payment_status: paid ? 'paid' : (payment.status || 'pending').toLowerCase(),
      payment_method: 'card',
      ...(paid ? { status: 'paid' } : {}),
      square_payment_id: paymentId,
    });

    return NextResponse.json({
      success: paid,
      orderNumber: localOrder.order_number,
      paymentId,
      paymentStatus: payment.status,
      total,
      currency,
    });
  } catch (err) {
    console.error('[shop/checkout]', err);
    if (err instanceof SquareError) {
      const detail = err.errors?.[0]?.detail;
      return NextResponse.json(
        { error: detail || err.message },
        { status: Number(err.statusCode) || 500 }
      );
    }
    const msg = err instanceof Error ? err.message : 'Checkout failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
