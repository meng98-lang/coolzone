'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShow(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-accepted', { detail: allAccepted }));
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShow(false);
    if (preferences.analytics || preferences.marketing) {
      window.dispatchEvent(new CustomEvent('cookie-consent-accepted', { detail: preferences }));
    }
  };

  const rejectAll = () => {
    const necessary = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookie-consent', JSON.stringify(necessary));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-2 sm:p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <h3 className="text-white font-semibold text-base sm:text-lg">Cookie Settings</h3>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
            By clicking &quot;Accept All&quot;, you consent to our use of cookies. Read our{' '}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>

          {/* Detailed preferences */}
          {showDetails && (
            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 border-t pt-3 sm:pt-4">
              {/* Necessary */}
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 text-xs sm:text-sm">Necessary Cookies</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Required for the website to function</p>
                  </div>
                </div>
                <div className="w-10 h-5 sm:w-12 sm:h-6 bg-green-500 rounded-full relative cursor-not-allowed flex-shrink-0">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 text-xs sm:text-sm">Analytics Cookies</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Help us understand website usage</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                  className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full relative transition-colors flex-shrink-0 ${
                    preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform ${
                      preferences.analytics ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Cookie className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 text-xs sm:text-sm">Marketing Cookies</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">Personalized advertisements</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full relative transition-colors flex-shrink-0 ${
                    preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-transform ${
                      preferences.marketing ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Toggle details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium mb-3 sm:mb-4"
          >
            {showDetails ? 'Hide details' : 'Customize preferences'}
          </button>

          {/* Action buttons - stack vertically on mobile */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={rejectAll}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors order-2 sm:order-1"
            >
              Reject All
            </button>
            {showDetails && (
              <button
                onClick={acceptSelected}
                className="px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors order-1 sm:order-2"
              >
                Accept Selected
              </button>
            )}
            <button
              onClick={acceptAll}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all order-0 sm:order-3 sm:ml-auto"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
