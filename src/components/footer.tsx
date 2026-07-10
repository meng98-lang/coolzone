import { Snowflake } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <Snowflake className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CoolZone</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Premium cooling solutions for European homes. Energy-efficient, whisper-quiet, and smart-connected.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Products</h3>
            <ul className="space-y-2.5">
              <li><Link href="/products?category=wall-mounted" className="text-sm hover:text-blue-400 transition-colors">Wall Mounted</Link></li>
              <li><Link href="/products?category=portable" className="text-sm hover:text-blue-400 transition-colors">Portable AC</Link></li>
              <li><Link href="/products?category=central" className="text-sm hover:text-blue-400 transition-colors">Central Systems</Link></li>
              <li><Link href="/products" className="text-sm hover:text-blue-400 transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Installation Guide</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Warranty Info</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:text-blue-400 transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2025 CoolZone. All rights reserved. Shipping across EU & UK.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Payment:</span>
            <div className="flex gap-2">
              {['Visa', 'MC', 'Amex', 'PayPal'].map((method) => (
                <span key={method} className="px-2 py-1 bg-gray-800 rounded text-[10px] font-medium text-gray-400">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
