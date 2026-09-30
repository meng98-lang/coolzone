'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, CircleDashed, XCircle, Package, Copy } from 'lucide-react';

interface ShopOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface ShopOrder {
  id: string;
  order_number: string;
  items: ShopOrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  country: string | null;
  address: string | null;
  message: string | null;
  payment_status: string;
  payment_method: string | null;
  stripe_payment_intent: string | null;
  status: string;
  created_at: string;
}

const statusMeta: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  paid: { label: 'Paid', icon: CheckCircle2, cls: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', icon: CircleDashed, cls: 'bg-amber-100 text-amber-700' },
  failed: { label: 'Failed', icon: XCircle, cls: 'bg-red-100 text-red-700' },
};

export default function ShopOrdersPage() {
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [authing, setAuthing] = useState(false);
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState('');

  const load = async (pw: string) => {
    setLoading(true);
    setErr('');
    try {
      const res = await fetch('/api/shop/orders', {
        headers: { 'x-admin-password': pw },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setOrders(json.orders || []);
      localStorage.setItem('shop_admin_password', pw);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('shop_admin_password');
    if (saved) {
      load(saved);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    load(password).finally(() => setAuthing(false));
    setPassword('');
  };

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });

  const copy = (val: string) => {
    navigator.clipboard?.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(''), 1200);
  };

  const paid = orders.filter((o) => o.payment_status === 'paid').length;
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="space-y-6">
      {!localStorage.getItem('shop_admin_password') && (
        <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-sm max-w-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Shop Orders Access</h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter the shop admin password to view customer orders &amp; payments.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
          <button
            type="submit"
            disabled={authing}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 text-sm transition disabled:opacity-50"
          >
            {authing ? 'Checking…' : 'View Orders'}
          </button>
        </form>
      )}

      {localStorage.getItem('shop_admin_password') && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-sm text-gray-500">Total Orders</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-sm text-gray-500">Paid</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{paid}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-sm text-gray-500">Revenue (paid)</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">
                ${totalRevenue.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">商城订单（Shop Orders）</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => load(localStorage.getItem('shop_admin_password') || '')}
                className="flex items-center gap-1.5 rounded-xl bg-white border px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('shop_admin_password');
                  setPassword('');
                  setOrders([]);
                }}
                className="rounded-xl bg-white border px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                Lock
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => {
                const meta = statusMeta[o.payment_status] || statusMeta.pending;
                const StatusIcon = meta.icon;
                return (
                  <div key={o.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-gray-900">{o.order_number}</span>
                        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${meta.cls}`}>
                          <StatusIcon className="w-3.5 h-3.5" /> {meta.label}
                        </span>
                        <span className="text-xs text-gray-400">{fmtTime(o.created_at)}</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {o.currency?.toUpperCase()} {Number(o.total).toFixed(2)}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Items */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Items</h4>
                        <div className="space-y-1.5">
                          {(Array.isArray(o.items) ? o.items : []).map((it, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">
                                {it.name} <span className="text-gray-400">× {it.qty}</span>
                              </span>
                              <span className="font-medium">
                                {o.currency?.toUpperCase()} {(it.price * it.qty).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Customer */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Customer</h4>
                        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                          {o.customer_name && (
                            <>
                              <span className="text-gray-400">Name</span>
                              <span className="text-gray-700">{o.customer_name}</span>
                            </>
                          )}
                          {o.customer_email && (
                            <>
                              <span className="text-gray-400">Email</span>
                              <span className="text-gray-700">{o.customer_email}</span>
                            </>
                          )}
                          {o.customer_phone && (
                            <>
                              <span className="text-gray-400">Phone</span>
                              <span className="text-gray-700">{o.customer_phone}</span>
                            </>
                          )}
                          {o.country && (
                            <>
                              <span className="text-gray-400">Country</span>
                              <span className="text-gray-700">{o.country}</span>
                            </>
                          )}
                          {o.address && (
                            <>
                              <span className="text-gray-400">Address</span>
                              <span className="text-gray-700">{o.address}</span>
                            </>
                          )}
                          {o.message && (
                            <>
                              <span className="text-gray-400">Message</span>
                              <span className="text-gray-700">{o.message}</span>
                            </>
                          )}
                        </div>
                        {o.stripe_payment_intent && (
                          <div className="mt-2 text-xs">
                            <span className="text-gray-400">Payment ID:</span>
                            <button
                              onClick={() => copy(o.stripe_payment_intent!)}
                              className="ml-1 font-mono text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              {copied === o.stripe_payment_intent ? 'Copied ✓' : o.stripe_payment_intent.slice(-16)}
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}