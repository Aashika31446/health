'use client';

import PageTransition from '@/components/ui/PageTransition';

export default function AboutTemplate({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition className="min-h-screen">
      {children}
    </PageTransition>
  );
}
