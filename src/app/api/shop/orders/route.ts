import { NextRequest, NextResponse } from 'next/server';
import { listShopOrders, verifyShopAdmin } from '@/lib/shop';

// GET /api/shop/orders - 后台查看所有订单（需管理员密码）
export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (!password || !(await verifyShopAdmin(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const orders = await listShopOrders();
    return NextResponse.json({ orders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to load orders';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}