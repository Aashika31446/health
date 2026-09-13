import React from 'react';
import Navbar from '@/components/Landing/Navbar';
import PricingHero from '@/components/Pricing/PricingHero';
import PricingCards from '@/components/Pricing/PricingCards';
import PricingFeatures from '@/components/Pricing/PricingFeatures';
import PricingCTA from '@/components/Pricing/PricingCTA';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-x-hidden flex flex-col">
      <Navbar activeTab="pricing" />
      <div className="flex-1 pt-20">
        <PricingHero />
        <PricingCards />
        <PricingFeatures />
        <PricingCTA />
      </div>
    </div>
  );
}
