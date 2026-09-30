import { NextRequest, NextResponse } from 'next/server';
import { getShopSettings, updateShopSettings, verifyShopAdmin } from '@/lib/shop';

// GET /api/shop/settings - 获取商城配置（需管理员密码）
export async function GET(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  if (!password || !(await verifyShopAdmin(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const s = await getShopSettings();
  return NextResponse.json({
    siteName: s.siteName,
    whatsappNumber: s.whatsappNumber,
    whatsappMessage: s.whatsappMessage,
    currency: s.currency,
    companyName: s.companyName,
    companyAddress: s.companyAddress,
    companyPhone: s.companyPhone,
    squareApplicationId: s.squareApplicationId,
    squareLocationId: s.squareLocationId,
    squareEnvironment: s.squareEnvironment,
  });
}

// POST /api/shop/settings - 保存商城配置（含 Square 密钥）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, ...updates } = body;
    if (!password || !(await verifyShopAdmin(password))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const allowed = [
      'siteName', 'whatsappNumber', 'whatsappMessage', 'currency',
      'companyName', 'companyAddress', 'companyPhone',
      'squareApplicationId', 'squareAccessToken', 'squareLocationId',
      'squareWebhookSecret', 'squareEnvironment',
    ];
    const clean: Record<string, string> = {};
    for (const k of allowed) {
      if (updates[k] !== undefined && updates[k] !== '') clean[k] = String(updates[k]);
    }
    await updateShopSettings(clean);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to save settings';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}