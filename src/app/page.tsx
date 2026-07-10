import Link from 'next/link';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import {
  Snowflake,
  Truck,
  Shield,
  Zap,
  ThermometerSun,
  Headphones,
  ArrowRight,
  Star,
} from 'lucide-react';

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.badge).slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-6">
                <Snowflake className="w-3.5 h-3.5" />
                Summer Sale - Up to 25% Off
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Stay Cool
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  This Summer
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                Premium air conditioning solutions designed for European homes.
                Energy-efficient, whisper-quiet, and smart-connected. Free delivery across the EU & UK.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-200"
                >
                  Learn More
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-500" />
                  Free EU Delivery
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-500" />
                  5-Year Warranty
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  4.8/5 Rating
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Background circle */}
                <div className="absolute inset-8 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-full" />
                {/* Main AC illustration */}
                <svg viewBox="0 0 400 400" className="relative z-10 w-full h-full">
                  {/* Large AC unit */}
                  <rect x="80" y="120" width="240" height="100" rx="20" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                  <rect x="90" y="130" width="220" height="70" rx="14" fill="url(#heroGrad)" opacity="0.1" />
                  {/* Vent */}
                  <rect x="100" y="180" width="200" height="25" rx="8" fill="#3B82F6" opacity="0.15" />
                  <line x1="120" y1="192" x2="280" y2="192" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
                  {/* Display */}
                  <rect x="250" y="145" width="45" height="22" rx="6" fill="#1e293b" opacity="0.9" />
                  <text x="272" y="160" textAnchor="middle" fill="#3B82F6" fontSize="12" fontWeight="bold">22°C</text>
                  {/* LED */}
                  <circle cx="110" cy="155" r="4" fill="#3B82F6" opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Air flow animation */}
                  <path d="M140 230 Q140 270 130 300" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.2">
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite" />
                  </path>
                  <path d="M200 230 Q200 280 190 320" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.15">
                    <animate attributeName="opacity" values="0.15;0.03;0.15" dur="3.5s" repeatCount="indefinite" />
                  </path>
                  <path d="M260 230 Q260 270 270 300" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.2">
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.8s" repeatCount="indefinite" />
                  </path>
                  {/* Snowflake */}
                  <text x="200" y="165" textAnchor="middle" fill="#3B82F6" fontSize="24" opacity="0.3">&#10052;</text>
                  {/* Temperature particles */}
                  <circle cx="150" cy="260" r="3" fill="#3B82F6" opacity="0.15">
                    <animate attributeName="cy" values="260;300;260" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0;0.15" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="250" cy="250" r="2" fill="#06b6d4" opacity="0.15">
                    <animate attributeName="cy" values="250;290;250" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0;0.15" dur="3.5s" repeatCount="indefinite" />
                  </circle>
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose CoolZone?</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
              We deliver premium cooling solutions with industry-leading efficiency and reliability across Europe.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: 'A+++ Energy',
                desc: 'Save up to 60% on energy bills with our top-rated inverter technology.',
                color: 'text-amber-500',
                bg: 'bg-amber-50',
              },
              {
                icon: ThermometerSun,
                title: 'Rapid Cooling',
                desc: 'Reach your ideal temperature in under 60 seconds with Turbo mode.',
                color: 'text-red-500',
                bg: 'bg-red-50',
              },
              {
                icon: Snowflake,
                title: 'Whisper Quiet',
                desc: 'From just 19dB - quieter than a whisper for peaceful nights.',
                color: 'text-blue-500',
                bg: 'bg-blue-50',
              },
              {
                icon: Headphones,
                title: 'Expert Support',
                desc: 'Multilingual support team available 7 days a week across Europe.',
                color: 'text-green-500',
                bg: 'bg-green-50',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-2 text-gray-500">Our most popular cooling solutions</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '30+', label: 'European Countries' },
              { value: '4.8/5', label: 'Average Rating' },
              { value: '5 Year', label: 'Warranty' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold">{stat.value}</div>
                <div className="mt-1 text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Beat the Heat?</h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Order now and get free delivery across the EU and UK. Our expert team is here to help you find the perfect cooling solution.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:support@coolzone.eu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
