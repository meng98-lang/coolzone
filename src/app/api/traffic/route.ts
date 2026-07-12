import { NextRequest, NextResponse } from 'next/server';
import {
  recordVisit,
  getCountryFromIP,
  extractSearchKeyword,
  getTrafficStats,
  verifyAdminPassword,
} from '@/lib/db';

// POST /api/traffic - 记录访问
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    const country = getCountryFromIP(ip);
    const searchKeyword = extractSearchKeyword(referer);
    const date = new Date().toISOString().split('T')[0];

    await recordVisit({
      date,
      path: path || '/',
      country,
      referrer: referer,
      userAgent,
      searchKeyword,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to record visit' }, { status: 500 });
  }
}

// GET /api/traffic - 获取统计数据（需要管理员认证）
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const isValid = await verifyAdminPassword(token);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const stats = await getTrafficStats(30);

    return NextResponse.json({
      totalVisits: stats.totalVisits,
      dailyTraffic: stats.dailyTraffic,
      countryStats: stats.countryStats,
      keywordStats: stats.keywordStats,
      pageStats: stats.pageStats,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to get statistics' }, { status: 500 });
  }
}
