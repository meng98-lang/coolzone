import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { buildContactUrl } from '@/lib/whatsapp';
import { getTranslations } from '@/i18n/translations';
import type { Locale } from '@/i18n/config';

interface FooterProps {
  locale?: Locale;
}

export function Footer({ locale = 'en' }: FooterProps) {
  const t = getTranslations(locale);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-white">CoolZone</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t['footer.tagline']}
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t['nav.products']}</h3>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/products?category=wall-mounted`} className="text-sm hover:text-blue-400 transition-colors">{t['products.wallMounted']}</Link></li>
              <li><Link href={`/${locale}/products?category=portable`} className="text-sm hover:text-blue-400 transition-colors">{t['products.portable']}</Link></li>
              <li><Link href={`/${locale}/products?category=central`} className="text-sm hover:text-blue-400 transition-colors">{t['products.central']}</Link></li>
              <li><Link href={`/${locale}/products?category=floor-standing`} className="text-sm hover:text-blue-400 transition-colors">{t['products.floorStanding']}</Link></li>
              <li><Link href={`/${locale}/products`} className="text-sm hover:text-blue-400 transition-colors">{t['products.all']}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t['footer.customerService']}</h3>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/contact`} className="text-sm hover:text-blue-400 transition-colors">{t['footer.contactUs']}</Link></li>
              <li><a href={buildContactUrl()} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-blue-400 transition-colors">WhatsApp</a></li>
              <li><Link href={`/${locale}/faq`} className="text-sm hover:text-blue-400 transition-colors">{t['footer.faq']}</Link></li>
              <li><Link href={`/${locale}/shipping`} className="text-sm hover:text-blue-400 transition-colors">{t['footer.shipping']}</Link></li>
              <li><Link href={`/${locale}/returns`} className="text-sm hover:text-blue-400 transition-colors">{t['footer.returns']}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">CoolZone</h3>
            <ul className="space-y-2.5">
              <li><Link href={`/${locale}/faq`} className="text-sm hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href={`/${locale}/privacy-policy`} className="text-sm hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href={`/${locale}/terms`} className="text-sm hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2025 CoolZone. {t['footer.rights']}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={buildContactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span className="text-xs font-medium text-[#25D366]">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
