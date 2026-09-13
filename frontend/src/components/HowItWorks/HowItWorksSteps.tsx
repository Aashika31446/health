'use client';

import React from 'react';
import { 
  FileUp, FileSearch, Lightbulb, MessageSquare, 
  UploadCloud, Loader2, CheckCircle2, User, HeartPulse, ChevronRight
} from 'lucide-react';
import InteractiveTiltCard from '@/components/ui/InteractiveTiltCard';

export default function HowItWorksSteps() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 pb-20 relative z-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Step 1 */}
        <div className="relative">
          <InteractiveTiltCard 
            variant="float"
            borderGlowColor="rgba(59, 130, 246, 0.45)"
            glowColor="rgba(59, 130, 246, 0.08)"
            className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 flex flex-col h-full"
          >
            <div className="text-blue-500 font-bold text-lg mb-4 bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center">01</div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
              <FileUp size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg mb-2">Upload Your Report</h3>
            <p className="text-[#64748B] text-sm leading-relaxed mb-8 flex-1">
              Upload your medical reports (PDF, image, or lab report) securely.
            </p>
            
            {/* Mockup */}
            <div className="border border-dashed border-gray-200 bg-[#F8FAFC] rounded-2xl p-5 flex flex-col items-center justify-center text-center mt-auto">
              <UploadCloud className="text-blue-400 mb-3" size={32} />
              <p className="text-xs font-semibold text-[#0F172A] mb-1">Drag & drop your file here</p>
              <p className="text-[10px] text-[#64748B] mb-4">or click to upload</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white text-rose-500 text-[10px] font-bold rounded shadow-sm">PDF</span>
                <span className="px-2 py-1 bg-white text-blue-500 text-[10px] font-bold rounded shadow-sm">JPG</span>
                <span className="px-2 py-1 bg-white text-purple-500 text-[10px] font-bold rounded shadow-sm">PNG</span>
              </div>
            </div>
          </InteractiveTiltCard>

          {/* Connector Arrow */}
          <div className="hidden xl:flex absolute top-1/2 -right-3 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center text-blue-500 shadow-sm z-20">
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative">
          <InteractiveTiltCard 
            variant="shimmer"
            borderGlowColor="rgba(168, 85, 247, 0.45)"
            glowColor="rgba(168, 85, 247, 0.08)"
            className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 flex flex-col h-full"
          >
            <div className="text-purple-500 font-bold text-lg mb-4 bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center">02</div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
              <FileSearch size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg mb-2">AI Analyzes the Report</h3>
            <p className="text-[#64748B] text-sm leading-relaxed mb-8 flex-1">
              Our AI reads and understands your report, extracting key information and health metrics.
            </p>
            
            {/* Mockup */}
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 mt-auto">
              <div className="flex items-center gap-3">
                <Loader2 size={14} className="text-blue-500 animate-spin" />
                <span className="text-[11px] text-[#475569] font-medium">Detecting key values...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-purple-100 flex items-center justify-center"><CheckCircle2 size={10} className="text-purple-500"/></div>
                <span className="text-[11px] text-[#475569] font-medium">Analyzing medical terms...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 size={10} className="text-emerald-500"/></div>
                <span className="text-[11px] text-[#475569] font-medium">Checking normal ranges...</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-100 flex items-center justify-center"><CheckCircle2 size={10} className="text-amber-500"/></div>
                <span className="text-[11px] text-[#475569] font-medium">Identifying health insights...</span>
              </div>
            </div>
          </InteractiveTiltCard>

          {/* Connector Arrow */}
          <div className="hidden xl:flex absolute top-1/2 -right-3 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center text-purple-500 shadow-sm z-20">
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative">
          <InteractiveTiltCard 
            variant="glow-pulse"
            borderGlowColor="rgba(16, 185, 129, 0.55)"
            glowColor="rgba(16, 185, 129, 0.12)"
            className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 flex flex-col h-full"
          >
            <div className="text-emerald-500 font-bold text-lg mb-4 bg-emerald-50 w-10 h-10 rounded-full flex items-center justify-center">03</div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <Lightbulb size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg mb-2">Get Simple Explanations</h3>
            <p className="text-[#64748B] text-sm leading-relaxed mb-8 flex-1">
              CuraMind explains complex medical terms in easy-to-understand language.
            </p>
            
            {/* Mockup */}
            <div className="flex flex-col gap-3 mt-auto">
              <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 flex items-start gap-3 relative">
                 <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileUp size={10} />
                 </div>
                 <p className="text-[12px] text-[#334155] leading-relaxed">
                   Your Hemoglobin level is <span className="font-semibold text-[#0F172A]">14.2 g/dL</span>, which is within the normal range. This indicates that your oxygen carrying capacity is healthy.
                 </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span className="text-[11px] font-medium text-emerald-700">Explained in simple, clear language</span>
              </div>
            </div>
          </InteractiveTiltCard>

          {/* Connector Arrow */}
          <div className="hidden xl:flex absolute top-1/2 -right-3 -translate-y-1/2 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center text-emerald-500 shadow-sm z-20">
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Step 4 */}
        <div className="relative">
          <InteractiveTiltCard 
            variant="magnetic"
            borderGlowColor="rgba(99, 102, 241, 0.45)"
            glowColor="rgba(99, 102, 241, 0.08)"
            className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 flex flex-col h-full"
          >
            <div className="text-indigo-500 font-bold text-lg mb-4 bg-indigo-50 w-10 h-10 rounded-full flex items-center justify-center">04</div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
              <MessageSquare size={24} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-lg mb-2">Chat & Take Action</h3>
            <p className="text-[#64748B] text-sm leading-relaxed mb-8 flex-1">
              Ask follow-up questions, get personalized insights, and take control of your health.
            </p>
            
            {/* Mockup */}
            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center shrink-0 mt-1"><User size={10}/></div>
                <div className="bg-[#F8FAFC] border border-gray-100 text-[#334155] text-[11px] px-3 py-2 rounded-xl rounded-tl-sm w-full">
                  What does my high CRP level mean?
                </div>
              </div>
              <div className="flex items-start gap-2 mt-1">
                 <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1"><HeartPulse size={10}/></div>
                 <div className="bg-white border border-blue-100 text-[#334155] text-[11px] px-3 py-2 rounded-xl rounded-tl-sm w-full shadow-sm">
                   A high CRP level may indicate inflammation in your body. It's best to discuss this with your doctor for a proper evaluation.
                 </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-[9px] bg-white border border-gray-200 text-[#475569] px-2 py-1 rounded-full cursor-pointer hover:bg-gray-50">Is this serious?</span>
                <span className="text-[9px] bg-white border border-gray-200 text-[#475569] px-2 py-1 rounded-full cursor-pointer hover:bg-gray-50">What can I do?</span>
              </div>
            </div>
          </InteractiveTiltCard>
        </div>

      </div>
    </div>
  );
}
