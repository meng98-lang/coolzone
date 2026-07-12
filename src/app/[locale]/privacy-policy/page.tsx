import type { Metadata } from 'next';
import { type Locale } from '@/i18n/config';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Privacy Policy - CoolZone`,
    description: 'CoolZone Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR.',
  };
}

export default function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: January 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            CoolZone (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website coolzone.eu, use our services, or interact with us.
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            This policy is provided in compliance with the General Data Protection Regulation (GDPR) (EU) 2016/679 and the ePrivacy Directive 2002/58/EC.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Data Controller</h2>
          <p className="text-gray-600 leading-relaxed">
            CoolZone SARL<br />
            123 Commerce Street<br />
            75001 Paris, France<br />
            Email: privacy@coolzone.eu<br />
            Phone: +33 1 23 45 67 89
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Data We Collect</h2>
          <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">3.1 Information you provide directly</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Name, email address, phone number (via contact form)</li>
            <li>Shipping address and billing information (when placing an order)</li>
            <li>Communication preferences</li>
          </ul>
          <h3 className="text-lg font-medium text-gray-700 mb-2 mt-4">3.2 Information collected automatically</h3>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>IP address and browser type</li>
            <li>Device information and operating system</li>
            <li>Pages visited and time spent on each page</li>
            <li>Referring website addresses</li>
            <li>Cookie data (see Cookie Policy below)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Legal Basis for Processing</h2>
          <p className="text-gray-600 leading-relaxed">We process your personal data based on:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Consent:</strong> For marketing cookies and optional analytics</li>
            <li><strong>Contract performance:</strong> To process and deliver your orders</li>
            <li><strong>Legitimate interests:</strong> To improve our website and services</li>
            <li><strong>Legal obligations:</strong> To comply with tax and accounting requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">5. How We Use Your Data</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Process and deliver your orders</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Improve our website functionality and user experience</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Data Retention</h2>
          <p className="text-gray-600 leading-relaxed">
            We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li>Contact form inquiries: 12 months</li>
            <li>Order records: 10 years (legal requirement)</li>
            <li>Analytics data: 26 months</li>
            <li>Marketing data: Until consent is withdrawn</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Your Rights (GDPR)</h2>
          <p className="text-gray-600 leading-relaxed">Under GDPR, you have the following rights:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Right of access:</strong> Request a copy of your personal data</li>
            <li><strong>Right to rectification:</strong> Correct inaccurate or incomplete data</li>
            <li><strong>Right to erasure:</strong> Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
            <li><strong>Right to data portability:</strong> Receive your data in a machine-readable format</li>
            <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Right to withdraw consent:</strong> At any time, without affecting prior processing</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            To exercise any of these rights, contact us at: privacy@coolzone.eu
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Cookie Policy</h2>
          <p className="text-gray-600 leading-relaxed">
            Our website uses cookies. We categorize them as:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>Necessary cookies:</strong> Essential for website functionality (no consent required)</li>
            <li><strong>Analytics cookies:</strong> Help us understand website usage (requires consent)</li>
            <li><strong>Marketing cookies:</strong> Used for targeted advertising (requires consent)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            You can manage your cookie preferences at any time through our Cookie Consent Banner.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Third-Party Services</h2>
          <p className="text-gray-600 leading-relaxed">We use the following third-party services:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
            <li><strong>WhatsApp Business:</strong> For customer communication (Meta Platforms, Inc.)</li>
            <li><strong>Google Analytics:</strong> For website analytics (Google LLC)</li>
            <li><strong>Facebook Pixel:</strong> For advertising measurement (Meta Platforms, Inc.)</li>
            <li><strong>TikTok Pixel:</strong> For advertising measurement (TikTok / ByteDance)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-2">
            These services may process your data in accordance with their own privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. International Data Transfers</h2>
          <p className="text-gray-600 leading-relaxed">
            Some third-party services may transfer data outside the EU/EEA. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) or adequacy decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Contact &amp; Supervisory Authority</h2>
          <p className="text-gray-600 leading-relaxed">
            For any privacy-related questions or to exercise your rights, contact us at:<br />
            Email: privacy@coolzone.eu
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            If you believe your rights have been violated, you can lodge a complaint with your local Data Protection Authority (DPA).
          </p>
        </section>
      </div>
    </div>
  );
}
