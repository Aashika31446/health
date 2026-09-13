'use client';

import PageTransition from '@/components/ui/PageTransition';

export default function PricingTemplate({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition className="min-h-screen">
      {children}
    </PageTransition>
  );
}
