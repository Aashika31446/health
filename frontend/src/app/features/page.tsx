import React from 'react';
import Navbar from '@/components/Landing/Navbar';
import FeaturesHero from '@/components/Features/FeaturesHero';
import FeaturesBentoGrid from '@/components/Features/FeaturesBentoGrid';
import FeaturesCTA from '@/components/Features/FeaturesCTA';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-x-hidden flex flex-col">
      <Navbar activeTab="features" />
      <div className="flex-1 pt-20">
        <FeaturesHero />
        <FeaturesBentoGrid />
        <FeaturesCTA />
      </div>
    </div>
  );
}
