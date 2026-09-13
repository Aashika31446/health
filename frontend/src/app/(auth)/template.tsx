'use client';

import PageTransition from '@/components/ui/PageTransition';

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition className="min-h-screen">
      {children}
    </PageTransition>
  );
}
