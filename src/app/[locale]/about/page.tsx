import type { Metadata } from 'next';
import { type Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `About Us - CoolZone`,
    description: 'Learn about CoolZone - Your trusted partner for premium air conditioning solutions in Europe. Quality, reliability, and customer satisfaction.',
  };
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">About CoolZone</h1>
      <p className="text-gray-500 mb-8">Your Trusted Partner for Premium Air Conditioning Solutions</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <p className="text-blue-800 font-medium text-lg">
              济南云顶久嘉商贸有限公司
            </p>
            <p className="text-blue-700 mt-2">
              山东省临沂市兰山区银雀山街道通达路与启阳路交汇澳尔诺财富中心8楼809室
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            CoolZone is a leading provider of premium air conditioning solutions for the European market. We specialize in high-quality, energy-efficient cooling systems designed for residential and commercial use. Our commitment to quality, reliability, and customer satisfaction has made us a trusted name in the HVAC industry.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To provide European customers with innovative, energy-efficient air conditioning solutions that enhance comfort while minimizing environmental impact. We strive to deliver exceptional value through superior products, competitive pricing, and outstanding customer service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be the most trusted and preferred air conditioning brand in Europe, known for quality, innovation, and customer-centric service. We aim to contribute to a sustainable future by promoting energy-efficient cooling solutions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Why Choose CoolZone?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">✓ Premium Quality</h3>
              <p className="text-sm text-gray-600">All products meet EU standards and certifications (CE, RoHS, Energy Label)</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">✓ Energy Efficient</h3>
              <p className="text-sm text-gray-600">A+++ rated products that save energy and reduce carbon footprint</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">✓ 2-Year Warranty</h3>
              <p className="text-sm text-gray-600">Full manufacturer warranty with dedicated support team</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">✓ Fast Shipping</h3>
              <p className="text-sm text-gray-600">Free delivery across Europe within 3-5 business days</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">✓ Expert Support</h3>
              <p className="text-sm text-gray-600">Multilingual customer service via WhatsApp and email</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">✓ Competitive Pricing</h3>
              <p className="text-sm text-gray-600">Direct from manufacturer, no middlemen, best value</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Products</h2>
          <p className="text-gray-600 leading-relaxed">
            We offer a comprehensive range of air conditioning solutions:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Wall-Mounted Split Systems:</strong> Ideal for homes and small offices</li>
            <li><strong>Multi-Split Systems:</strong> Multiple indoor units connected to one outdoor unit</li>
            <li><strong>Portable Air Conditioners:</strong> Flexible cooling for any room</li>
            <li><strong>Commercial Systems:</strong> Heavy-duty solutions for large spaces</li>
            <li><strong>Smart AC Units:</strong> WiFi-enabled, app-controlled systems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Commitment to Sustainability</h2>
          <p className="text-gray-600 leading-relaxed">
            We are committed to environmental responsibility. All our products use eco-friendly refrigerants (R32, R290) with low global warming potential. We continuously invest in research and development to create more energy-efficient solutions that help combat climate change.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Customer Satisfaction</h2>
          <p className="text-gray-600 leading-relaxed">
            Customer satisfaction is our top priority. We offer:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>14-day money-back guarantee (EU consumer rights)</li>
            <li>Free technical support and installation guidance</li>
            <li>Fast response to inquiries (within 24 hours)</li>
            <li>Comprehensive after-sales service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            <strong>Company:</strong> 济南云顶久嘉商贸有限公司<br />
            <strong>Address:</strong> 山东省临沂市兰山区银雀山街道通达路与启阳路交汇澳尔诺财富中心8楼809室<br />
            <strong>Email:</strong> info@coolzone.eu<br />
            <strong>WhatsApp:</strong> +49 987 654 321<br />
            <strong>Website:</strong> www.coolzone.eu
          </p>
        </section>
      </div>
    </div>
  );
}
