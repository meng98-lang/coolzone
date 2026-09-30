import { NextResponse } from 'next/server';
import { DEFAULT_PRODUCTS, getShopSettings } from '@/lib/shop';

// GET /api/shop/products - 商城产品列表 + 收款配置（不含密钥）
export async function GET() {
  const settings = await getShopSettings();
  return NextResponse.json({
    products: DEFAULT_PRODUCTS,
    currency: settings.currency.toUpperCase(),
    siteName: settings.siteName,
    whatsappNumber: settings.whatsappNumber,
    whatsappMessage: settings.whatsappMessage,
    companyName: settings.companyName,
    companyAddress: settings.companyAddress,
    companyPhone: settings.companyPhone,
    squareApplicationId: settings.squareApplicationId,
    squareLocationId: settings.squareLocationId,
    squareEnvironment: settings.squareEnvironment,
  });
}