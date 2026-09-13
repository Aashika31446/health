import React from 'react';
import Navbar from '@/components/Landing/Navbar';
import AboutHero from '@/components/About/AboutHero';
import AboutPurpose from '@/components/About/AboutPurpose';
import AboutJourney from '@/components/About/AboutJourney';
import AboutWhy from '@/components/About/AboutWhy';
import AboutTeam from '@/components/About/AboutTeam';
import AboutCTA from '@/components/About/AboutCTA';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans overflow-x-hidden flex flex-col">
      <Navbar activeTab="about" />
      <div className="flex-1 pt-20">
        <AboutHero />
        <AboutPurpose />
        <AboutJourney />
        <AboutWhy />
        <AboutTeam />
        <AboutCTA />
      </div>
    </div>
  );
}
