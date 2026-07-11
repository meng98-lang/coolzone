import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings, verifyAdminPassword } from '@/lib/db';

// GET /api/settings - 获取网站配置（公开接口，返回非敏感配置）
export async function GET() {
  const settings = getSettings();
  // 只返回非敏感配置
  return NextResponse.json({
    whatsappPhone: settings.whatsappPhone,
    facebookPixelId: settings.facebookPixelId,
    googleAnalyticsId: settings.googleAnalyticsId,
  });
}

// POST /api/settings - 更新网站配置（需要管理员认证）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, whatsappPhone, facebookPixelId, googleAnalyticsId, newAdminPassword } = body;

    // 验证管理员密码
    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 构建更新对象
    const updates: Record<string, string> = {};
    if (whatsappPhone !== undefined) updates.whatsappPhone = whatsappPhone;
    if (facebookPixelId !== undefined) updates.facebookPixelId = facebookPixelId;
    if (googleAnalyticsId !== undefined) updates.googleAnalyticsId = googleAnalyticsId;
    if (newAdminPassword !== undefined && newAdminPassword.length >= 6) {
      updates.adminPassword = newAdminPassword;
    }

    const settings = updateSettings(updates);
    
    // 返回更新后的配置（不包含密码）
    return NextResponse.json({
      success: true,
      settings: {
        whatsappPhone: settings.whatsappPhone,
        facebookPixelId: settings.facebookPixelId,
        googleAnalyticsId: settings.googleAnalyticsId,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

// POST /api/settings/auth - 验证管理员密码
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (verifyAdminPassword(password)) {
      return NextResponse.json({ success: true, token: 'admin' });
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
