import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HowItWorksHero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 pt-20 pb-16 relative flex flex-col items-center justify-center text-center">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
      
      {/* Floating Cursive Texts (Hidden on small screens) */}
      <div className="hidden lg:block absolute left-8 top-1/4 -rotate-12 font-medium text-blue-300 text-xl tracking-tight" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
        Upload <br/>
        Understand <br/>
        Take Control
      </div>
      
      <div className="hidden lg:block absolute right-8 top-1/4 rotate-12 font-medium text-blue-300 text-xl tracking-tight" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
        Your Health <br/>
        Insights <br/>
        In 4 Simple Steps
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 border border-blue-100 text-blue-600 text-[13px] font-semibold tracking-wide shadow-sm mb-6 backdrop-blur-sm">
        <Sparkles size={14} className="text-blue-500" />
        Simple. Secure. Powerful.
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#0F172A] leading-[1.1] tracking-tight mb-6 max-w-3xl">
        How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">CuraMind AI</span> Works
      </h1>

      {/* Subtext */}
      <p className="text-[#475569] text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        From your medical report to meaningful insights — in just a few simple steps. 
        CuraMind AI uses advanced AI to analyze, explain, and help you understand your health reports, 
        so you can make informed decisions with confidence.
      </p>

    </div>
  );
}
