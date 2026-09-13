import React from 'react';
import { ShieldCheck, User, HeartPulse, Sparkles } from 'lucide-react';

export default function HowItWorksBottom() {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-20 relative overflow-hidden">
      <div className="bg-[#F8FAFC] rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Left Content */}
        <div className="flex-1 w-full relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            More Than Just Reports
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] leading-[1.15] tracking-tight mb-6">
            A Smarter Way to Understand <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Your Health</span>
          </h2>
          
          <p className="text-[#475569] text-base leading-relaxed max-w-lg mb-12">
            CuraMind AI makes medical reports simple, insightful, and actionable — so you can have better conversations with your doctor and take charge of your well-being.
          </p>

          {/* Three Feature Pillars */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-[#0F172A] text-sm mb-1.5">Accurate & Reliable</h4>
              <p className="text-[#64748B] text-xs leading-relaxed">Powered by advanced AI and medical knowledge</p>
            </div>
            
            <div className="flex-1">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <User size={20} />
              </div>
              <h4 className="font-bold text-[#0F172A] text-sm mb-1.5">Personalized Insights</h4>
              <p className="text-[#64748B] text-xs leading-relaxed">Tailored to your unique health profile</p>
            </div>
            
            <div className="flex-1">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center mb-4">
                <HeartPulse size={20} />
              </div>
              <h4 className="font-bold text-[#0F172A] text-sm mb-1.5">Better Decisions</h4>
              <p className="text-[#64748B] text-xs leading-relaxed">Feel informed, confident and in control</p>
            </div>
          </div>
        </div>        {/* Right Content - Visual Mockup */}
        <div className="flex-1 w-full relative h-[460px] flex items-center justify-center pointer-events-none mt-10 lg:mt-0">
          
          {/* Decorative floating texts */}
          <div className="absolute top-2 left-4 -rotate-[15deg] font-medium text-blue-300 text-lg tracking-tight z-0" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
            From Reports <br/>
            to Real Understanding
          </div>
          <div className="absolute bottom-2 right-4 rotate-[10deg] font-medium text-blue-300 text-lg tracking-tight z-0 text-right" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
            Same Reports <br/>
            Clearer Answers <br/>
            Healthier You
          </div>

          {/* Abstract Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl z-0"></div>

          {/* Left Slanted Card (Lab Report) */}
          <div className="absolute left-[8%] top-[15%] w-[250px] h-[320px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-blue-900/5 -rotate-12 z-10 flex flex-col p-6 opacity-95">
             <h4 className="font-bold text-[#0F172A] text-[15px] mb-6">Lab Report</h4>
             {/* Skeleton lines */}
             <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3"></div>
             <div className="w-3/4 h-2.5 bg-gray-100 rounded-full mb-8"></div>
             <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3"></div>
             <div className="w-5/6 h-2.5 bg-gray-100 rounded-full mb-3"></div>
             <div className="w-4/5 h-2.5 bg-gray-100 rounded-full mb-8"></div>
             <div className="w-full h-2.5 bg-gray-100 rounded-full mb-3"></div>
             <div className="w-2/3 h-2.5 bg-gray-100 rounded-full"></div>
          </div>

          {/* Arrow */}
          <div className="absolute top-[48%] left-[48%] -translate-y-1/2 -translate-x-1/2 z-20 text-blue-500">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M5 12h14"></path>
               <path d="m12 5 7 7-7 7"></path>
             </svg>
          </div>

          {/* Right Slanted Card (AI Analysis) */}
          <div className="absolute right-[5%] top-[20%] w-[320px] bg-white border border-blue-100 rounded-2xl shadow-2xl shadow-blue-900/10 rotate-6 z-30 flex flex-col p-5">
             <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <User size={12} />
                  </div>
                  <h4 className="font-bold text-[#0F172A] text-[13px]">AI Analysis Result</h4>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-1 rounded border border-emerald-100">
                  Normal Range
                </span>
             </div>

             {/* Table */}
             <div className="flex flex-col gap-3 mb-5">
               <div className="flex justify-between items-center text-[11px] border-b border-gray-50 pb-2">
                 <span className="text-[#475569]">Hemoglobin</span>
                 <div className="flex items-center gap-2">
                   <span className="font-semibold text-[#0F172A]">14.2 g/dL</span>
                   <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Normal</span>
                 </div>
               </div>
               <div className="flex justify-between items-center text-[11px] border-b border-gray-50 pb-2">
                 <span className="text-[#475569]">WBC Count</span>
                 <div className="flex items-center gap-2">
                   <span className="font-semibold text-[#0F172A]">7,800 /µL</span>
                   <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Normal</span>
                 </div>
               </div>
               <div className="flex justify-between items-center text-[11px]">
                 <span className="text-[#475569]">Platelets</span>
                 <div className="flex items-center gap-2">
                   <span className="font-semibold text-[#0F172A]">2.4 lakh/µL</span>
                   <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Normal</span>
                 </div>
               </div>
             </div>

             {/* Insight Box */}
             <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
                <Sparkles size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-900 leading-relaxed font-medium">
                  Your blood parameters are within normal range. Overall, your report looks healthy!
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
