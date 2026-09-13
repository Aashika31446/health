import React from 'react';
import { Sparkles, Plus } from 'lucide-react';

export default function FeaturesHero() {
  return (
    <div className="w-full relative max-w-7xl mx-auto px-8 pt-12 pb-16 flex flex-col items-center justify-center text-center z-10">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 via-blue-50/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Floating Elements - Left */}
      <div className="hidden lg:block absolute left-8 top-20 text-left opacity-80">
        <p className="text-[#94A3B8] font-medium text-lg leading-snug">Better</p>
        <p className="text-[#94A3B8] font-medium text-lg leading-snug">Understanding</p>
        <p className="text-[#94A3B8] font-medium text-lg leading-snug">Healthier You</p>
        <div className="w-8 h-[2px] bg-[#CBD5E1] mt-3"></div>
      </div>

      {/* Floating Elements - Right */}
      <div className="hidden lg:block absolute right-8 top-16 text-right opacity-80 italic">
        <Plus className="absolute -top-10 right-4 text-blue-200/60 drop-shadow-md" size={48} strokeWidth={3} />
        <p className="text-[#94A3B8] text-lg leading-snug">Your Reports</p>
        <p className="text-[#94A3B8] text-lg leading-snug">Our AI</p>
        <p className="text-[#94A3B8] text-lg leading-snug">A Healthier Tomorrow</p>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium text-[11px] uppercase tracking-wider mb-8 border border-blue-100 shadow-sm">
          <Sparkles size={14} className="text-blue-500" />
          AI-Powered Healthcare Assistant
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-tight mb-6 tracking-tight">
          Everything You Need to Understand <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Your Health</span>
        </h1>

        <p className="text-[#475569] text-base md:text-lg max-w-2xl leading-relaxed">
          Turn your medical reports into clear insights, get simple explanations, track your health and make informed decisions — all with the power of AI.
        </p>
      </div>
    </div>
  );
}
