import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getShopSettings, updateShopOrderPayment } from '@/lib/shop';

// POST /api/shop/webhook - Stripe 支付结果回调
// Stripe 需要 raw body 做签名校验，故关闭默认 json 解析
export async function POST(request: NextRequest) {
  const settings = await getShopSettings();
  const secretKey = settings.stripeSecretKey;
  const webhookSecret = settings.stripeWebhookSecret;

  const signature = request.headers.get('stripe-signature');

  // 未配置 webhook secret 时不校验签名（便于本地调试），但生产必须配置
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ received: true });
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    const raw = await request.text();
    event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Signature verification failed';
    console.error('[shop/webhook]', msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    try {
      await updateShopOrderPayment(pi.id, {
        payment_status: 'paid',
        payment_method: pi.payment_method ? String(pi.payment_method) : undefined,
        status: 'paid',
      });
    } catch (e) {
      console.error('[shop/webhook] update order failed', e);
    }
  } else if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent;
    try {
      await updateShopOrderPayment(pi.id, { payment_status: 'failed', status: 'failed' });
    } catch (e) {
      console.error('[shop/webhook] update order failed', e);
    }
  }

  return NextResponse.json({ received: true });
}