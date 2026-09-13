'use client';

import PageTransition from '@/components/ui/PageTransition';

export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition className="h-full overflow-hidden">
      {children}
    </PageTransition>
  );
}
