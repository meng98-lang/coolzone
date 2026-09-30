'use client';

import { useEffect, useState } from 'react';
import { Save, Check, KeyRound, Building2, MessageCircle, AlertCircle } from 'lucide-react';

interface SettingsState {
  siteName: string;
  whatsappNumber: string;
  whatsappMessage: string;
  currency: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  squareApplicationId: string;
  squareLocationId: string;
  squareEnvironment: string;
}

export default function ShopSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<SettingsState>({
    siteName: '', whatsappNumber: '', whatsappMessage: '',
    currency: 'usd', companyName: '', companyAddress: '', companyPhone: '',
    squareApplicationId: '', squareLocationId: '', squareEnvironment: 'production',
  });
  const [squareAccessToken, setSquareAccessToken] = useState('');
  const [squareWebhookSecret, setSquareWebhookSecret] = useState('');

  useEffect(() => {
    const pw = localStorage.getItem('shop_admin_password');
    if (!pw) { setReady(true); return; }
    fetch('/api/shop/settings', { headers: { 'x-admin-password': pw } })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return;
        setSettings({
          siteName: d.siteName || '', whatsappNumber: d.whatsappNumber || '',
          whatsappMessage: d.whatsappMessage || '', currency: d.currency || 'usd',
          companyName: d.companyName || '', companyAddress: d.companyAddress || '',
          companyPhone: d.companyPhone || '',
          squareApplicationId: d.squareApplicationId || '',
          squareLocationId: d.squareLocationId || '',
          squareEnvironment: d.squareEnvironment || 'production',
        });
      })
      .finally(() => setReady(true));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const pw = localStorage.getItem('shop_admin_password') || '';
      const res = await fetch('/api/shop/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: pw, ...settings,
          squareAccessToken, squareWebhookSecret,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setMsg({ type: 'ok', text: 'Settings saved.' });
      setSquareAccessToken('');
      setSquareWebhookSecret('');
    } catch (e) {
      setMsg({ type: 'err', text: e instanceof Error ? e.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  if (!ready) return <div className="text-sm text-gray-400">Loading…</div>;

  if (!localStorage.getItem('shop_admin_password')) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-sm">
        <h2 className="text-lg font-bold text-gray-900">Shop Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Please open the 商城订单 page and log in first.</p>
      </div>
    );
  }

  const inputCls = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">商城设置（Shop Settings）</h1>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 text-sm transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 rounded-xl p-3 text-sm ${msg.type === 'ok' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg.type === 'ok' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      {/* Square */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <KeyRound className="w-5 h-5 text-blue-600" /> Square Payment
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application ID</label>
            <input
              value={settings.squareApplicationId}
              onChange={(e) => set('squareApplicationId', e.target.value)}
              placeholder="sandbox-... / sq0idp-..."
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location ID</label>
            <input
              value={settings.squareLocationId}
              onChange={(e) => set('squareLocationId', e.target.value)}
              placeholder="LXXXXXXXXXX"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
            <input
              type="password"
              value={squareAccessToken}
              onChange={(e) => setSquareAccessToken(e.target.value)}
              placeholder="EAAA... / sq0atp-... (blank = keep current)"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Signature Key</label>
            <input
              type="password"
              value={squareWebhookSecret}
              onChange={(e) => setSquareWebhookSecret(e.target.value)}
              placeholder="wh-... (blank = keep current)"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input
              value={settings.currency}
              onChange={(e) => set('currency', e.target.value.toLowerCase())}
              placeholder="usd"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
            <select
              value={settings.squareEnvironment}
              onChange={(e) => set('squareEnvironment', e.target.value)}
              className={inputCls}
            >
              <option value="production">Production (Live)</option>
              <option value="sandbox">Sandbox (Test)</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Where to get these keys: Square Developer Dashboard → your app.
          Application ID 与 Access Token 在 <code>Credentials</code> 页，Location ID 在 <code>Locations</code> API
          或线上后台 <code>Settings → Account &amp; Settings</code>。Webhook Signature Key 在
          <code> Developer Dashboard → Webhooks → Subscriptions</code>（需先订阅
          <code> payment.updated</code> 事件，地址
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-600">
            {typeof window !== 'undefined' ? window.location.origin : ''}/api/shop/webhook
          </code>
          ），用于自动把订单标记为已付款。
        </p>
      </div>

      {/* Company */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Building2 className="w-5 h-5 text-gray-600" /> Company Info
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input value={settings.companyName} onChange={(e) => set('companyName', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Phone</label>
            <input value={settings.companyPhone} onChange={(e) => set('companyPhone', e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
            <input value={settings.companyAddress} onChange={(e) => set('companyAddress', e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <MessageCircle className="w-5 h-5 text-green-600" /> WhatsApp Support
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input value={settings.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input value={settings.siteName} onChange={(e) => set('siteName', e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Message</label>
            <textarea
              value={settings.whatsappMessage}
              onChange={(e) => set('whatsappMessage', e.target.value)}
              rows={2}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 text-sm transition disabled:opacity-50"
      >
        <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save All Settings'}
      </button>
    </form>
  );
}
