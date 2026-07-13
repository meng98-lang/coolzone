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
import { getTranslations } from '@/i18n/translations';
import type { Locale } from '@/i18n/config';

interface ProductDetailProps {
  product: Product;
  locale?: string;
  whatsappPhone?: string;
}

export function ProductDetail({ product, locale = 'en', whatsappPhone }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const t = getTranslations(locale as Locale);
  
  const productImages = product.images || [product.image];
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const whatsappUrl = buildProductInquiryUrl(product.name, product.id, whatsappPhone);
  const buyNowUrl = buildOrderUrl([{ name: product.name, quantity: 1, price: product.price }], whatsappPhone);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${locale}/products`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t['common.back']}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 overflow-x-auto pb-2 -mx-1 px-1">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl border-2 overflow-hidden transition-all flex-shrink-0 ${
                      idx === selectedImage ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
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
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8">
              {product.badge && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                  {product.badge}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-500 text-sm sm:text-base mt-2">{product.subtitle}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-4 sm:mt-6 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">&euro;{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg sm:text-xl text-gray-400 line-through">&euro;{product.originalPrice}</span>
                )}
              </div>

              {/* Quick Specs */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                  <span className="text-xs sm:text-sm text-gray-700">{product.coolingCapacity}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                  <span className="text-xs sm:text-sm text-gray-700">{product.energyClass}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  <span className="text-xs sm:text-sm text-gray-700">{product.noiseLevel}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500" />
                  <span className="text-xs sm:text-sm text-gray-700">Wi-Fi</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 space-y-3">
                <a
                  href={buyNowUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-green-600/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t['products.buyNow']}
                </a>
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 w-full px-6 py-3.5 font-semibold rounded-xl transition-all ${
                    addedToCart
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      {t['products.addToCart']}
                    </>
                  )}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-colors border border-gray-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t['products.inquire']}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="mt-8 sm:mt-12 grid lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{t['products.specs']}</h2>
            <dl className="space-y-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-50">
                  <dt className="text-sm text-gray-500">{key}</dt>
                  <dd className="text-sm font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{t['products.features']}</h2>
            <ul className="space-y-3">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {locale === 'fr' ? 'Description' : locale === 'de' ? 'Beschreibung' : locale === 'es' ? 'Descripción' : locale === 'it' ? 'Descrizione' : 'Description'}
          </h2>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Contact Form */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t['home.contact.title']}</h2>
          <ContactForm productName={product.name} locale={locale as Locale} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t['products.related']}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale as Locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
