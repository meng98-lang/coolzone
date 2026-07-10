'use client';

import Link from 'next/link';
import { Star, MessageCircle, Zap } from 'lucide-react';
import type { Product } from '@/lib/products';
import { buildProductInquiryUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const whatsappUrl = buildProductInquiryUrl(product.name, product.id);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1">
      {/* Image area */}
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-30" style={{
            background: `radial-gradient(circle at 50% 50%, ${product.color}22 0%, transparent 70%)`
          }} />

          {/* Product SVG illustration */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <ProductIllustration product={product} />
          </div>

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600 text-white text-[11px] font-semibold rounded-full shadow-lg">
              {product.badge}
            </span>
          )}

          {/* Discount badge */}
          {product.originalPrice && (
            <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-[11px] font-bold rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{product.subtitle}</p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200 fill-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[11px] rounded-md border border-gray-100"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div>
            <span className="text-xl font-bold text-gray-900">&euro;{product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                &euro;{product.originalPrice}
              </span>
            )}
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-medium rounded-xl transition-colors shadow-sm hover:shadow-md active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inquire</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// SVG product illustrations
function ProductIllustration({ product }: { product: Product }) {
  const color = product.color;

  if (product.category === 'wall-mounted') {
    return (
      <svg viewBox="0 0 200 140" className="w-48 h-auto drop-shadow-lg">
        {/* Wall mount bracket */}
        <rect x="70" y="10" width="60" height="6" rx="2" fill="#e5e7eb" />
        {/* Main body */}
        <rect x="30" y="16" width="140" height="65" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
        {/* Front panel */}
        <rect x="35" y="20" width="130" height="50" rx="8" fill={`url(#grad-${product.id})`} opacity="0.15" />
        {/* Air vent */}
        <rect x="40" y="60" width="120" height="12" rx="4" fill={color} opacity="0.3" />
        <line x1="50" y1="66" x2="150" y2="66" stroke={color} strokeWidth="0.5" opacity="0.5" />
        {/* Display */}
        <rect x="130" y="30" width="25" height="12" rx="3" fill={color} opacity="0.2" />
        <text x="142" y="39" textAnchor="middle" fill={color} fontSize="7" fontWeight="bold">22&deg;</text>
        {/* LED indicator */}
        <circle cx="50" cy="36" r="2.5" fill={color} opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Air flow lines */}
        <path d="M60 80 Q60 95 55 105" stroke={color} strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M100 80 Q100 98 95 110" stroke={color} strokeWidth="1" fill="none" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.08;0.25" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M140 80 Q140 95 145 105" stroke={color} strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Snowflake icon */}
        <text x="100" y="45" textAnchor="middle" fill={color} fontSize="14" opacity="0.4">&#10052;</text>
        <defs>
          <linearGradient id={`grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (product.category === 'portable') {
    return (
      <svg viewBox="0 0 160 200" className="w-36 h-auto drop-shadow-lg">
        {/* Main body */}
        <rect x="30" y="20" width="100" height="150" rx="16" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
        {/* Top vent */}
        <rect x="45" y="30" width="70" height="25" rx="8" fill={color} opacity="0.15" />
        <line x1="55" y1="38" x2="105" y2="38" stroke={color} strokeWidth="0.8" opacity="0.3" />
        <line x1="55" y1="43" x2="105" y2="43" stroke={color} strokeWidth="0.8" opacity="0.3" />
        <line x1="55" y1="48" x2="105" y2="48" stroke={color} strokeWidth="0.8" opacity="0.3" />
        {/* Control panel */}
        <rect x="50" y="70" width="60" height="30" rx="6" fill={color} opacity="0.08" />
        <circle cx="65" cy="85" r="5" fill={color} opacity="0.3" />
        <circle cx="80" cy="85" r="5" fill={color} opacity="0.2" />
        <circle cx="95" cy="85" r="5" fill={color} opacity="0.15" />
        {/* Display */}
        <rect x="55" y="110" width="50" height="18" rx="4" fill="#1e293b" opacity="0.9" />
        <text x="80" y="123" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">20&deg;C</text>
        {/* Wheels */}
        <circle cx="50" cy="175" r="6" fill="#d1d5db" />
        <circle cx="110" cy="175" r="6" fill="#d1d5db" />
        {/* Handle */}
        <rect x="65" y="12" width="30" height="8" rx="4" fill="#e5e7eb" />
        {/* Air flow */}
        <path d="M70 25 Q70 10 65 5" stroke={color} strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M90 25 Q90 8 95 2" stroke={color} strokeWidth="1" fill="none" opacity="0.25">
          <animate attributeName="opacity" values="0.25;0.08;0.25" dur="2.5s" repeatCount="indefinite" />
        </path>
      </svg>
    );
  }

  // Central AC
  return (
    <svg viewBox="0 0 200 160" className="w-48 h-auto drop-shadow-lg">
      {/* Outdoor unit */}
      <rect x="20" y="60" width="70" height="80" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
      <circle cx="55" cy="100" r="22" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="55" cy="100" r="15" fill="none" stroke={color} strokeWidth="1" opacity="0.2" />
      <circle cx="55" cy="100" r="5" fill={color} opacity="0.2" />
      {/* Fan blades */}
      <g transform="translate(55,100)" opacity="0.3">
        <line x1="0" y1="-18" x2="0" y2="18" stroke={color} strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="-18" y1="0" x2="18" y2="0" stroke={color} strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
        </line>
      </g>
      {/* Indoor unit */}
      <rect x="110" y="20" width="70" height="35" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
      <rect x="115" y="42" width="60" height="8" rx="3" fill={color} opacity="0.2" />
      <circle cx="125" cy="32" r="2" fill={color} opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Connection pipes */}
      <path d="M90 80 L110 80 L110 37" stroke={color} strokeWidth="2" fill="none" opacity="0.2" strokeDasharray="4 2" />
      {/* Second indoor unit */}
      <rect x="110" y="100" width="70" height="35" rx="8" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
      <rect x="115" y="122" width="60" height="8" rx="3" fill={color} opacity="0.2" />
      <circle cx="125" cy="112" r="2" fill={color} opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.3s" repeatCount="indefinite" />
      </circle>
      {/* Connection pipe 2 */}
      <path d="M90 110 L110 117" stroke={color} strokeWidth="2" fill="none" opacity="0.2" strokeDasharray="4 2" />
    </svg>
  );
}
