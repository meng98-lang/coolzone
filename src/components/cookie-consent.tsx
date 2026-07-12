'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // always enabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShow(false);
    // Enable analytics and marketing scripts
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
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cookie className="w-6 h-6 text-white" />
            <h3 className="text-white font-semibold text-lg">Cookie Settings</h3>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
            By clicking &quot;Accept All&quot;, you consent to our use of cookies. Read our{' '}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link> for more information.
          </p>

          {/* Detailed preferences */}
          {showDetails && (
            <div className="space-y-3 mb-4 border-t pt-4">
              {/* Necessary */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Necessary Cookies</p>
                    <p className="text-xs text-gray-500">Required for the website to function properly</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-not-allowed">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Analytics Cookies</p>
                    <p className="text-xs text-gray-500">Help us understand how visitors interact with our website</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      preferences.analytics ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Cookie className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Marketing Cookies</p>
                    <p className="text-xs text-gray-500">Used to deliver personalized advertisements</p>
                  </div>
                </div>
                <button
                  onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
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
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
          >
            {showDetails ? 'Hide details' : 'Customize preferences'}
          </button>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={rejectAll}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Reject All
            </button>
            {showDetails && (
              <button
                onClick={acceptSelected}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Accept Selected
              </button>
            )}
            <button
              onClick={acceptAll}
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all ml-auto"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
