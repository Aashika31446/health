'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Brain, Globe, Play, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import VideoModal from './VideoModal';

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <div className="w-full relative max-w-7xl mx-auto px-8 pt-12 pb-24 flex flex-col lg:flex-row items-center gap-12 z-10">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-200/40 via-purple-100/30 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Left Column - Content */}
      <div className="flex-1 flex flex-col items-start pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-medium text-xs mb-6 border border-blue-100 shadow-sm">
          <Sparkles size={14} className="text-blue-500" />
          AI-Powered Healthcare Assistant
        </div>

        <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-[1.15] mb-6 tracking-tight">
          Your AI Healthcare <br/>
          Companion for <br/>
          Understanding <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">
            Medical Reports
          </span>
        </h1>

        <p className="text-lg text-[#475569] mb-8 max-w-lg leading-relaxed">
          Upload your reports, get simple explanations, track your health insights, and chat with AI — all in one secure platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          {/* Primary CTA: Try CuraMind Free */}
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative w-full sm:w-auto group"
          >
            {/* Ambient Breathing Glow (Option 1) */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] opacity-45 blur-lg group-hover:opacity-85 transition-opacity duration-500 animate-pulse pointer-events-none" />

            <Link 
              href="/login" 
              className="relative overflow-hidden w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 cursor-pointer z-10"
            >
              {/* Periodic Diagonal Shimmer Light Sweep (Option 1) */}
              <motion.div 
                className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg] pointer-events-none"
                animate={{ left: ['-100%', '220%'] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", repeatDelay: 1.2 }}
              />

              <span className="relative z-10">Try CuraMind Free</span>
              <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>

          {/* Secondary CTA: Watch Demo */}
          <motion.button 
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => setIsVideoOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold hover:border-blue-400/80 hover:bg-blue-50/40 transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/10 flex items-center justify-center gap-3 group cursor-pointer"
          >
            {/* Play Icon with Sonar Radar Pulse (Option 1) & Micro-Scale Bounce (Option 2) */}
            <div className="relative flex items-center justify-center">
              <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping group-hover:bg-blue-500/50 pointer-events-none" />
              <div className="relative bg-[#0F172A] text-white rounded-full p-1.5 group-hover:bg-[#3B82F6] transition-colors duration-300 shadow-xs flex items-center justify-center">
                <Play size={12} fill="currentColor" className="ml-0.5 transition-transform duration-300 group-hover:scale-115" />
              </div>
            </div>
            <span>Watch Demo</span>
          </motion.button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-[#3B82F6] mt-1 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm text-[#0F172A]">Secure & Private</p>
              <p className="text-xs text-[#64748B] mt-0.5">Your data, your control</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Brain className="text-[#3B82F6] mt-1 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm text-[#0F172A]">AI-Powered Insights</p>
              <p className="text-xs text-[#64748B] mt-0.5">Understand in simple words</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="text-[#3B82F6] mt-1 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-sm text-[#0F172A]">Multi-language Support</p>
              <p className="text-xs text-[#64748B] mt-0.5">Healthcare for everyone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Graphics */}
      <div className="flex-1 relative w-full h-[600px] hidden lg:block">
        <div className="absolute inset-0 w-full h-full pt-8">
          <Image 
            src="/landingdashboard.png" 
            alt="CuraMind AI Healthcare Dashboard and Chat Interface" 
            fill 
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain scale-110 lg:translate-x-12" 
            priority
          />
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={() => setIsVideoOpen(false)} 
        videoSrc="/demovideo.mp4" 
      />
    </div>
  );
}
