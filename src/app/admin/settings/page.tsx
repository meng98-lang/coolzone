'use client';

import { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, MessageCircle, BarChart3, Tag } from 'lucide-react';

interface Settings {
  whatsappPhone: string;
  facebookPixelId: string;
  googleAnalyticsId: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    whatsappPhone: '',
    facebookPixelId: '',
    googleAnalyticsId: '',
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
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
          <Check className="w-5 h-5" />
          Settings saved successfully
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
            <h2 className="text-lg font-semibold text-gray-900">WhatsApp Contact</h2>
            <p className="text-sm text-gray-500">Customer inquiries will be redirected to this number</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              value={settings.whatsappPhone}
              onChange={(e) => setSettings((prev) => ({ ...prev, whatsappPhone: e.target.value }))}
              placeholder="491234567890"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter number without + or spaces. Example: 491234567890 (Germany)
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Preview link: <code className="text-blue-600">https://wa.me/{settings.whatsappPhone || '491234567890'}</code>
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
            <p className="text-sm text-gray-500">Track conversions and build audiences</p>
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
            Find your Pixel ID in Facebook Events Manager
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
            <p className="text-sm text-gray-500">Track website traffic and user behavior</p>
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
            Find your Measurement ID in Google Analytics Admin → Data Streams
          </p>
        </div>
      </div>

      {/* Save Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Save Changes</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
