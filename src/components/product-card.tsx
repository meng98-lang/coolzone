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

          {/* Product image */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
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
