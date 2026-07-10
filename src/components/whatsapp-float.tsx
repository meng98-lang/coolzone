'use client';

import { MessageCircle } from 'lucide-react';
import { buildContactUrl } from '@/lib/whatsapp';

/**
 * Floating WhatsApp button - always visible on all pages.
 * Provides quick access to WhatsApp contact from anywhere on the site.
 */
export function WhatsAppFloat() {
  return (
    <a
      href={buildContactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white" />
      <span className="text-sm font-semibold hidden sm:block">WhatsApp</span>
      {/* Pulse animation */}
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
      </span>
    </a>
  );
}
