import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings, verifyAdminPassword } from '@/lib/db';

// GET /api/settings - 获取网站配置
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    whatsappPhone: settings.whatsappPhone,
    facebookPixelId: settings.facebookPixelId,
    googleAnalyticsId: settings.googleAnalyticsId,
    tiktokPixelId: settings.tiktokPixelId,
  });
}

// PUT /api/settings - 管理员登录验证
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 返回简单的 token（基于密码的 hash）
    const token = btoa(`admin:${Date.now()}`);
    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// POST /api/settings - 更新网站配置（需要管理员认证）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, ...updates } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const settings = await updateSettings(updates);
    return NextResponse.json({
      success: true,
      settings: {
        whatsappPhone: settings.whatsappPhone,
        facebookPixelId: settings.facebookPixelId,
        googleAnalyticsId: settings.googleAnalyticsId,
        tiktokPixelId: settings.tiktokPixelId,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
