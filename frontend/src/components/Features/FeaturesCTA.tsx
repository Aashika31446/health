'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoModal from '@/components/Landing/VideoModal';

export default function FeaturesCTA() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-16 mb-12">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side */}
        <div className="flex-1 text-left">
          <p className="text-blue-500 font-bold text-[10px] tracking-widest uppercase mb-4">
            WHY CURAMIND AI
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4 leading-tight tracking-tight">
            Healthcare insights, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">
              made simple.
            </span>
          </h2>
          <p className="text-[#475569] text-base leading-relaxed max-w-md">
            From confusing medical terms to clear answers — CuraMind AI helps you understand your health, so you can take the next step with confidence.
          </p>
        </div>

        {/* Right Side - CTA Box */}
        <div className="flex-1 w-full bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 blur-3xl rounded-full"></div>
          
          <div className="flex items-start gap-3 mb-6 relative z-10">
            <div className="text-blue-500 mt-1"><Sparkles size={24}/></div>
            <div>
              <h3 className="font-bold text-[#0F172A] text-xl">Start understanding your reports today</h3>
              <p className="text-[#64748B] text-sm mt-1">Join thousands of users who are already making sense of their health reports with CuraMind AI.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            {/* Primary CTA */}
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex-1 group"
            >
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] opacity-45 blur-md group-hover:opacity-85 transition-opacity duration-500 animate-pulse pointer-events-none" />
              <Link 
                href="/login" 
                className="relative overflow-hidden w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer z-10"
              >
                <motion.div 
                  className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg] pointer-events-none"
                  animate={{ left: ['-100%', '220%'] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", repeatDelay: 1.2 }}
                />
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.button 
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => setIsVideoOpen(true)}
              className="flex-1 px-6 py-3.5 rounded-full bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold text-sm hover:border-blue-400/80 hover:bg-blue-50/40 transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/10 flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping group-hover:bg-blue-500/50 pointer-events-none" />
                <div className="relative bg-[#0F172A] text-white rounded-full p-1 group-hover:bg-[#3B82F6] transition-colors duration-300 shadow-xs flex items-center justify-center">
                  <Play size={11} fill="currentColor" className="ml-0.5 transition-transform duration-300 group-hover:scale-115" />
                </div>
              </div>
              <span>Watch Demo</span>
            </motion.button>
          </div>
        </div>

      </div>

      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoSrc="/demovideo.mp4" 
      />
    </div>
  );
}
