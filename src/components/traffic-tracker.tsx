'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function TrafficTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 记录页面访问
    const trackVisit = async () => {
      try {
        await fetch('/api/traffic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
          }),
        });
      } catch {
        // 静默失败，不影响用户体验
      }
    };

    trackVisit();
  }, [pathname, searchParams]);

  return null;
}
