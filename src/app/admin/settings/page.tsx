'use client';

import { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, MessageCircle, BarChart3, Tag } from 'lucide-react';

interface Settings {
  whatsappPhone: string;
  facebookPixelId: string;
  googleAnalyticsId: string;
  tiktokPixelId: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    whatsappPhone: '',
    facebookPixelId: '',
    googleAnalyticsId: '',
    tiktokPixelId: '',
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings({
        whatsappPhone: data.whatsappPhone || '',
        facebookPixelId: data.facebookPixelId || '',
        googleAnalyticsId: data.googleAnalyticsId || '',
        tiktokPixelId: data.tiktokPixelId || '',
      });
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!password) {
      setStatus('error');
      setErrorMsg('Please enter your admin password to save changes');
      return;
    }

    setSaving(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          whatsappPhone: settings.whatsappPhone,
          facebookPixelId: settings.facebookPixelId,
          googleAnalyticsId: settings.googleAnalyticsId,
          tiktokPixelId: settings.tiktokPixelId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setStatus('success');
      setPassword('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">网站设置</h1>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
          <Check className="w-5 h-5" />
          设置已保存
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {errorMsg}
        </div>
      )}

      {/* WhatsApp Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">WhatsApp 联系方式</h2>
            <p className="text-sm text-gray-500">客户咨询将跳转至此号码</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp 号码（含国家代码）
            </label>
            <input
              type="text"
              value={settings.whatsappPhone}
              onChange={(e) => setSettings((prev) => ({ ...prev, whatsappPhone: e.target.value }))}
              placeholder="491234567890"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              输入号码时不加 + 或空格。例如：491234567890（德国）
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              预览链接：<code className="text-blue-600">https://wa.me/{settings.whatsappPhone || '491234567890'}</code>
            </p>
          </div>
        </div>
      </div>

      {/* Facebook Pixel */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Facebook Pixel</h2>
            <p className="text-sm text-gray-500">跟踪转化和建立受众</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pixel ID
          </label>
          <input
            type="text"
            value={settings.facebookPixelId}
            onChange={(e) => setSettings((prev) => ({ ...prev, facebookPixelId: e.target.value }))}
            placeholder="123456789012345"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">
            在 Facebook 事件管理器中查找 Pixel ID
          </p>
        </div>
      </div>

      {/* Google Analytics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Google Analytics</h2>
            <p className="text-sm text-gray-500">跟踪网站流量和用户行为</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Measurement ID
          </label>
          <input
            type="text"
            value={settings.googleAnalyticsId}
            onChange={(e) => setSettings((prev) => ({ ...prev, googleAnalyticsId: e.target.value }))}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">
            在 Google Analytics 管理 → 数据流中查找 Measurement ID
          </p>
        </div>
      </div>

      {/* TikTok Pixel */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.74a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.17z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">TikTok Pixel</h2>
            <p className="text-sm text-gray-500">跟踪 TikTok 广告转化和事件</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pixel ID
          </label>
          <input
            type="text"
            value={settings.tiktokPixelId}
            onChange={(e) => setSettings((prev) => ({ ...prev, tiktokPixelId: e.target.value }))}
            placeholder="CXXXXXXXXXXXXXXX"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">
            在 TikTok 广告管理器 → 资产 → 事件中查找 Pixel ID
          </p>
        </div>
      </div>

      {/* Save Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">保存更改</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              确认管理员密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
