import React from 'react';
import { ArrowRight, Play, HeartPulse, CheckCircle2, Globe, Users, ShieldCheck, Heart } from 'lucide-react';

export default function AboutHero() {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white pt-20 pb-20">
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-0 pointer-events-none"></div>
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-3xl -translate-x-1/2 z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-6">
              Our Story
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold text-[#0F172A] leading-[1.15] tracking-tight mb-6">
              Building a Healthier <br className="hidden md:block" />
              Tomorrow <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">with AI</span>
            </h1>
            
            <p className="text-[#475569] text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              CuraMind AI was created with a simple belief — that everyone deserves to understand their health. 
              We combine advanced artificial intelligence with medical knowledge to make healthcare information 
              clear, accessible, and empowering for all.
            </p>


          </div>

          {/* Right Visuals (Mockup) */}
          <div className="flex-1 w-full relative h-[450px] md:h-[500px] flex items-center justify-center">
            
            {/* The Main Image */}
            <div className="w-[280px] h-[380px] md:w-[340px] md:h-[440px] rounded-[40px] shadow-2xl relative flex items-center justify-center z-10 border-4 border-white bg-white">
              {/* Replace the placeholder with the actual image */}
              <img 
                src="/doctor.png" 
                alt="Healthcare Professional" 
                className="w-full h-full object-cover object-top rounded-[36px]"
              />
            </div>

            {/* Floating Cursive Text */}
            <div className="absolute top-0 right-0 md:-top-4 md:-right-12 -rotate-12 font-medium text-blue-400 text-xl tracking-tight z-0" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
              People <br/>
              Technology <br/>
              Better Health <br/>
              Together
            </div>

            {/* Floating Card 1: Top Left - Moved further out to prevent overlap */}
            <div className="absolute top-[5%] left-0 md:-left-16 lg:-left-24 bg-white p-3 rounded-2xl shadow-xl shadow-blue-900/10 z-20 flex items-center gap-3 border border-gray-100 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#0F172A] leading-tight">Smarter Insights</span>
                <span className="text-[10px] text-[#64748B] leading-tight">Healthier Lives</span>
              </div>
            </div>

            {/* Floating Card 2: Bottom Left - Moved further out */}
            <div className="absolute bottom-[15%] left-2 md:-left-20 lg:-left-28 bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/10 z-30 max-w-[200px] border border-gray-100">
              <p className="text-[12px] font-bold text-[#0F172A] leading-snug mb-3">
                "Technology should bring people closer to better health."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                  <Heart size={12} className="fill-purple-500" />
                </div>
                <span className="text-[10px] text-[#64748B] font-medium">— Our Belief</span>
              </div>
            </div>

            {/* Floating Card 3: Bottom Right - Moved further out */}
            <div className="absolute bottom-[5%] -right-2 md:-right-16 lg:-right-20 bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/10 z-20 flex flex-col gap-2 max-w-[180px] border border-gray-100">
              <div className="flex items-center gap-2 text-blue-500">
                <Users size={16} />
                <div className="w-6 h-1.5 bg-blue-100 rounded-full"></div>
              </div>
              <span className="text-[11px] font-bold text-[#0F172A] leading-snug">
                For Individuals, Families and Healthcare Providers
              </span>
            </div>

          </div>
        </div>



      </div>
    </div>
  );
}
