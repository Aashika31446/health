"use client";

import React from 'react';
import { ArrowRight, Target, Eye, Gem, Accessibility, CheckCircle2, Heart, ShieldCheck, Zap } from 'lucide-react';
import InteractiveTiltCard from '@/components/ui/InteractiveTiltCard';

export default function AboutPurpose() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left Column */}
        <div className="flex-1 lg:max-w-md">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            Our Purpose
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0F172A] leading-[1.15] tracking-tight mb-6">
            Making Healthcare Knowledge Accessible to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Everyone</span>
          </h2>
          
          <p className="text-[#475569] text-base leading-relaxed mb-8">
            Medical reports can be confusing, filled with complex terms and unclear results. 
            CuraMind AI simplifies health information using advanced AI, so you can understand 
            your reports, ask questions, and make informed decisions with confidence.
          </p>

          <button className="px-6 py-3 rounded-full border border-gray-200 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            Our Mission <ArrowRight size={16} />
          </button>
        </div>

        {/* Right Column (Cards) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Mission Card */}
          <InteractiveTiltCard
            containerClassName="h-full flex flex-col"
            className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 h-full flex flex-col"
            glowColor="rgba(2, 132, 199, 0.08)"
            borderGlowColor="rgba(56, 189, 248, 0.45)"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg mb-3">Our Mission</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              To empower individuals with clear, accurate, and easy-to-understand health insights through AI.
            </p>
          </InteractiveTiltCard>

          {/* Vision Card */}
          <InteractiveTiltCard
            containerClassName="h-full flex flex-col"
            className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 h-full flex flex-col"
            glowColor="rgba(168, 85, 247, 0.08)"
            borderGlowColor="rgba(168, 85, 247, 0.45)"
          >
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-6">
              <Eye size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg mb-3">Our Vision</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              A world where everyone has access to personalized health understanding, leading to healthier and happier lives.
            </p>
          </InteractiveTiltCard>

          {/* Values Card */}
          <InteractiveTiltCard
            containerClassName="h-full flex flex-col"
            className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-8 h-full flex flex-col"
            glowColor="rgba(2, 132, 199, 0.08)"
            borderGlowColor="rgba(56, 189, 248, 0.45)"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
              <Gem size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg mb-5">Our Values</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Accessibility size={12} />
                </div>
                <span className="text-[#334155] text-xs font-medium">Accessibility for All</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={12} />
                </div>
                <span className="text-[#334155] text-xs font-medium">Accuracy & Trust</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                  <Heart size={12} />
                </div>
                <span className="text-[#334155] text-xs font-medium">User-Centric Design</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={12} />
                </div>
                <span className="text-[#334155] text-xs font-medium">Privacy & Security</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-fuchsia-50 text-fuchsia-500 flex items-center justify-center shrink-0">
                  <Zap size={12} />
                </div>
                <span className="text-[#334155] text-xs font-medium">Continuous Innovation</span>
              </li>
            </ul>
          </InteractiveTiltCard>
        </div>

      </div>
    </div>
  );
}
