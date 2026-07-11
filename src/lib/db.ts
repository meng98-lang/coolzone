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
