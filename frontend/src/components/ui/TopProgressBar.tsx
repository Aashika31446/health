'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // When route changes, quickly finish and fade out
    setProgress(100);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 280);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      if (!href) return;

      // Only animate for internal route changes (not external or hash-only on same page)
      if (href.startsWith('/') && !href.startsWith('//') && target.target !== '_blank') {
        const url = new URL(href, window.location.origin);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setIsVisible(true);
          setProgress(25);
          setTimeout(() => setProgress(65), 100);
          setTimeout(() => setProgress(85), 250);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, { capture: true });
    return () => document.removeEventListener('click', handleAnchorClick, { capture: true });
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] bg-transparent overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#38BDF8] via-[#0284C7] to-[#8B5CF6] shadow-[0_0_8px_rgba(2,132,199,0.5)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? '150ms' : '300ms',
          opacity: progress === 100 ? 0.7 : 1,
        }}
      />
    </div>
  );
}
