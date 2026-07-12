'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Globe,
  Search,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  RefreshCw,
} from 'lucide-react';

interface TrafficStats {
  today: number;
  yesterday: number;
  last7Days: number;
  last30Days: number;
  totalVisits: number;
  dailyStats: { date: string; count: number }[];
  countryStats: { country: string; count: number }[];
  referrerStats: { referrer: string; count: number }[];
  searchTerms: { term: string; count: number }[];
  pageStats: { path: string; count: number }[];
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<TrafficStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/traffic?stats=true', {
        headers: { Authorization: `Bearer admin` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        setError('Failed to load statistics');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <button onClick={fetchStats} className="mt-4 text-blue-600 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const maxDaily = Math.max(...stats.dailyStats.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Traffic Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor website traffic and visitor sources</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.today}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            {stats.today > stats.yesterday ? (
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-4 w-4" />
                +{stats.today - stats.yesterday} vs yesterday
              </span>
            ) : (
              <span className="text-gray-500">
                {stats.yesterday - stats.today} less than yesterday
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last 7 Days</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.last7Days}</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Avg {Math.round(stats.last7Days / 7)}/day
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last 30 Days</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.last30Days}</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Avg {Math.round(stats.last30Days / 30)}/day
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalVisits}</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-500">All time</p>
        </div>
      </div>

      {/* Daily Traffic Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Traffic (Last 7 Days)</h2>
        <div className="flex items-end gap-2 h-40">
          {stats.dailyStats.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{day.count}</span>
              <div
                className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                style={{ height: `${(day.count / maxDaily) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
              />
              <span className="text-xs text-gray-400">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic by Country */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Traffic by Country
          </h2>
          {stats.countryStats.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.countryStats.slice(0, 8).map((item) => (
                <div key={item.country} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-20">{item.country}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(item.count / stats.countryStats[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-10 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-green-600" />
            Traffic Sources
          </h2>
          {stats.referrerStats.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.referrerStats.slice(0, 8).map((item) => (
                <div key={item.referrer} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 flex-1 truncate">{item.referrer}</span>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Terms */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-purple-600" />
            Search Keywords
          </h2>
          {stats.searchTerms.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No data yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {stats.searchTerms.slice(0, 15).map((item) => (
                <span
                  key={item.term}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm"
                >
                  {item.term}
                  <span className="text-purple-400 text-xs">({item.count})</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Popular Pages */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Popular Pages
          </h2>
          {stats.pageStats.length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {stats.pageStats.slice(0, 8).map((item) => (
                <div key={item.path} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 flex-1 truncate font-mono">
                    {item.path}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
