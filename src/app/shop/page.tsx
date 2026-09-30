'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ShoppingCart, X, MessageCircle, Plus, Minus, Trash2, ShieldCheck,
  Truck, Lock, Star, Menu, ChevronDown, CreditCard, ArrowRight,
} from 'lucide-react';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import {
  Elements, PaymentElement, useStripe, useElements,
} from '@stripe/react-stripe-js';

/* vim: set ts=2 sw=2: */

interface ShopProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  badge?: string;
  inStock?: boolean;
}

interface ShopProductData {
  products: ShopProduct[];
  currency: string;
  siteName: string;
  whatsappNumber: string;
  whatsappMessage: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  stripePublishableKey: string | null;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

const CATEGORIES = ['All', 'Testosterone', 'HGH', 'Peptides'];

function waLink(number: string, message: string, productName?: string) {
  const text = productName
    ? `Hi, I'm interested in ${productName}. ${message}`
    : message;
  return `https://wa.me/${number.replace(/\+/g, '').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

// ===================== Checkout Form =====================
function CheckoutForm({
  onSuccess, onDone, total, currency,
}: {
  onSuccess: () => void;
  onDone: () => void;
  total: number;
  currency: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/shop?pay=ok' },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed. Please try again.');
      setProcessing(false);
    } else {
      // PaymentIntent user-side confirmed without redirect
      onSuccess();
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3">
          {error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={!stripe || processing}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-black font-bold py-3.5 transition disabled:opacity-50"
      >
        <Lock className="w-4 h-4" />
        {processing ? 'Processing…' : `Pay ${currency} ${total.toFixed(2)} securely`}
      </button>
      <button
        onClick={onDone}
        className="w-full text-center text-sm text-gray-400 hover:text-white transition"
      >
        ← Back
      </button>
    </div>
  );
}

// Checkout modal wrapped in Elements
function CheckoutModal({
  clientSecret, onClose, onDone, onPaid, total, currency, publishableKey,
}: {
  clientSecret: string;
  onClose: () => void;
  onDone: () => void;
  onPaid: () => void;
  total: number;
  currency: string;
  publishableKey: string;
}) {
  const [stripePromise] = useState(() => loadStripe(publishableKey));

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#14161c] border border-white/10 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Secure Checkout</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-4 flex items-center justify-between rounded-xl bg-white/5 p-3">
          <span className="text-gray-300 text-sm">Total due</span>
          <span className="text-white font-bold text-xl">
            {currency} {total.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
          <Lock className="w-3.5 h-3.5" /> Payments encrypted &amp; processed by Stripe
        </div>
        {stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
            <CheckoutForm onSuccess={onPaid} onDone={onDone ?? onClose} total={total} currency={currency} />
          </Elements>
        )}
      </div>
    </div>
  );
}

// ===================== Main Page =====================
export default function ShopPage() {
  const [data, setData] = useState<ShopProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutSecret, setCheckoutSecret] = useState<string | null>(null);
  const [payOk, setPayOk] = useState(false);

  useEffect(() => {
    fetch('/api/shop/products')
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.products) {
          setCart((prev) =>
            prev.filter((c) => d.products.some((p: ShopProduct) => p.id === c.productId))
          );
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));

    const url = new URL(window.location.href);
    if (url.searchParams.get('pay') === 'ok') setPayOk(true);
  }, []);

  const whatsappHref = data
    ? waLink(data.whatsappNumber, data.whatsappMessage)
    : '#';

  const filtered = useMemo(
    () =>
      (data?.products || []).filter(
        (p) => category === 'All' || p.category === category
      ),
    [data, category]
  );

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const currency = data?.currency || 'USD';

  const addToCart = (p: ShopProduct) => {
    if (p.inStock === false) return;
    setCart((prev) => {
      const ex = prev.find((i) => i.productId === p.id);
      if (ex) return prev.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { productId: p.id, name: p.name, price: p.price, qty: 1, image: p.image }];
    });
    setCartOpen(true);
  };

  const updateQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.productId === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.productId !== id));

  const startCheckout = async (contactMethod: 'wa' | 'card') => {
    if (cart.length === 0) return;
    if (contactMethod === 'wa') {
      const msg = data?.whatsappNumber
        ? `Hi, I'd like to order:\n\n${cart
            .map((i) => `• ${i.name} x${i.qty} — ${currency} ${(i.price * i.qty).toFixed(2)}`)
            .join('\n')}\n\nTotal: ${currency} ${cartTotal.toFixed(2)}\nPlease confirm availability & payment.`
        : '';
      window.open(`https://wa.me/${data?.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      return;
    }

    if (!data?.stripePublishableKey) {
      alert('Card payment is being set up — please contact us on WhatsApp to complete your order.');
      return;
    }

    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({ productId: i.productId, qty: i.qty })),
          customerPhone: data.whatsappNumber,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Checkout failed');
      setCheckoutSecret(json.clientSecret);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Checkout failed');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white antialiased">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden text-gray-300 hover:text-white transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 font-black text-xl tracking-tight">
            <span className="bg-gradient-to-r from-[#f0d78c] to-[#b8962e] bg-clip-text text-transparent">
              GSJ
            </span>
            <span className="text-white uppercase text-sm">Outdoor Tech</span>
          </div>
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 rounded-full transition ${category === c ? 'bg-[#d4af37]/20 text-[#f0d78c]' : 'text-gray-300 hover:text-white'}`}
              >
                {c === 'All' ? 'All Products' : c}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-black text-sm font-semibold px-4 py-2 transition"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#d4af37] text-black text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="lg:hidden border-t border-white/10 bg-black/95 px-4 py-3 space-y-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  setMenuOpen(false);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-gray-200 transition"
              >
                {c === 'All' ? 'All Products' : c}
              </button>
            ))}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#25D366]/90 text-black font-semibold"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </nav>
        )}
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/sports/hero-bg.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/60 to-[#0a0a0c]" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#f0d78c] text-xs px-4 py-1.5 mb-5">
            <Star className="w-3.5 h-3.5" /> Trusted supplier — GSM Outdoor Tech
          </p>
          <h1 className="uppercase font-black text-4xl sm:text-6xl leading-[1.05] tracking-tight">
            Premium Performance
            <br />
            <span className="bg-gradient-to-r from-[#f0d78c] to-[#b8962e] bg-clip-text text-transparent">
              Compounds
            </span>
          </h1>
          <p className="mt-5 text-gray-300 max-w-xl mx-auto text-lg">
            Testosterone, HGH, Peptides and more — lab-level quality, discreet worldwide delivery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#products"
              className="rounded-full bg-[#d4af37] hover:bg-[#f0d78c] text-black font-bold px-8 py-3.5 transition"
            >
              Shop Now
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-3.5 font-semibold transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              Get Full Price List on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            For more product info &amp; availability, contact our team on{' '}
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="text-[#25D366] font-semibold hover:underline">
              WhatsApp +1 8014052006
            </a>
          </p>
        </div>
      </section>

      {/* ===== Trust badges ===== */}
      <section className="max-w-6xl mx-auto px-4 pt-4 pb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShieldCheck, t: 'Discreet Packaging', d: 'Secure, plain delivery' },
          { icon: Truck, t: 'Worldwide Shipping', d: 'Reliable global fulfillment' },
          { icon: Lock, t: 'Secure Payment', d: 'Encrypted Stripe checkout' },
          { icon: MessageCircle, t: 'Live Support', d: 'WhatsApp 24/7' },
        ].map((b, i) => (
          <div key={i} className="rounded-2xl bg-[#14161c] border border-white/5 p-5">
            <b.icon className="w-6 h-6 text-[#d4af37] mb-2" />
            <div className="font-semibold text-sm">{b.t}</div>
            <div className="text-xs text-gray-400 mt-0.5">{b.d}</div>
          </div>
        ))}
      </section>

      {/* ===== Products ===== */}
      <section id="products" className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="uppercase font-black text-3xl tracking-tight">Our Range</h2>
            <p className="text-gray-400 mt-1">Select a product, then pay by card or order via WhatsApp</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${category === c ? 'border-[#d4af37] text-[#f0d78c] bg-[#d4af37]/10' : 'border-white/10 text-gray-400 hover:text-white'}`}
              >
                {c === 'All' ? 'All' : c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-3xl bg-[#14161c] p-5 h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="group rounded-3xl bg-[#14161c] border border-white/5 overflow-hidden hover:border-[#d4af37]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,.55)] transition"
              >
                <div className="relative aspect-square overflow-hidden bg-black">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  {p.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-[#d4af37] text-black text-xs font-bold px-3 py-1">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="text-[11px] uppercase tracking-wider text-[#d4af37]">{p.category}</div>
                  <h3 className="font-bold text-lg mt-1 leading-snug">{p.name}</h3>
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{p.description}</p>
                  <div className="flex items-end gap-2 mt-4">
                    <span className="text-xl font-black text-white">
                      {currency} {p.price.toFixed(2)}
                    </span>
                    {p.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {currency} {p.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a
                      href={waLink(data?.whatsappNumber || '18014052006', data?.whatsappMessage || '', p.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 rounded-full border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 text-sm font-semibold py-2.5 transition flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                    <button
                      onClick={() => addToCart(p)}
                      className="flex-1 rounded-full bg-[#d4af37] hover:bg-[#f0d78c] text-black text-sm font-bold py-2.5 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-center text-sm text-gray-400 mt-8">
          Want the full catalog with all dosages &amp; pricing?{' '}
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="text-[#25D366] font-semibold hover:underline">
            Contact us on WhatsApp +1 8014052006
          </a>
        </p>
      </section>

      {/* ===== WhatsApp CTA band ===== */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-[#1e2a1f] to-[#14161c] border border-[#25D366]/30 p-8 sm:p-12 text-center">
          <h2 className="uppercase font-black text-2xl sm:text-3xl">
            Need the full product list &amp; price quote?
          </h2>
          <p className="text-gray-300 mt-3 max-w-xl mx-auto">
            Our team will send you the complete catalog with all product details and current pricing — free and fast.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-black font-bold px-8 py-4 mt-6 transition"
          >
            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/10 bg-black/40 mt-6">
        <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-black text-lg">
              <span className="bg-gradient-to-r from-[#f0d78c] to-[#b8962e] bg-clip-text text-transparent">GSJ</span>
              <span className="text-white"> Outdoor Tech</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {data?.companyName || 'GSJ Outdoor Tech LLC'}
            </p>
            <p className="text-sm text-gray-400 mt-1">{data?.companyAddress}</p>
            <p className="text-sm text-gray-400 mt-1">{data?.companyPhone}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-gray-200">Contact</h4>
            <p className="text-sm text-gray-400">
              For more product information, please contact our customer service:{' '}
              <a
                href={`https://wa.me/${(data?.whatsappNumber || '18014052006').replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#25D366] font-semibold"
              >
                WhatsApp +1 8014052006
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-gray-200">Payment</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <CreditCard className="w-4 h-4 text-[#d4af37]" />
              Secure checkout by Stripe
            </div>
            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} {data?.companyName || 'GSJ Outdoor Tech LLC'}. All rights reserved.
            </p>
          </div>
        </div>
        <div className="border-t border-white/5 px-4 py-4 text-center">
          <p className="text-xs text-gray-500 max-w-3xl mx-auto">
            The products listed are intended for informed adults. Consult a licensed professional before use.
            This site is an informational commercial page; placing an order is subject to availability and
            applicable local regulations.
          </p>
        </div>
      </footer>

      {/* ===== WhatsApp floating ===== */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,.4)] transition hover:scale-105"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* ===== Cart Sidebar ===== */}
      {cartOpen && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-[#101218] border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">Your Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 && (
                <p className="text-gray-400 text-center mt-10">Your cart is empty.</p>
              )}
              {cart.map((i) => (
                <div key={i.productId} className="flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0">
                    <Image src={i.image} alt={i.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{i.name}</div>
                    <div className="text-xs text-gray-400">
                      {currency} {i.price.toFixed(2)} × {i.qty}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQty(i.productId, -1)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-5 text-center">{i.qty}</span>
                      <button onClick={() => updateQty(i.productId, 1)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-bold">{currency} {(i.price * i.qty).toFixed(2)}</div>
                  <button onClick={() => removeFromCart(i.productId)} className="text-gray-500 hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-white/10 p-5 space-y-3">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-white text-base">{currency} {cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => startCheckout('card')}
                  className="w-full rounded-full bg-[#d4af37] hover:bg-[#f0d78c] text-black font-bold py-3.5 transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Pay Securely with Card
                </button>
                <button
                  onClick={() => {
                    startCheckout('wa');
                    setCartOpen(false);
                  }}
                  className="w-full rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-black font-bold py-3.5 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Checkout Modal ===== */}
      {checkoutSecret && data?.stripePublishableKey && (
        <CheckoutModal
          clientSecret={checkoutSecret}
          onClose={() => { setCheckoutSecret(null); setCartOpen(true); }}
          onDone={() => setCheckoutSecret(null)}
          onPaid={() => {
            setCheckoutSecret(null);
            setCartOpen(false);
            setCart([]);
            setPayOk(true);
          }}
          total={cartTotal}
          currency={currency}
          publishableKey={data.stripePublishableKey}
        />
      )}

      {/* ===== Pay OK toast ===== */}
      {payOk && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] rounded-full bg-[#25D366] text-black font-bold px-6 py-3 shadow-xl flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" /> Payment received — thank you! We&apos;ll contact you shortly.
        </div>
      )}
    </main>
  );
}