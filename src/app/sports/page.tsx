'use client';

import Script from 'next/script';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  MessageCircle,
  Dumbbell,
  ShieldCheck,
  PackageCheck,
  Truck,
  Timer,
  Target,
  Zap,
  Check,
} from 'lucide-react';

/**
 * Sports / Performance Products — English landing page.
 * Primary conversion: Click-to-WhatsApp (quote request).
 * TikTok Pixel: page() on load + WhatsAppClick / Lead events on CTA.
 *
 * TikTok Pixel ID is configurable below. Replace with your own ID.
 */
const TIKTOK_PIXEL_ID = 'DAQ0T3RC77U17TEHS070';
const WHATSAPP_NUMBER = '18014052006'; // +1 801 405 2006
const WA_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hi, I\'m interested in your products. Could you send me the price list?'
)}`;

const NAV_ITEMS = ['Products', 'Why Us', 'Shipping'];
const TRUST_BADGES = [
  { icon: ShieldCheck, title: 'Discreet Packaging', desc: 'Plain, secure delivery worldwide' },
  { icon: Truck, title: 'Worldwide Shipping', desc: 'Reliable global fulfillment' },
  { icon: Timer, title: 'Consistent Supply', desc: 'Stable stock, dependable service' },
  { icon: Target, title: 'Trusted Quality', desc: 'Lab-checked product line' },
];

const PRODUCTS = [
  {
    id: 'testosterone',
    name: 'Testosterone range',
    cat: 'Testosterone',
    tag: 'Base & Enanthate blends',
    img: '/sports/vial-1.jpeg',
    badge: 'Core',
  },
  {
    id: 'hgh',
    name: 'HGH / Growth range',
    cat: 'HGH',
    tag: 'Growth hormone formulations',
    img: '/sports/vial-2.jpeg',
    badge: 'Growth',
  },
  {
    id: 'peptides',
    name: 'Peptide range',
    cat: 'Peptides',
    tag: 'Research & sports peptides',
    img: '/sports/vial-3.jpeg',
    badge: 'Peptides',
  },
  {
    id: 'sports',
    name: 'Other sports compounds',
    cat: 'Sports',
    tag: 'Additional performance compounds',
    img: '/sports/vial-4.jpeg',
    badge: 'Extras',
  },
];

function track(event: string, params?: Record<string, unknown>) {
  try {
    const w = window as unknown as { ttq?: { track: (e: string, p?: unknown) => void } };
    if (typeof w.ttq?.track === 'function') {
      w.ttq.track(event, params ?? {});
    }
  } catch {
    /* ttq not ready — ignore */
  }
}

export default function SportsLanding() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const handler = () => {
      const mid = document.getElementById('midpoint');
      if (mid && window.scrollY > mid.getBoundingClientRect().top) setActive('products');
      else setActive('');
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white antialiased">
      {/* TikTok Pixel */}
      <Script id="ttq" strategy="afterInteractive">
        {`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${TIKTOK_PIXEL_ID}');
            ttq.page();
          }(window, document, 'ttq');
        `}
      </Script>

      {/* <body id="bg"> (visual layer) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_50%_-10%,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0c]/85 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#f0d78c] to-[#b8962e] text-black">
                <Dumbbell className="h-5 w-5" />
              </span>
              <span className="text-lg font-black uppercase tracking-wide">
                <span className="gold-grad">Prime</span> Compounds
              </span>
            </div>
            <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
              {NAV_ITEMS.map((n) => (
                <a key={n} href={n === 'Products' ? '#products' : n === 'Shipping' ? '#trust' : '#why'} className="transition hover:text-white">
                  {n}
                </a>
              ))}
            </nav>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('WhatsAppClick', { content_name: 'header_cta' })}
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#1ebe5d]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#e8cd6a]">
                <Zap className="h-3.5 w-3.5" /> Sports & Performance Line
              </p>
              <h1 className="text-5xl font-black uppercase leading-[0.95] md:text-6xl">
                Train harder.
                <br />
                <span className="gold-grad">Get stronger.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
                We currently carry <strong className="text-white">Testosterone, HGH, Peptides</strong> and{' '}
                <strong className="text-white">other sports compounds</strong>. Tell us what you are interested
                in and our team will send you the full quote list on WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('WhatsAppClick', { content_name: 'hero_cta' })}
                  className="wa-cta"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat with us on WhatsApp
                </a>
                <a
                  href="#products"
                  className="flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-semibold text-white/80 transition hover:border-white/50 hover:text-white"
                >
                  Browse Products
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                <Image src="/sports/hero-bg.jpeg" alt="Performance products" width={1400} height={800} className="h-full w-full object-cover" priority fetchPriority="high" />
              </div>
              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-[#d4af37]/40 bg-[#14161c]/95 px-5 py-3 shadow-xl backdrop-blur">
                <p className="text-2xl font-black text-[#e8cd6a]">WhatsApp</p>
                <p className="text-xs text-white/60">Instant price list</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section id="trust" className="border-y border-white/10 bg-[#0e1015]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 md:grid-cols-4">
            {TRUST_BADGES.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#d4af37]/15 text-[#e8cd6a]">
                  <b.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-white">{b.title}</p>
                  <p className="text-sm text-white/55">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mx-auto max-w-6xl px-5 py-20" style={{ scrollMarginTop: 70 }}>
          <div id="midpoint" className="sr-only" />
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e8cd6a]">Our Line-Up</p>
            <h2 className="mt-3 text-4xl font-black uppercase md:text-5xl">
              What <span className="gold-grad">we carry</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Choose a category, tap WhatsApp and ask for the full quote list. Fast, clear answers from our team.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#14161c] transition duration-300 hover:-translate-y-1 hover:border-[#d4af37]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="relative aspect-square overflow-hidden">
                  <Image src={p.img} alt={p.name} width={900} height={900} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#f0d78c] to-[#b8962e] px-3 py-1 text-[11px] font-black uppercase text-black">
                    {p.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs uppercase tracking-widest text-[#e8cd6a]">{p.cat}</p>
                  <h3 className="mt-1 font-black uppercase leading-tight">{p.name}</h3>
                  <p className="mt-1 text-sm text-white/55">{p.tag}</p>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('WhatsAppClick', { content_name: 'product_' + p.id })}
                    className="mt-4 flex items-center justify-center gap-2 rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-4 py-2.5 text-sm font-bold text-[#4be388] transition hover:bg-[#25D366] hover:text-black"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ask Price
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why us */}
        <section id="why" className="border-t border-white/10 bg-[#0e1015]">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e8cd6a]">Why Choose Us</p>
              <h2 className="mt-3 text-4xl font-black uppercase md:text-5xl">
                The <span className="gold-grad">advantage</span>
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Dumbbell, t: 'Performance Focused', d: 'A curated range built around sports and training goals.' },
                { icon: ShieldCheck, t: 'Trusted Quality', d: 'Consistent, lab-checked products with clear lineage.' },
                { icon: PackageCheck, t: 'Secure & Discreet', d: 'Plain packaging so your delivery stays private.' },
                { icon: Timer, t: 'Fast Support', d: 'Get answers and quotes directly on WhatsApp, fast.' },
              ].map((f) => (
                <div key={f.t} className="rounded-2xl border border-white/10 bg-[#14161c] p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#f0d78c] to-[#b8962e] text-black">
                    <f.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-black uppercase">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(800px_300px_at_50%_100%,rgba(212,175,55,0.15),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
            <h2 className="text-4xl font-black uppercase md:text-5xl">
              Ready to get the <span className="gold-grad">price list?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/60">
              Tap below and tell our team which products you are interested in. We will send the full quote on WhatsApp.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('Lead', { content_name: 'final_cta' })}
                className="wa-cta pulse"
              >
                <MessageCircle className="h-5 w-5" />
                Get the Price List
              </a>
            </div>
          </div>
        </section>

        {/* Compliance footer */}
        <footer id="foot" className="border-t border-white/10 bg-[#0a0a0c]">
          <div className="mx-auto max-w-6xl px-5 py-10">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#f0d78c] to-[#b8962e] text-black">
                  <Dumbbell className="h-4 w-4" />
                </span>
                <span className="text-sm font-black uppercase"><span className="gold-grad">Prime</span> Compounds</span>
              </div>
              <p className="max-w-md text-center text-xs leading-relaxed text-white/40 md:text-left">
                Disclaimer: This website provides general product category information. Products shown are for
                informational purposes. Please consult applicable laws in your jurisdiction and a qualified
                professional before purchasing or using any product. We do not provide medical advice.
              </p>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Check className="h-4 w-4 text-[#4be388]" /> Contact via WhatsApp +1 801 405 2006
              </div>
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp */}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('WhatsAppClick', { content_name: 'floating' })}
          className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-black shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition hover:scale-105 hover:bg-[#1ebe5d]"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="h-7 w-7 fill-white" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-300 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-green-400" />
          </span>
        </a>
      </div>

      <style jsx global>{`
        .gold-grad {
          background: linear-gradient(135deg, #f0d78c, #d4af37 45%, #b8962e);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .wa-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          border-radius: 999px;
          background: #25d366;
          padding: 1rem 1.75rem;
          font-weight: 800;
          color: #000;
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.35);
          transition: all 0.2s ease;
        }
        .wa-cta:hover {
          background: #1ebe5d;
          transform: translateY(-2px);
        }
        .wa-cta.pulse { animation: wa-pulse 2s infinite; }
        @keyframes wa-pulse {
          0%,100% { box-shadow: 0 12px 30px rgba(37,211,102,0.35); }
          50% { box-shadow: 0 12px 45px rgba(37,211,102,0.6); }
        }
      `}</style>
    </main>
  );
}