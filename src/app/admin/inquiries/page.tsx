'use client';

import { useState, useEffect } from 'react';
import { Trash2, Mail, Phone, Check, X } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

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

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/contact', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin' 
        },
        body: JSON.stringify({ id, action: 'read' }),
      });
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, is_read: true } : inq))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, read: true });
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('确定要删除这条咨询吗？')) return;
    
    try {
      await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer admin' },
      });
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">客户咨询</h1>
        <span className="text-sm text-gray-500">
          共 {inquiries.length} 条 • {inquiries.filter((i) => !i.is_read).length} 条未读
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                暂无咨询
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <button
                  key={inquiry.id}
                  onClick={() => {
                    setSelectedInquiry(inquiry);
                    if (!inquiry.is_read) markAsRead(inquiry.id);
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedInquiry?.id === inquiry.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!inquiry.is_read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    <p className="font-medium text-gray-900 truncate">{inquiry.name}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{inquiry.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(inquiry.created_at).toLocaleString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          {selectedInquiry ? (
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedInquiry.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteInquiry(selectedInquiry.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="删除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.phone}
                  </a>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">留言内容</h3>
                <div className="p-4 bg-gray-50 rounded-xl text-gray-700 whitespace-pre-wrap">
                  {selectedInquiry.message || '无留言内容'}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  邮件回复
                </a>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  立即拨打
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>选择一条咨询查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
