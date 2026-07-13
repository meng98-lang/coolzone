/**
 * 数据存储模块 - Supabase版本
 * 使用Supabase数据库存储联系表单、网站配置和流量统计
 */
import { getSupabaseClient } from '@/storage/database/supabase-client';

function getClient() {
  return getSupabaseClient();
}

// 联系表单数据类型
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  product_name: string | null;
  created_at: string;
  is_read: boolean;
}

// 网站配置类型
export interface SiteSettings {
  whatsappPhone: string;
  facebookPixelId: string;
  googleAnalyticsId: string;
  tiktokPixelId: string;
  adminPassword: string;
}

// 默认配置
const DEFAULT_SETTINGS: SiteSettings = {
  whatsappPhone: '491234567890',
  facebookPixelId: '',
  googleAnalyticsId: '',
  tiktokPixelId: '',
  adminPassword: 'coolzone2024',
};

// 流量记录类型
export interface TrafficRecord {
  id: number;
  date: string;
  path: string;
  country: string;
  referrer: string;
  user_agent: string;
  search_keyword: string;
  created_at: string;
}

// ============ 联系表单操作 ============

// 获取所有联系表单
export async function getInquiries(): Promise<Inquiry[]> {
  const { data, error } = await getClient()
    .from('inquiries')
    .select('id, name, email, phone, message, product_name, created_at, is_read')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`查询联系表单失败: ${error.message}`);
  return (data || []) as Inquiry[];
}

// 添加联系表单
export async function addInquiry(data: { name: string; email: string; phone: string; message: string; productName?: string }): Promise<Inquiry> {
  const { data: result, error } = await getClient()
    .from('inquiries')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      product_name: data.productName || null,
      is_read: false,
    })
    .select()
    .single();
  if (error) throw new Error(`添加联系表单失败: ${error.message}`);
  return result as Inquiry;
}

// 标记表单为已读
export async function markInquiryAsRead(id: string): Promise<boolean> {
  const { error } = await getClient()
    .from('inquiries')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw new Error(`标记已读失败: ${error.message}`);
  return true;
}

// 删除联系表单
export async function deleteInquiry(id: string): Promise<boolean> {
  const { error } = await getClient()
    .from('inquiries')
    .delete()
    .eq('id', id);
  if (error) throw new Error(`删除联系表单失败: ${error.message}`);
  return true;
}

// 获取未读数量
export async function getUnreadCount(): Promise<number> {
  const { count, error } = await getClient()
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
  if (error) throw new Error(`获取未读数量失败: ${error.message}`);
  return count || 0;
}

// ============ 网站配置操作 ============

// 获取网站配置（key-value 结构）
export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await getClient()
    .from('settings')
    .select('key, value');
  if (error) throw new Error(`获取配置失败: ${error.message}`);

  if (!data || data.length === 0) {
    return DEFAULT_SETTINGS;
  }

  // 将 key-value 数组转为对象
  const kvMap: Record<string, string> = {};
  data.forEach((row: { key: string; value: string }) => {
    kvMap[row.key] = row.value;
  });

  return {
    whatsappPhone: kvMap['whatsappPhone'] || DEFAULT_SETTINGS.whatsappPhone,
    facebookPixelId: kvMap['facebookPixelId'] || '',
    googleAnalyticsId: kvMap['googleAnalyticsId'] || '',
    tiktokPixelId: kvMap['tiktokPixelId'] || '',
    adminPassword: kvMap['adminPassword'] || DEFAULT_SETTINGS.adminPassword,
  };
}

// 更新网站配置（key-value 结构，使用 upsert）
export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const keyMap: Record<string, string> = {};
  if (updates.whatsappPhone !== undefined) keyMap['whatsappPhone'] = updates.whatsappPhone;
  if (updates.facebookPixelId !== undefined) keyMap['facebookPixelId'] = updates.facebookPixelId;
  if (updates.googleAnalyticsId !== undefined) keyMap['googleAnalyticsId'] = updates.googleAnalyticsId;
  if (updates.tiktokPixelId !== undefined) keyMap['tiktokPixelId'] = updates.tiktokPixelId;
  if (updates.adminPassword !== undefined) keyMap['adminPassword'] = updates.adminPassword;

  const entries = Object.entries(keyMap);
  if (entries.length > 0) {
    const rows = entries.map(([key, value]) => ({ key, value }));
    const { error } = await getClient()
      .from('settings')
      .upsert(rows, { onConflict: 'key' });
    if (error) throw new Error(`更新配置失败: ${error.message}`);
  }
  
  return getSettings();
}

