import React from 'react';
import Navbar from '@/components/Landing/Navbar';
import HowItWorksHero from '@/components/HowItWorks/HowItWorksHero';
import HowItWorksSteps from '@/components/HowItWorks/HowItWorksSteps';
import HowItWorksBottom from '@/components/HowItWorks/HowItWorksBottom';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-x-hidden flex flex-col">
      <Navbar activeTab="how-it-works" />
      <div className="flex-1 pt-20">
        <HowItWorksHero />
        <HowItWorksSteps />
        <HowItWorksBottom />
      </div>
    </div>
  );
}
