'use client';

import { Suspense, useState, useEffect } from 'react';
import { useCart } from '@/lib/store';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { buildOrderUrl } from '@/lib/whatsapp';
import { getTranslations } from '@/i18n/translations';
import type { Locale } from '@/i18n/config';

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent params={params} />
    </Suspense>
  );
}

function CheckoutContent({ params }: CheckoutPageProps) {
  const locale = 'en';
  const t = getTranslations(locale as Locale);
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [whatsappPhone, setWhatsappPhone] = useState('491234567890');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.whatsappPhone) setWhatsappPhone(data.whatsappPhone);
      })
      .catch(() => {});
  }, []);

  const shippingCost = totalPrice > 500 ? 0 : 29;
  const taxRate = 0.19;
  const tax = Math.round(totalPrice * taxRate);
  const grandTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">{t['cart.empty']}</h1>
          <Link
            href={`/${locale}/products`}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            {t['cart.continue']}
          </Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = buildOrderUrl(
    whatsappPhone,
    items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${locale}/products`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t['cart.continue']}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{t['cart.title']}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                {items.length} {t['products.all'].toLowerCase()}
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div
                      className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${item.product.color}15, ${item.product.color}08)` }}
                    >
                      <div className="w-10 h-10 rounded-md" style={{ backgroundColor: item.product.color, opacity: 0.3 }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.product.coolingCapacity} &middot; {item.product.energyClass}</p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">
                            &euro;{item.product.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t['cart.total']}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{t['cart.total']}</span>
                  <span>&euro;{totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t['cart.shipping']}</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingCost === 0 ? t['cart.free'] : `€${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t['cart.vat']}</span>
                  <span>&euro;{tax}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>{t['cart.grandTotal']}</span>
                  <span>&euro;{grandTotal}</span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-green-600/20"
              >
                <MessageCircle className="w-5 h-5" />
                {t['cart.orderVia']}
              </a>

              {totalPrice < 500 && (
                <p className="mt-3 text-xs text-center text-gray-500">
                  {t['cart.shipping']}: &euro;29 &middot; {t['cart.free']} &gt; &euro;500
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
