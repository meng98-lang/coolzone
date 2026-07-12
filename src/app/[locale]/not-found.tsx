import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Large 404 */}
        <div className="relative mb-8">
          <h1 className="text-[120px] font-bold text-gray-100 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Search className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Page not found</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let us help you find what you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Products
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { href: '/products', label: 'All Products' },
              { href: '/faq', label: 'FAQ' },
              { href: '/contact', label: 'Contact Us' },
              { href: '/shipping', label: 'Shipping Info' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
