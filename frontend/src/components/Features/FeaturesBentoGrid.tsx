'use client';

import React from 'react';
import { 
  FileText, UploadCloud, CheckCircle2, Lightbulb, 
  MessageSquare, Pill, Globe, LayoutDashboard, ShieldCheck, 
  ArrowRight, Search, Activity, FileCheck, Lock, Droplet
} from 'lucide-react';
import InteractiveTiltCard from '@/components/ui/InteractiveTiltCard';

export default function FeaturesBentoGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 pb-20 z-10 relative">
      
      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- ROW 1 --- */}

        {/* 1. Smart Report Analysis */}
        <InteractiveTiltCard 
          variant="tilt"
          containerClassName="lg:col-span-5"
          maxTilt={6}
          borderGlowColor="rgba(59, 130, 246, 0.5)"
          className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col relative overflow-hidden h-full"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-lg">Smart Report Analysis</h3>
              <p className="text-[#64748B] text-sm">Upload your medical reports (PDF, image or lab report) and get instant analysis with key insights.</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4 h-full">
            {/* Drag Drop Mockup */}
            <div className="flex-1 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/50 flex flex-col items-center justify-center p-4 text-center">
              <UploadCloud className="text-blue-400 mb-2" size={28} />
              <p className="text-[11px] font-medium text-[#0F172A] mb-1">Drag & drop your file here</p>
              <p className="text-[10px] text-[#64748B] mb-3">or click to upload</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-white text-blue-500 text-[9px] font-bold rounded border border-blue-100 shadow-sm">✧ PDF</span>
                <span className="px-2 py-1 bg-white text-blue-500 text-[9px] font-bold rounded border border-blue-100 shadow-sm">✧ JPG</span>
              </div>
            </div>

            {/* CBC Report Mockup */}
            <div className="flex-[1.5] bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" />
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Complete Blood Count (CBC)</p>
                    <p className="text-[9px] text-[#64748B]">Lab Report • 12 Aug 2025</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                  <CheckCircle2 size={10} /> Analyzed
                </span>
              </div>
              
              <div className="flex gap-4 text-[10px] font-semibold border-b border-gray-100 pb-1 mb-2">
                <span className="text-blue-600 border-b-2 border-blue-600 pb-1 -mb-[5px]">Key Results</span>
                <span className="text-[#94A3B8]">Summary</span>
                <span className="text-[#94A3B8]">AI Insights</span>
              </div>

              <div className="flex-1 flex flex-col gap-2 mt-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#475569]">Hemoglobin</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0F172A]">14.2 g/dL</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Normal</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#475569]">WBC Count</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0F172A]">7,800 /µL</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Normal</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#475569]">Platelets</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0F172A]">2.4 lakh/µL</span>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-medium">Normal</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-blue-600 font-medium mt-2 flex items-center gap-1 cursor-pointer hover:underline">View Full Analysis <ArrowRight size={10}/></p>
            </div>
          </div>
        </InteractiveTiltCard>

        {/* 2. Simple AI Explanations */}
        <InteractiveTiltCard 
          variant="shimmer"
          containerClassName="lg:col-span-4"
          borderGlowColor="rgba(147, 51, 234, 0.45)"
          glowColor="rgba(147, 51, 234, 0.08)"
          className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Lightbulb size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-lg">Simple AI Explanations</h3>
              <p className="text-[#64748B] text-sm leading-snug mt-1">Get easy-to-understand explanations for complex medical terms.</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {/* Chat Bubble 1 */}
            <div className="self-end bg-[#E2E8F0] text-[#0F172A] text-[13px] px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%]">
              What does a high CRP level mean?
            </div>
            {/* Chat Bubble 2 */}
            <div className="self-start flex gap-2 w-full">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                <SparklesIcon size={12} />
              </div>
              <div className="bg-white border border-blue-100 text-[#334155] text-[13px] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm leading-relaxed flex-1">
                <span className="font-semibold text-[#0F172A]">CRP (C-Reactive Protein)</span> is a marker of inflammation in your body. A high CRP level can indicate an infection, inflammation or other medical conditions. It's best to discuss your results with your doctor for proper evaluation.
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
            <CheckCircle2 size={14} />
            Explained in simple, clear language
          </div>
        </InteractiveTiltCard>

        {/* 3. Health Insights (Chart alternative) */}
        <InteractiveTiltCard 
          variant="float"
          containerClassName="lg:col-span-3"
          borderGlowColor="rgba(13, 148, 136, 0.45)"
          glowColor="rgba(13, 148, 136, 0.08)"
          className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-lg">Health Insights</h3>
              <p className="text-[#64748B] text-sm leading-snug mt-1">Track key health metrics over time.</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Activity size={16}/></div>
                <div>
                  <p className="text-[11px] text-[#64748B]">Heart Rate</p>
                  <p className="font-bold text-[#0F172A] text-sm">72 bpm</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium">Normal</span>
            </div>

            <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><Droplet size={16}/></div>
                <div>
                  <p className="text-[11px] text-[#64748B]">Blood Pressure</p>
                  <p className="font-bold text-[#0F172A] text-sm">120/80</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-medium">Normal</span>
            </div>
          </div>
        </InteractiveTiltCard>

        {/* --- ROW 2 --- */}

        {/* 4. Chat With Your Reports */}
        <InteractiveTiltCard 
          variant="glow-pulse"
          containerClassName="lg:col-span-4"
          borderGlowColor="rgba(217, 70, 239, 0.55)"
          glowColor="rgba(217, 70, 239, 0.12)"
          className="bg-white rounded-3xl p-8 border border-gray-100 flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-lg">Chat With Your Reports</h3>
              <p className="text-[#64748B] text-sm mt-1">Ask questions about your reports and get instant, reliable answers.</p>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 flex-1 flex flex-col gap-3 relative">
            <div className="self-end bg-[#E2E8F0] text-[#0F172A] text-[12px] px-3 py-2 rounded-xl rounded-tr-sm w-fit max-w-[90%]">
              What could be the reason for my low Vitamin D level?
            </div>
            <div className="self-start flex gap-2 w-full">
               <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <SparklesIcon size={10} />
              </div>
              <div className="bg-white border border-gray-100 text-[#334155] text-[12px] px-3 py-2.5 rounded-xl rounded-tl-sm shadow-sm leading-relaxed flex-1">
                Low Vitamin D levels can be due to limited sun exposure, dietary insufficiency, absorption issues or certain medical conditions. Please consult your doctor for a proper evaluation.
                
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] text-[#64748B]">Sources:</span>
                  <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded font-medium">
                    <FileText size={10}/> Vitamin_D_Report.pdf <span className="text-blue-400">Page 2</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Input Mockup */}
            <div className="mt-auto pt-4 relative">
               <div className="absolute left-3 top-1/2 translate-y-[2px] text-blue-500"><SparklesIcon size={14}/></div>
               <div className="w-full bg-white border border-gray-200 rounded-full h-10 pl-9 pr-10 flex items-center text-[12px] text-[#94A3B8] shadow-sm">
                 Ask another question...
               </div>
               <div className="absolute right-1 top-1/2 translate-y-[-2px] w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                 <ArrowRight size={14}/>
               </div>
            </div>
          </div>
        </InteractiveTiltCard>

        {/* 5. Prescription Analysis & Secure */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Prescription Analysis */}
          <InteractiveTiltCard 
            variant="spotlight"
            borderGlowColor="rgba(99, 102, 241, 0.45)"
            glowColor="rgba(99, 102, 241, 0.08)"
            className="bg-white rounded-3xl p-8 border border-gray-100 flex-1 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Pill size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A] text-lg">Prescription Analysis</h3>
                <p className="text-[#64748B] text-sm mt-1">Understand your medications, usage and important safety info.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Pill size={16}/></div>
                    <div>
                      <p className="font-bold text-[#0F172A] text-[13px]">Metformin 500 mg</p>
                      <p className="text-[11px] text-[#64748B]">For type 2 diabetes</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-1 rounded border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 size={10}/> Commonly Used
                  </span>
               </div>
               
               <div className="grid grid-cols-3 gap-2">
                 <div className="bg-[#F8FAFC] p-2 rounded-lg">
                   <CheckCircle2 size={14} className="text-emerald-500 mb-1"/>
                   <p className="text-[10px] text-[#64748B]">Usage</p>
                   <p className="text-[11px] font-semibold text-[#0F172A] leading-tight">As prescribed</p>
                 </div>
                 <div className="bg-[#F8FAFC] p-2 rounded-lg">
                   <Activity size={14} className="text-indigo-500 mb-1"/>
                   <p className="text-[10px] text-[#64748B]">Interactions</p>
                   <p className="text-[11px] font-semibold text-[#0F172A] leading-tight">Check w/ doctor</p>
                 </div>
                 <div className="bg-[#F8FAFC] p-2 rounded-lg">
                   <Droplet size={14} className="text-rose-500 mb-1"/>
                   <p className="text-[10px] text-[#64748B]">Side Effects</p>
                   <p className="text-[11px] font-semibold text-[#0F172A] leading-tight">May include nausea</p>
                 </div>
               </div>
            </div>
          </InteractiveTiltCard>

          {/* Secure & Private (Small horizontal card) */}
          <InteractiveTiltCard 
            variant="magnetic"
            borderGlowColor="rgba(37, 99, 235, 0.45)"
            glowColor="rgba(37, 99, 235, 0.08)"
            className="bg-[#F8FAFC] rounded-3xl p-5 border border-gray-100 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-[15px]">Secure & Private</h3>
              <p className="text-[#64748B] text-[12px] mt-0.5">End-to-end encrypted. Your data stays private.</p>
            </div>
          </InteractiveTiltCard>
        </div>

        {/* 6. Languages & Dashboard */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {/* Multilingual Support */}
           <InteractiveTiltCard 
             variant="border-flow"
             borderGlowColor="rgba(6, 182, 212, 0.55)"
             glowColor="rgba(6, 182, 212, 0.12)"
             className="bg-white rounded-3xl p-6 border border-gray-100 flex-1 h-full"
           >
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-lg">Multilingual Support</h3>
                  <p className="text-[#64748B] text-[13px] mt-0.5">Get explanations in your preferred language.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-blue-600 text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-sm">English</span>
                <span className="bg-[#F8FAFC] border border-gray-200 text-[#334155] text-[11px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">हिन्दी</span>
                <span className="bg-[#F8FAFC] border border-gray-200 text-[#334155] text-[11px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">বাংলা</span>
                <span className="bg-[#F8FAFC] border border-gray-200 text-[#334155] text-[11px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">தமிழ்</span>
                <span className="bg-[#F8FAFC] border border-gray-200 text-[#334155] text-[11px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">తెలుగు</span>
                <span className="bg-[#F8FAFC] border border-gray-200 text-[#334155] text-[11px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">मराठी</span>
                <span className="bg-[#F8FAFC] border border-gray-200 text-[#334155] text-[11px] font-medium px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">ગુજરાતી</span>
              </div>
           </InteractiveTiltCard>

           {/* Personal Health Dashboard */}
           <InteractiveTiltCard 
             variant="float"
             borderGlowColor="rgba(249, 115, 22, 0.45)"
             glowColor="rgba(249, 115, 22, 0.08)"
             className="bg-[#F8FAFC] rounded-3xl p-6 border border-gray-100 flex-1 h-full"
           >
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <LayoutDashboard size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-lg">Personal Dashboard</h3>
                  <p className="text-[#64748B] text-[13px] mt-0.5">Keep all your reports and progress in one place.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                  <FileCheck size={16} className="text-blue-500 mb-1"/>
                  <span className="font-bold text-[#0F172A]">12</span>
                  <span className="text-[9px] text-[#64748B]">Reports</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                  <Lightbulb size={16} className="text-amber-500 mb-1"/>
                  <span className="font-bold text-[#0F172A]">5</span>
                  <span className="text-[9px] text-[#64748B]">Insights</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                  <MessageSquare size={16} className="text-purple-500 mb-1"/>
                  <span className="font-bold text-[#0F172A]">3</span>
                  <span className="text-[9px] text-[#64748B]">Active Chats</span>
                </div>
              </div>
           </InteractiveTiltCard>
        </div>

      </div>
    </div>
  );
}

function SparklesIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
