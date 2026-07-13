'use client';

import Link from 'next/link';
import { useCart } from '@/lib/store';
import { ShoppingCart, Menu, X, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { buildContactUrl } from '@/lib/whatsapp';
import { LanguageSwitcher } from './language-switcher';
import type { Locale } from '@/i18n/config';
import { getTranslations } from '@/i18n/translations';

interface HeaderProps {
  locale?: Locale;
  phone?: string;
}

export function Header({ locale = 'en', phone }: HeaderProps) {
  const { totalItems, toggleCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslations(locale);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              CoolZone
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}`} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t['nav.home']}
            </Link>
            <Link href={`/${locale}/products`} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t['nav.products']}
            </Link>
            <Link href={`/${locale}/contact`} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t['nav.contact']}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLocale={locale} />
            <a
              href={buildContactUrl(phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-medium rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden lg:inline">WhatsApp</span>
            </a>
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-3">
              <Link href={`/${locale}`} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                {t['nav.home']}
              </Link>
              <Link href={`/${locale}/products`} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                {t['nav.products']}
              </Link>
              <Link href={`/${locale}/contact`} onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                {t['nav.contact']}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
