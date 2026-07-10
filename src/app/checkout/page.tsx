'use client';

import { useCart } from '@/lib/store';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Truck,
  Check,
  Minus,
  Plus,
  X,
} from 'lucide-react';
import { buildOrderUrl } from '@/lib/whatsapp';

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  const shippingCost = totalPrice > 500 ? 0 : 29;
  const taxRate = 0.19; // EU VAT
  const tax = Math.round(totalPrice * taxRate);
  const grandTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="mt-2 text-gray-500">Add some products to proceed.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = buildOrderUrl(
    items.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Order Summary</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Items */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-500" />
                Cart Items ({items.length})
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    {/* Product image placeholder */}
                    <div
                      className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${item.product.color}15, ${item.product.color}08)` }}
                    >
                      <div className="w-10 h-10 rounded-md" style={{ backgroundColor: item.product.color, opacity: 0.3 }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{item.product.coolingCapacity} &middot; {item.product.energyClass}</p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">
                            &euro;{(item.product.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Remove item"
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

            {/* Shipping info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-500" />
                Shipping
              </h2>
              <p className="text-sm text-gray-600">
                We ship to all EU countries and the UK. Shipping cost will be confirmed via WhatsApp.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Poland', 'UK', 'Sweden', 'Denmark', 'Portugal'].map((c) => (
                  <span key={c} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs text-gray-600">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium">&euro;{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <>&euro;{shippingCost}</>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">VAT (19%)</span>
                  <span className="font-medium">&euro;{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">&euro;{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                Place Order via WhatsApp
              </a>

              <p className="mt-3 text-xs text-gray-400 text-center">
                You will be redirected to WhatsApp to confirm your order with our sales team.
              </p>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                {[
                  'Secure order via WhatsApp',
                  'Free EU delivery over €500',
                  '5-year warranty included',
                  '30-day return policy',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
                    <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
