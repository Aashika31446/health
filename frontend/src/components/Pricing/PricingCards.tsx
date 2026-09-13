"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, User, Crown, FileText, Users, ArrowRight } from 'lucide-react';
import InteractiveTiltCard from '@/components/ui/InteractiveTiltCard';

export default function PricingCards() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'plus' | 'pro' | 'enterprise'>('plus');

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-20 relative z-10 flex flex-col items-center">
      
      {/* Toggle */}
      <div className="relative flex items-center bg-white p-1.5 rounded-full border border-gray-200 shadow-sm mb-12">
        <button 
          onClick={() => setIsYearly(false)}
          className={`relative z-10 px-6 py-2.5 text-sm font-semibold rounded-full transition-all ${!isYearly ? 'text-white' : 'text-[#475569] hover:text-[#0F172A]'}`}
        >
          Monthly
        </button>
        <button 
          onClick={() => setIsYearly(true)}
          className={`relative z-10 px-6 py-2.5 text-sm font-semibold rounded-full transition-all ${isYearly ? 'text-white' : 'text-[#475569] hover:text-[#0F172A]'}`}
        >
          Yearly
        </button>
        
        {/* Toggle Pill Background */}
        <div 
          className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-blue-600 rounded-full transition-transform duration-300 ease-in-out shadow-sm"
          style={{ transform: isYearly ? 'translateX(calc(100% + 6px))' : 'translateX(0)' }}
        ></div>

        {/* Save up to 20% Floating Badge */}
        <div className="absolute -top-4 -right-12 bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-1 rounded-full shadow-sm">
          Save up to 20%
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        
        {/* 1. Free */}
        <InteractiveTiltCard
          variant="float"
          containerClassName={`h-full flex flex-col transition-all duration-300 ${selectedPlan === 'free' ? 'lg:-translate-y-4' : 'hover:lg:-translate-y-1'}`}
          className={`bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col h-full relative cursor-pointer ${
            selectedPlan === 'free'
              ? 'border-purple-500 shadow-xl shadow-purple-900/10 ring-1 ring-purple-500/20'
              : 'border-gray-100 shadow-sm hover:border-gray-200'
          }`}
          glowColor={selectedPlan === 'free' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(2, 132, 199, 0.08)'}
          borderGlowColor={selectedPlan === 'free' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(56, 189, 248, 0.45)'}
          onClick={() => setSelectedPlan('free')}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <User size={24} />
            </div>
            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-blue-100">Get Started</span>
          </div>
          <h3 className="font-bold text-[#0F172A] text-xl mb-2">Free</h3>
          <p className="text-[#64748B] text-[13px] leading-relaxed mb-6 h-10">
            Perfect for individuals who want to try CuraMind AI.
          </p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-[#0F172A]">₹0</span>
            <span className="text-[#64748B] text-sm font-medium"> / month</span>
          </div>

          <div className="flex flex-col gap-3 mb-8 flex-1">
            <FeatureItem text="Upload up to 5 reports/month" />
            <FeatureItem text="Basic AI explanations" />
            <FeatureItem text="Chat with your reports" />
            <FeatureItem text="Standard response speed" />
            <FeatureItem text="Multi-language support" />
            <FeatureItem text="Advanced health insights" missing />
          </div>

          <Link href="/login" onClick={() => setSelectedPlan('free')} className="w-full mt-auto block">
            <button className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedPlan === 'free'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 shadow-lg shadow-blue-500/20'
                : 'border border-[#CBD5E1] text-[#0F172A] hover:bg-gray-50'
            }`}>
              Get Started Free <ArrowRight size={16} />
            </button>
          </Link>
        </InteractiveTiltCard>

        {/* 2. Plus */}
        <InteractiveTiltCard
          variant="border-flow"
          containerClassName={`h-full flex flex-col transition-all duration-300 ${selectedPlan === 'plus' ? 'lg:-translate-y-4' : 'hover:lg:-translate-y-1'}`}
          className={`bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col h-full relative cursor-pointer ${
            selectedPlan === 'plus'
              ? 'border-purple-500 shadow-xl shadow-purple-900/10 ring-1 ring-purple-500/20'
              : 'border-gray-100 shadow-sm hover:border-gray-200'
          }`}
          glowColor={selectedPlan === 'plus' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.08)'}
          borderGlowColor={selectedPlan === 'plus' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(168, 85, 247, 0.35)'}
          onClick={() => setSelectedPlan('plus')}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center">
              <Crown size={24} />
            </div>
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">Most Popular</span>
          </div>
          <h3 className="font-bold text-[#0F172A] text-xl mb-2">Plus</h3>
          <p className="text-[#64748B] text-[13px] leading-relaxed mb-6 h-10">
            For individuals and families who want deeper insights.
          </p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-[#0F172A] transition-all">
              ₹{isYearly ? '399' : '499'}
            </span>
            <span className="text-[#64748B] text-sm font-medium"> / month</span>
          </div>

          <div className="flex flex-col gap-3 mb-8 flex-1">
            <FeatureItem text="Upload up to 50 reports/month" />
            <FeatureItem text="Detailed AI explanations" />
            <FeatureItem text="Health trend tracking" />
            <FeatureItem text="Personal health dashboard" />
            <FeatureItem text="Priority support" />
            <FeatureItem text="Advanced disease risk insights" missing />
          </div>

          <Link href="/login" onClick={() => setSelectedPlan('plus')} className="w-full mt-auto block">
            <button className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedPlan === 'plus'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 shadow-lg shadow-blue-500/20'
                : 'border border-[#CBD5E1] text-[#0F172A] hover:bg-gray-50'
            }`}>
              Start Plus Plan <ArrowRight size={16} />
            </button>
          </Link>
        </InteractiveTiltCard>

        {/* 3. Pro */}
        <InteractiveTiltCard
          variant="shimmer"
          containerClassName={`h-full flex flex-col transition-all duration-300 ${selectedPlan === 'pro' ? 'lg:-translate-y-4' : 'hover:lg:-translate-y-1'}`}
          className={`bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col h-full relative cursor-pointer ${
            selectedPlan === 'pro'
              ? 'border-purple-500 shadow-xl shadow-purple-900/10 ring-1 ring-purple-500/20'
              : 'border-gray-100 shadow-sm hover:border-gray-200'
          }`}
          glowColor={selectedPlan === 'pro' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(16, 185, 129, 0.08)'}
          borderGlowColor={selectedPlan === 'pro' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(16, 185, 129, 0.45)'}
          onClick={() => setSelectedPlan('pro')}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-100">Best Value</span>
          </div>
          <h3 className="font-bold text-[#0F172A] text-xl mb-2">Pro</h3>
          <p className="text-[#64748B] text-[13px] leading-relaxed mb-6 h-10">
            For power users who want complete health intelligence.
          </p>
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-[#0F172A] transition-all">
              ₹{isYearly ? '799' : '999'}
            </span>
            <span className="text-[#64748B] text-sm font-medium"> / month</span>
          </div>

          <div className="flex flex-col gap-3 mb-8 flex-1">
            <FeatureItem text="Unlimited report uploads" color="emerald" />
            <FeatureItem text="Advanced AI health insights" color="emerald" />
            <FeatureItem text="Personalized health recommendations" color="emerald" />
            <FeatureItem text="Trend analysis & comparisons" color="emerald" />
            <FeatureItem text="Early access to new features" color="emerald" />
            <FeatureItem text="Priority support" color="emerald" />
          </div>

          <Link href="/login" onClick={() => setSelectedPlan('pro')} className="w-full mt-auto block">
            <button className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedPlan === 'pro'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 shadow-lg shadow-blue-500/20'
                : 'border border-[#CBD5E1] text-[#0F172A] hover:bg-gray-50'
            }`}>
              Start Pro Plan <ArrowRight size={16} />
            </button>
          </Link>
        </InteractiveTiltCard>

        {/* 4. Enterprise */}
        <InteractiveTiltCard
          variant="tilt"
          containerClassName={`h-full flex flex-col transition-all duration-300 ${selectedPlan === 'enterprise' ? 'lg:-translate-y-4' : 'hover:lg:-translate-y-1'}`}
          className={`bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col h-full relative cursor-pointer ${
            selectedPlan === 'enterprise'
              ? 'border-purple-500 shadow-xl shadow-purple-900/10 ring-1 ring-purple-500/20'
              : 'border-gray-100 shadow-sm hover:border-gray-200'
          }`}
          glowColor={selectedPlan === 'enterprise' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(217, 70, 239, 0.08)'}
          borderGlowColor={selectedPlan === 'enterprise' ? 'rgba(168, 85, 247, 0.6)' : 'rgba(217, 70, 239, 0.45)'}
          onClick={() => setSelectedPlan('enterprise')}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 text-fuchsia-500 flex items-center justify-center">
              <Users size={24} />
            </div>
            <span className="bg-fuchsia-50 text-fuchsia-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-fuchsia-100">For Hospitals & Clinics</span>
          </div>
          <h3 className="font-bold text-[#0F172A] text-xl mb-2">Enterprise</h3>
          <p className="text-[#64748B] text-[13px] leading-relaxed mb-6 h-10">
            Custom solutions for hospitals, clinics, and healthcare providers.
          </p>
          <div className="mb-8">
            <span className="text-[28px] font-extrabold text-[#0F172A] leading-none">Custom Pricing</span>
          </div>

          <div className="flex flex-col gap-3 mb-8 flex-1 mt-1">
            <FeatureItem text="Unlimited report processing" color="blue" />
            <FeatureItem text="Advanced analytics & integrations" color="blue" />
            <FeatureItem text="Multi-user team access" color="blue" />
            <FeatureItem text="Custom AI models & workflows" color="blue" />
            <FeatureItem text="Dedicated account manager" color="blue" />
            <FeatureItem text="24/7 priority support" color="blue" />
          </div>

          <button 
            onClick={() => setSelectedPlan('enterprise')}
            className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-auto cursor-pointer ${
              selectedPlan === 'enterprise'
                ? 'bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white hover:opacity-90 shadow-lg shadow-blue-500/20'
                : 'border border-[#CBD5E1] text-[#0F172A] hover:bg-gray-50'
            }`}
          >
            Contact Sales <ArrowRight size={16} />
          </button>
        </InteractiveTiltCard>

      </div>
    </div>
  );
}

function FeatureItem({ text, missing = false, color = "blue" }: { text: string, missing?: boolean, color?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      {missing ? (
        <XCircle size={16} className="text-gray-300 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 size={16} className={color === 'emerald' ? 'text-emerald-500 shrink-0 mt-0.5' : 'text-blue-500 shrink-0 mt-0.5'} />
      )}
      <span className={`text-[13px] leading-snug ${missing ? 'text-[#94A3B8]' : 'text-[#334155]'}`}>
        {text}
      </span>
    </div>
  );
}
