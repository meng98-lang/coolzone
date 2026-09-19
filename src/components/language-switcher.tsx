'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, primaryLocales, languageNames, languageFlags, type Locale } from '@/i18n/config';
import { Globe, ChevronDown } from 'lucide-react';

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    // Replace current locale in pathname
    const segments = pathname.split('/');
    if (segments.length >= 2 && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/');
    setIsOpen(false);
    router.push(newPath);
  };

  const displayLocales = primaryLocales;
  const moreLocales = locales.filter(l => !primaryLocales.includes(l));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{languageFlags[currentLocale]} {languageNames[currentLocale]}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-80 overflow-y-auto">
          {/* Primary languages */}
          <div className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Popular
          </div>
          {displayLocales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                loc === currentLocale ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              <span>{languageFlags[loc]}</span>
              <span>{languageNames[loc]}</span>
              {loc === currentLocale && <span className="ml-auto text-blue-600">✓</span>}
            </button>
          ))}

          {/* More languages */}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <div className="px-3 py-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
              More languages
            </div>
            {moreLocales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  loc === currentLocale ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                }`}
              >
                <span>{languageFlags[loc]}</span>
                <span>{languageNames[loc]}</span>
                {loc === currentLocale && <span className="ml-auto text-blue-600">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
