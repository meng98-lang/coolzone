import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { getShopSettings, updateShopOrderPayment } from '@/lib/shop';

// POST /api/shop/webhook - Square 支付事件回调
// 用 raw body 做签名校验
export async function POST(request: NextRequest) {
  const settings = await getShopSettings();
  const webhookSecret = settings.squareWebhookSecret;

  if (!webhookSecret) {
    // 未配置 webhook secret 时仅确认收到，便于本地调试
    return NextResponse.json({ received: true });
  }

  const signature = request.headers.get('x-square-signature') || '';
  const raw = await request.text();

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    const expected = createHmac('sha256', webhookSecret).update(raw).digest('base64');
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (e) {
    console.error('[shop/webhook] signature error', e);
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
  }

  let event: { type?: string; data?: { object?: { payment?: { id?: string; status?: string } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const payment = event.data?.object?.payment;
  const paymentId = payment?.id;
  const status = payment?.status;

  // 仅处理支付类事件
  if (paymentId && (event.type === 'payment.updated' || event.type === 'payment.created' || event.type === 'payment.completed')) {
    try {
      if (status === 'COMPLETED') {
        await updateShopOrderPayment(paymentId, {
          payment_status: 'paid',
          payment_method: 'card',
          status: 'paid',
        });
      } else if (status === 'FAILED') {
        await updateShopOrderPayment(paymentId, { payment_status: 'failed', status: 'failed' });
      } else if (status) {
        await updateShopOrderPayment(paymentId, { payment_status: status.toLowerCase() });
      }
    } catch (e) {
      console.error('[shop/webhook] update order failed', e);
    }
  }

  return NextResponse.json({ received: true });
}