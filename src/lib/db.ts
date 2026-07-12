/**
 * 数据存储模块
 * 使用JSON文件存储联系表单和网站配置
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// 数据目录
const DATA_DIR = join(process.cwd(), 'data');

// 确保数据目录存在
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// 文件路径
const INQUIRIES_FILE = join(DATA_DIR, 'inquiries.json');
const SETTINGS_FILE = join(DATA_DIR, 'settings.json');
const TRAFFIC_FILE = join(DATA_DIR, 'traffic.json');

// 联系表单数据类型
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// 网站配置类型
export interface SiteSettings {
  whatsappPhone: string;
  facebookPixelId: string;
  googleAnalyticsId: string;
  adminPassword: string;
}

// 默认配置
const DEFAULT_SETTINGS: SiteSettings = {
  whatsappPhone: '491234567890', // 替换为你的WhatsApp号码（含国际区号）
  facebookPixelId: '',
  googleAnalyticsId: '',
  adminPassword: 'coolzone2024', // 后台密码，请修改
};

// 读取JSON文件
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (!existsSync(filePath)) {
      writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return defaultValue;
  }
}

// 写入JSON文件
function writeJsonFile<T>(filePath: string, data: T): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ============ 联系表单操作 ============

// 获取所有联系表单
export function getInquiries(): Inquiry[] {
  return readJsonFile<Inquiry[]>(INQUIRIES_FILE, []);
}

// 添加联系表单
export function addInquiry(data: Omit<Inquiry, 'id' | 'createdAt' | 'read'>): Inquiry {
  const inquiries = getInquiries();
  const newInquiry: Inquiry = {
    ...data,
    id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  inquiries.unshift(newInquiry); // 新消息在最前面
  writeJsonFile(INQUIRIES_FILE, inquiries);
  return newInquiry;
}

// 标记表单为已读
export function markInquiryAsRead(id: string): boolean {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((inq) => inq.id === id);
  if (index === -1) return false;
  inquiries[index].read = true;
  writeJsonFile(INQUIRIES_FILE, inquiries);
  return true;
}

// 删除联系表单
export function deleteInquiry(id: string): boolean {
  const inquiries = getInquiries();
  const filtered = inquiries.filter((inq) => inq.id !== id);
  if (filtered.length === inquiries.length) return false;
  writeJsonFile(INQUIRIES_FILE, filtered);
  return true;
}

// 获取未读数量
export function getUnreadCount(): number {
  const inquiries = getInquiries();
  return inquiries.filter((inq) => !inq.read).length;
}

// ============ 网站配置操作 ============

// 获取网站配置
export function getSettings(): SiteSettings {
  return readJsonFile<SiteSettings>(SETTINGS_FILE, DEFAULT_SETTINGS);
}

// 更新网站配置
export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  const settings = getSettings();
  const updated = { ...settings, ...updates };
  writeJsonFile(SETTINGS_FILE, updated);
  return updated;
}

// 验证管理员密码
export function verifyAdminPassword(password: string): boolean {
  const settings = getSettings();
  return password === settings.adminPassword;
}

// ============ 流量统计操作 ============

// 流量记录类型
export interface TrafficRecord {
  id: string;
  timestamp: string;
  path: string;
  ip: string;
  country: string;
  userAgent: string;
  referer: string;
  searchKeyword: string;
}

// 获取所有流量记录
export function getTrafficRecords(): TrafficRecord[] {
  return readJsonFile<TrafficRecord[]>(TRAFFIC_FILE, []);
}

// 记录访问
export function recordVisit(data: Omit<TrafficRecord, 'id' | 'timestamp'>): TrafficRecord {
  const records = getTrafficRecords();
  const newRecord: TrafficRecord = {
    ...data,
    id: `trf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  records.unshift(newRecord);
  // 只保留最近10000条记录，避免文件过大
  if (records.length > 10000) {
    records.length = 10000;
  }
  writeJsonFile(TRAFFIC_FILE, records);
  return newRecord;
}

// 根据IP获取国家（简化版，实际应使用IP地理位置API）
export function getCountryFromIP(ip: string): string {
  // 简化的IP国家判断（仅用于演示，实际应使用GeoIP服务）
  const ipPrefix = ip.split('.')[0];
  const prefixNum = parseInt(ipPrefix, 10);
  
  // 根据IP段粗略判断国家
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
  
  // Google搜索
  const googleMatch = referer.match(/[?&]q=([^&]+)/);
  if (googleMatch) return decodeURIComponent(googleMatch[1].replace(/\+/g, ' '));
  
  // Bing搜索
  const bingMatch = referer.match(/[?&]q=([^&]+)/);
  if (bingMatch) return decodeURIComponent(bingMatch[1].replace(/\+/g, ' '));
  
  // Baidu搜索
  const baiduMatch = referer.match(/[?&]wd=([^&]+)/);
  if (baiduMatch) return decodeURIComponent(baiduMatch[1].replace(/\+/g, ' '));
  
  return '';
}

// 获取每日统计
export function getDailyStats(days: number = 30): { date: string; visits: number; uniqueVisitors: number }[] {
  const records = getTrafficRecords();
  const stats: Record<string, { visits: number; ips: Set<string> }> = {};
  
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    stats[dateStr] = { visits: 0, ips: new Set() };
  }
  
  records.forEach((record) => {
    const dateStr = record.timestamp.split('T')[0];
    if (stats[dateStr]) {
      stats[dateStr].visits++;
      stats[dateStr].ips.add(record.ip);
    }
  });
  
  return Object.entries(stats)
    .map(([date, data]) => ({
      date,
      visits: data.visits,
      uniqueVisitors: data.ips.size,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// 获取国家统计
export function getCountryStats(): { country: string; visits: number }[] {
  const records = getTrafficRecords();
  const stats: Record<string, number> = {};
  
  records.forEach((record) => {
    const country = record.country || 'Unknown';
    stats[country] = (stats[country] || 0) + 1;
  });
  
  return Object.entries(stats)
    .map(([country, visits]) => ({ country, visits }))
    .sort((a, b) => b.visits - a.visits);
}

// 获取来源统计
export function getSourceStats(): { source: string; visits: number }[] {
  const records = getTrafficRecords();
  const stats: Record<string, number> = {};
  
  records.forEach((record) => {
    let source = 'Direct';
    if (record.referer) {
      try {
        const url = new URL(record.referer);
        source = url.hostname.replace('www.', '');
      } catch {
        source = record.referer.substring(0, 30);
      }
    }
    stats[source] = (stats[source] || 0) + 1;
  });
  
  return Object.entries(stats)
    .map(([source, visits]) => ({ source, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 20);
}

// 获取搜索词统计
export function getKeywordStats(): { keyword: string; visits: number }[] {
  const records = getTrafficRecords();
  const stats: Record<string, number> = {};
  
  records.forEach((record) => {
    if (record.searchKeyword) {
      const keyword = record.searchKeyword.toLowerCase();
      stats[keyword] = (stats[keyword] || 0) + 1;
    }
  });
  
  return Object.entries(stats)
    .map(([keyword, visits]) => ({ keyword, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 20);
}

// 获取页面访问统计
export function getPageStats(): { path: string; visits: number }[] {
  const records = getTrafficRecords();
  const stats: Record<string, number> = {};
  
  records.forEach((record) => {
    stats[record.path] = (stats[record.path] || 0) + 1;
  });
  
  return Object.entries(stats)
    .map(([path, visits]) => ({ path, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 20);
}
