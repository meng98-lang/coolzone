import Link from 'next/link';
import { CheckCircle, Home, MessageCircle, ArrowLeft } from 'lucide-react';
import { buildWhatsAppUrl, WHATSAPP_PHONE } from '@/lib/whatsapp';

/**
 * 表单提交成功感谢页面
 * 路径: /ok
 * 用于谷歌广告转化追踪
 */
export default function ThankYouPage() {
  const whatsappUrl = buildWhatsAppUrl('Hello! I just submitted the contact form on your website.');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        {/* 成功图标 */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thank You!
        </h1>

        {/* 描述 */}
        <p className="text-lg text-gray-600 mb-6">
          Your message has been received successfully. Our team will get back to you within 24 hours.
        </p>

        <p className="text-base text-gray-500 mb-10">
          感谢您的留言！我们的团队将在24小时内与您联系。
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* 返回首页 */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          {/* WhatsApp 联系 */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
        </div>

        {/* 其他链接 */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need immediate assistance?
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Browse Products
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              WhatsApp: +{WHATSAPP_PHONE}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
