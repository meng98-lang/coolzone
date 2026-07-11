import { ContactForm } from '@/components/contact-form';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - CoolZone',
  description: 'Get in touch with CoolZone for air conditioning solutions in Europe',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions about our air conditioning solutions? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* 联系表单 */}
            <div>
              <ContactForm />
            </div>

            {/* 联系信息 */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">info@coolzone.eu</p>
                      <p className="text-gray-600">sales@coolzone.eu</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                      <p className="text-gray-600">+49 123 456 7890</p>
                      <a
                        href="https://wa.me/491234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 text-sm font-medium mt-1 inline-block"
                      >
                        Chat now →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Office</h3>
                      <p className="text-gray-600">CoolZone GmbH</p>
                      <p className="text-gray-600">Industriestraße 45</p>
                      <p className="text-gray-600">80339 Munich, Germany</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 - 18:00 CET</p>
                      <p className="text-gray-600">Saturday: 10:00 - 14:00 CET</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked</h3>
                <div className="space-y-3">
                  <details className="group">
                    <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                      What areas do you serve?
                    </summary>
                    <p className="mt-2 text-gray-600 text-sm">
                      We serve all European countries including Germany, France, Italy, Spain, Netherlands, and more.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                      Do you offer installation services?
                    </summary>
                    <p className="mt-2 text-gray-600 text-sm">
                      Yes, we partner with certified installation professionals across Europe.
                    </p>
                  </details>
                  <details className="group">
                    <summary className="font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                      What is your warranty policy?
                    </summary>
                    <p className="mt-2 text-gray-600 text-sm">
                      All our products come with a 5-year manufacturer warranty. Extended warranty options are available.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