// 验证管理员密码
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const settings = await getSettings();
  return password === settings.adminPassword;
}

// ============ 流量统计操作 ============

// 记录访问
export async function recordVisit(data: { date: string; path: string; country: string; referrer: string; userAgent: string; searchKeyword: string }): Promise<TrafficRecord> {
  const { data: result, error } = await getClient()
    .from('traffic')
    .insert({
      date: data.date,
      path: data.path,
      country: data.country,
      referrer: data.referrer,
      user_agent: data.userAgent,
      search_keyword: data.searchKeyword,
    })
    .select()
    .single();
  if (error) throw new Error(`记录访问失败: ${error.message}`);
  return result as TrafficRecord;
}

// 获取流量统计
export async function getTrafficStats(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];
  
  const { data, error } = await getClient()
    .from('traffic')
    .select('date, path, country, search_keyword')
    .gte('date', startDateStr)
    .order('date', { ascending: true });
  if (error) throw new Error(`获取流量统计失败: ${error.message}`);
  
  const records = data || [];
  
  // 每日流量
  const dailyTraffic: Record<string, number> = {};
  records.forEach((r: { date: string }) => {
    dailyTraffic[r.date] = (dailyTraffic[r.date] || 0) + 1;
  });
  
  // 来源国家
  const countryStats: Record<string, number> = {};
  records.forEach((r: { country: string }) => {
    const country = r.country || 'Unknown';
    countryStats[country] = (countryStats[country] || 0) + 1;
  });
  
  // 搜索关键词
  const keywordStats: Record<string, number> = {};
  records.forEach((r: { search_keyword: string }) => {
    if (r.search_keyword) {
      keywordStats[r.search_keyword] = (keywordStats[r.search_keyword] || 0) + 1;
    }
  });
  
  // 热门页面
  const pageStats: Record<string, number> = {};
  records.forEach((r: { path: string }) => {
    pageStats[r.path] = (pageStats[r.path] || 0) + 1;
  });
  
  return {
    dailyTraffic,
    countryStats,
    keywordStats,
    pageStats,
    totalVisits: records.length,
  };
}

// 根据IP获取国家（简化版）
export function getCountryFromIP(ip: string): string {
  const ipPrefix = ip.split('.')[0];
  const prefixNum = parseInt(ipPrefix, 10);
  
  if (prefixNum >= 1 && prefixNum <= 9) return 'US';
  if (prefixNum >= 10 && prefixNum <= 15) return 'EU';
  if (prefixNum >= 16 && prefixNum <= 30) return 'US';
  if (prefixNum >= 31 && prefixNum <= 50) return 'EU';
  if (prefixNum >= 51 && prefixNum <= 80) return 'US';
  if (prefixNum >= 81 && prefixNum <= 100) return 'CN';
  if (prefixNum >= 101 && prefixNum <= 120) return 'JP';
  if (prefixNum >= 121 && prefixNum <= 150) return 'US';
  if (prefixNum >= 151 && prefixNum <= 180) return 'EU';
  if (prefixNum >= 181 && prefixNum <= 200) return 'BR';
  if (prefixNum >= 201 && prefixNum <= 220) return 'US';
  if (prefixNum >= 221 && prefixNum <= 255) return 'EU';
  return 'Unknown';
}

// 从Referer提取搜索关键词
export function extractSearchKeyword(referer: string): string {
  if (!referer) return '';
  
  const googleMatch = referer.match(/[?&]q=([^&]+)/);
  if (googleMatch) return decodeURIComponent(googleMatch[1]);
  
  const bingMatch = referer.match(/[?&]q=([^&]+)/);
  if (bingMatch) return decodeURIComponent(bingMatch[1]);
  
  const baiduMatch = referer.match(/[?&]wd=([^&]+)/);
  if (baiduMatch) return decodeURIComponent(baiduMatch[1]);
  
  return '';
}
