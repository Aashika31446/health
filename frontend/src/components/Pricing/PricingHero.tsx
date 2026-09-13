import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PricingHero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 pt-20 pb-10 relative flex flex-col items-center justify-center text-center">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-blue-50/60 rounded-full blur-3xl -z-10"></div>
      
      {/* Floating Cursive Texts (Hidden on small screens) */}
      <div className="hidden lg:block absolute left-12 top-1/3 -rotate-[10deg] font-medium text-blue-400 text-lg tracking-tight" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
        Better <br/>
        Insights <br/>
        A Healthier You
      </div>
      
      <div className="hidden lg:block absolute right-8 top-1/4 rotate-[12deg] font-medium text-blue-400 text-lg tracking-tight text-right" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
        Invest in <br/>
        Your Health <br/>
        Invest in a Brighter <br/>
        Tomorrow
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-600 text-[13px] font-semibold tracking-wide shadow-sm mb-6">
        <Sparkles size={14} className="text-blue-500" />
        Simple Pricing. Better Healthcare.
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#0F172A] leading-[1.15] tracking-tight mb-6 max-w-3xl">
        Choose the Plan That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Fits You</span>
      </h1>

      {/* Subtext */}
      <p className="text-[#475569] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        Start free and upgrade anytime. CuraMind AI is designed to make healthcare insights 
        accessible, affordable, and powerful for everyone.
      </p>

    </div>
  );
}
