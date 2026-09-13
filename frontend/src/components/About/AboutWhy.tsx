import React from 'react';
import { Users, ShieldCheck, Sparkles, HeartPulse, FileText, BarChart } from 'lucide-react';

export default function AboutWhy() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
      <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
        
        {/* Left Column (Visuals) */}
        <div className="flex-1 w-full relative flex justify-center lg:justify-start pt-10 lg:pt-0">
          
          {/* Main Mockup Placeholder */}
          <div className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-[40px] shadow-2xl relative flex items-center justify-center z-10 border-4 border-white bg-white">
            <img 
              src="/curaminlabreport.png" 
              alt="CuraMind AI Robot with Medical Report" 
              className="w-full h-full object-cover rounded-[36px]"
            />
          </div>

          {/* Floating Cursive Text */}
          <div className="absolute bottom-[-10px] md:bottom-[-20px] right-[-10px] md:right-[-30px] rotate-[-12deg] font-medium text-blue-400 text-lg md:text-xl tracking-tight z-20" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
            Better <br/>
            Health Insights <br/>
            Brighter Tomorrows
          </div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-3xl z-0 pointer-events-none"></div>

        </div>

        {/* Right Column (Content) */}
        <div className="flex-1 lg:max-w-md w-full">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            Why CuraMind AI
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0F172A] leading-[1.15] tracking-tight mb-6">
            More Than Just Reports <br className="hidden md:block" />
            A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Healthier</span> You
          </h2>
          
          <p className="text-[#475569] text-base leading-relaxed mb-10">
            We're not just building a tool — we're building a healthier, more informed world. 
            CuraMind AI is for everyone who believes that understanding health should be simple, 
            accessible, and empowering.
          </p>

          <div className="flex flex-col gap-8">
            
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-[15px] mb-1">People First</h4>
                <p className="text-[#64748B] text-[13px] leading-relaxed">
                  Designed for individuals, families, and healthcare providers.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-[15px] mb-1">Trust & Privacy</h4>
                <p className="text-[#64748B] text-[13px] leading-relaxed">
                  Your health data is secure and always in your control.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-1">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#0F172A] text-[15px] mb-1">Real Impact</h4>
                <p className="text-[#64748B] text-[13px] leading-relaxed">
                  Turning complex medical information into meaningful insights.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
