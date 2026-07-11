'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Eye, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/contact', {
        headers: { Authorization: 'Bearer admin' },
      });
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalInquiries = inquiries.length;
  const unreadCount = inquiries.filter((i) => !i.read).length;
  const todayCount = inquiries.filter((i) => {
    const today = new Date().toDateString();
    return new Date(i.createdAt).toDateString() === today;
  }).length;

  const recentInquiries = inquiries.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Inquiries</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalInquiries}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{unreadCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{todayCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="divide-y">
          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No inquiries yet
            </div>
          ) : (
            recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                <div className={`w-2 h-2 rounded-full shrink-0 ${inquiry.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">{inquiry.name}</p>
                    {!inquiry.read && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{inquiry.email} • {inquiry.phone}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/inquiries"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View All Inquiries
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Update WhatsApp Number
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Configure Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
