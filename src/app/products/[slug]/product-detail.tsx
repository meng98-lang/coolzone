'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, ArrowLeft, Check, Zap, Volume2, Thermometer, Wifi, MessageCircle, ShoppingCart } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { ContactForm } from '@/components/contact-form';
import { products } from '@/lib/products';
import type { Product } from '@/lib/products';
import { buildProductInquiryUrl, buildOrderUrl } from '@/lib/whatsapp';
import { useCart } from '@/lib/store';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Get all images for this product
  const productImages = product.images || [product.image];

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
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-8 flex items-center justify-center aspect-square relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${product.color}22 0%, transparent 70%)`,
                }}
              />
              <div className="relative z-10 w-full max-w-sm">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-auto object-contain drop-shadow-xl"
                />
              </div>
              {product.badge && (
                <span className="absolute top-5 left-5 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {product.badge}
                </span>
              )}
            </div>
            {/* Thumbnail Gallery */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${
                      selectedImage === idx
                        ? 'border-blue-600 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
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

        {/* Contact Form Section */}
        <div className="mt-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in {product.name}?</h2>
              <p className="text-gray-600 mb-6">
                Leave us your details and we&apos;ll get back to you within 24 hours with pricing, availability, and any questions you may have.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Free consultation &amp; site assessment
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Professional installation support
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  5-year warranty included
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ContactForm productName={product.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



