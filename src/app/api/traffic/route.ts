import { NextRequest, NextResponse } from 'next/server';
import {
  recordVisit,
  getCountryFromIP,
  extractSearchKeyword,
  getDailyStats,
  getCountryStats,
  getSourceStats,
  getKeywordStats,
  getPageStats,
  verifyAdminPassword,
} from '@/lib/db';

// POST /api/traffic - 记录访问
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;

    // 获取客户端IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 获取User-Agent和Referer
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    // 判断国家和提取搜索词
    const country = getCountryFromIP(ip);
    const searchKeyword = extractSearchKeyword(referer);

    // 记录访问
    recordVisit({
      path: path || '/',
      ip,
      country,
      userAgent,
      referer,
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
    // 验证管理员密码
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (!verifyAdminPassword(token)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 获取统计数据
    const dailyStats = getDailyStats(30);
    const countryStats = getCountryStats();
    const sourceStats = getSourceStats();
    const keywordStats = getKeywordStats();
    const pageStats = getPageStats();

    // 计算总访问量和独立访客数
    const totalVisits = dailyStats.reduce((sum, d) => sum + d.visits, 0);
    const totalUniqueVisitors = dailyStats.reduce((sum, d) => sum + d.uniqueVisitors, 0);

    return NextResponse.json({
      totalVisits,
      totalUniqueVisitors,
      dailyStats,
      countryStats,
      sourceStats,
      keywordStats,
      pageStats,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to get statistics' }, { status: 500 });
  }
}
