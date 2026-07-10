'use client';

import Link from 'next/link';
import { Star, ArrowLeft, Check, Zap, Volume2, Thermometer, Wifi, MessageCircle, ShoppingCart } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';
import type { Product } from '@/lib/products';
import { buildProductInquiryUrl, buildOrderUrl } from '@/lib/whatsapp';
import { useCart } from '@/lib/store';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();

  // Get related products (same category, excluding current)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700 transition-colors">
              Products
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 flex items-center justify-center aspect-square relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${product.color}22 0%, transparent 70%)`,
              }}
            />
            <div className="relative z-10 w-full max-w-sm">
              <ProductLargeIllustration product={product} />
            </div>
            {product.badge && (
              <span className="absolute top-5 left-5 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-1 text-lg text-gray-500">{product.subtitle}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900">&euro;{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">&euro;{product.originalPrice}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-sm font-semibold rounded-md">
                    Save &euro;{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Energy Rating */}
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                {product.energyClass}
              </span>
              <span className="text-sm text-gray-500">Energy Rating</span>
            </div>

            {/* Description */}
            <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Specs */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: Thermometer, label: 'Cooling Capacity', value: product.coolingCapacity },
                { icon: Volume2, label: 'Noise Level', value: product.noiseLevel },
                { icon: Zap, label: 'Energy Class', value: product.energyClass },
                { icon: Wifi, label: 'Smart', value: product.features.some(f => f.toLowerCase().includes('wifi') || f.toLowerCase().includes('smart')) ? 'Wi-Fi Enabled' : 'Manual' },
              ].map((spec) => (
                <div key={spec.label} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <spec.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">{spec.label}</div>
                    <div className="text-sm font-medium text-gray-900">{spec.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="space-y-2">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={buildProductInquiryUrl(product.name, product.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 active:scale-[0.98]"
              >
                <MessageCircle className="w-5 h-5" />
                Buy Now on WhatsApp
              </a>
              <button
                onClick={() => addItem(product)}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 active:scale-[0.98]"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Trust */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-green-500" />
                Free EU Delivery
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-green-500" />
                5-Year Warranty
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-green-500" />
                30-Day Returns
              </span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Large product illustration for detail page
function ProductLargeIllustration({ product }: { product: Product }) {
  const color = product.color;

  if (product.category === 'wall-mounted') {
    return (
      <svg viewBox="0 0 300 200" className="w-full h-auto drop-shadow-xl">
        <rect x="100" y="15" width="100" height="8" rx="3" fill="#e5e7eb" />
        <rect x="40" y="23" width="220" height="100" rx="18" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        <rect x="50" y="30" width="200" height="75" rx="12" fill={color} opacity="0.08" />
        <rect x="60" y="90" width="180" height="20" rx="6" fill={color} opacity="0.2" />
        <line x1="80" y1="100" x2="220" y2="100" stroke={color} strokeWidth="1" opacity="0.4" />
        <rect x="200" y="45" width="38" height="18" rx="5" fill="#1e293b" opacity="0.9" />
        <text x="219" y="58" textAnchor="middle" fill={color} fontSize="11" fontWeight="bold">22°C</text>
        <circle cx="70" cy="54" r="4" fill={color} opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M90 130 Q90 155 85 175" stroke={color} strokeWidth="1.5" fill="none" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.05;0.25" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M150 130 Q150 160 145 185" stroke={color} strokeWidth="1.5" fill="none" opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.03;0.2" dur="3.5s" repeatCount="indefinite" />
        </path>
        <path d="M210 130 Q210 155 215 175" stroke={color} strokeWidth="1.5" fill="none" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2.8s" repeatCount="indefinite" />
        </path>
        <text x="150" y="68" textAnchor="middle" fill={color} fontSize="20" opacity="0.3">&#10052;</text>
      </svg>
    );
  }

  if (product.category === 'portable') {
    return (
      <svg viewBox="0 0 200 280" className="w-full h-auto drop-shadow-xl">
        <rect x="40" y="30" width="120" height="200" rx="20" fill="white" stroke="#e5e7eb" strokeWidth="2" />
        <rect x="55" y="45" width="90" height="35" rx="10" fill={color} opacity="0.12" />
        <line x1="65" y1="55" x2="135" y2="55" stroke={color} strokeWidth="1" opacity="0.3" />
        <line x1="65" y1="63" x2="135" y2="63" stroke={color} strokeWidth="1" opacity="0.3" />
        <line x1="65" y1="71" x2="135" y2="71" stroke={color} strokeWidth="1" opacity="0.3" />
        <rect x="60" y="95" width="80" height="40" rx="8" fill={color} opacity="0.06" />
        <circle cx="80" cy="115" r="7" fill={color} opacity="0.25" />
        <circle cx="100" cy="115" r="7" fill={color} opacity="0.18" />
        <circle cx="120" cy="115" r="7" fill={color} opacity="0.12" />
        <rect x="65" y="150" width="70" height="25" rx="6" fill="#1e293b" opacity="0.9" />
        <text x="100" y="167" textAnchor="middle" fill={color} fontSize="14" fontWeight="bold">20°C</text>
        <circle cx="60" cy="238" r="8" fill="#d1d5db" />
        <circle cx="140" cy="238" r="8" fill="#d1d5db" />
        <rect x="80" y="18" width="40" height="12" rx="6" fill="#e5e7eb" />
        <path d="M85 35 Q85 15 78 5" stroke={color} strokeWidth="1.5" fill="none" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M115 35 Q115 12 122 2" stroke={color} strokeWidth="1.5" fill="none" opacity="0.2">
          <animate attributeName="opacity" values="0.2;0.03;0.2" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
    );
  }

  // Central AC
  return (
    <svg viewBox="0 0 300 240" className="w-full h-auto drop-shadow-xl">
      <rect x="20" y="80" width="100" height="120" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="2" />
      <circle cx="70" cy="140" r="32" fill="none" stroke={color} strokeWidth="2" opacity="0.25" />
      <circle cx="70" cy="140" r="20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.15" />
      <circle cx="70" cy="140" r="7" fill={color} opacity="0.15" />
      <rect x="150" y="30" width="120" height="50" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="2" />
      <rect x="160" y="62" width="100" height="12" rx="4" fill={color} opacity="0.15" />
      <circle cx="170" cy="48" r="3" fill={color} opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M120 110 L150 110 L150 55" stroke={color} strokeWidth="2.5" fill="none" opacity="0.15" strokeDasharray="6 3" />
      <rect x="150" y="140" width="120" height="50" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="2" />
      <rect x="160" y="172" width="100" height="12" rx="4" fill={color} opacity="0.15" />
      <circle cx="170" cy="158" r="3" fill={color} opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.3s" repeatCount="indefinite" />
      </circle>
      <path d="M120 150 L150 165" stroke={color} strokeWidth="2.5" fill="none" opacity="0.15" strokeDasharray="6 3" />
    </svg>
  );
}
