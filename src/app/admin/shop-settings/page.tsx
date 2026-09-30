'use client';

import { useEffect, useState } from 'react';
import { Save, Check, KeyRound, Building2, MessageCircle, AlertCircle } from 'lucide-react';

export default function ShopSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [settings, setSettings] = useState({
    siteName: '', whatsappNumber: '', whatsappMessage: '',
    currency: 'usd', companyName: '', companyAddress: '', companyPhone: '',
    stripePublishableKey: '',
  });
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState('');

  useEffect(() => {
    const pw = localStorage.getItem('shop_admin_password');
    if (!pw) return;
    fetch('/api/shop/settings', { headers: { 'x-admin-password': pw } })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return;
        setSettings({
          siteName: d.siteName || '', whatsappNumber: d.whatsappNumber || '',
          whatsappMessage: d.whatsappMessage || '', currency: d.currency || 'usd',
          companyName: d.companyName || '', companyAddress: d.companyAddress || '',
          companyPhone: d.companyPhone || '', stripePublishableKey: d.stripePublishableKey || '',
        });
      });
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
          stripeSecretKey, stripeWebhookSecret,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setMsg({ type: 'ok', text: 'Settings saved.' });
    } catch (e) {
      setMsg({ type: 'err', text: e instanceof Error ? e.message : 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof settings) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        value={settings[key] as string}
        onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  if (!localStorage.getItem('shop_admin_password')) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-sm">
        <h2 className="text-lg font-bold text-gray-900">Shop Settings</h2>
        <p className="text-sm text-gray-500 mt-1">Please open the 商城订单 page and log in first.</p>
      </div>
    );
  }

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

      {/* Stripe */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <KeyRound className="w-5 h-5 text-blue-600" /> Stripe Payment
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Publishable Key</label>
            <input
              value={settings.stripePublishableKey}
              onChange={(e) => setSettings((s) => ({ ...s, stripePublishableKey: e.target.value }))}
              placeholder="pk_live_..."
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
            <input
              type="password"
              value={stripeSecretKey}
              onChange={(e) => setStripeSecretKey(e.target.value)}
              placeholder="sk_live_...  (leave blank to keep current)"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
            <input
              type="password"
              value={stripeWebhookSecret}
              onChange={(e) => setStripeWebhookSecret(e.target.value)}
              placeholder="whsec_...  (leave blank to keep current)"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input
              value={settings.currency}
              onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value.toLowerCase() }))}
              placeholder="usd"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Webhook endpoint:
          <code className="ml-1 bg-gray-100 px-1.5 py-0.5 rounded text-blue-600">
            {typeof window !== 'undefined' ? window.location.origin : ''}/api/shop/webhook
          </code>
          — add it in Stripe (event: <code>payment_intent.succeeded</code> &amp; <code>payment_intent.payment_failed</code>)
          to auto-mark orders as paid.
        </p>
      </div>

      {/* Company */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Building2 className="w-5 h-5 text-gray-600" /> Company Info
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field('Company Name', 'companyName')}
          {field('Company Phone', 'companyPhone')}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
            <input
              value={settings.companyAddress}
              onChange={(e) => setSettings((s) => ({ ...s, companyAddress: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <MessageCircle className="w-5 h-5 text-green-600" /> WhatsApp Support
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field('WhatsApp Number', 'whatsappNumber')}
          {field('Site Name', 'siteName')}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Message</label>
            <textarea
              value={settings.whatsappMessage}
              onChange={(e) => setSettings((s) => ({ ...s, whatsappMessage: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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