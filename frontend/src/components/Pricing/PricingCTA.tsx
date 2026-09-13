'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingCTA() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-20 relative z-10">
      <div className="bg-gradient-to-br from-[#F8FAFC] to-blue-50/80 rounded-[40px] border border-blue-100/50 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
        
        {/* Background wave abstraction */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl z-0"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl z-0"></div>

        {/* Left Content */}
        <div className="flex-1 relative z-10 max-w-2xl">
          <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-blue-100/80 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            Ready to get started?
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] leading-tight tracking-tight mb-4">
            Take Control of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Your Health Today</span>
          </h2>
          
          <p className="text-[#475569] text-sm md:text-base leading-relaxed">
            Join thousands of users who trust CuraMind AI for clearer, smarter, and more meaningful health insights.
          </p>
        </div>

        {/* Right Content */}
        <div className="flex flex-col items-center md:items-end relative z-10">
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative mb-3 w-full md:w-auto group"
          >
            {/* Ambient Breathing Glow */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] opacity-45 blur-lg group-hover:opacity-85 transition-opacity duration-500 animate-pulse pointer-events-none" />

            <Link href="/login" className="block w-full md:w-auto">
              <button className="relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer z-10">
                {/* Diagonal Shimmer Light Sweep */}
                <motion.div 
                  className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg] pointer-events-none"
                  animate={{ left: ['-100%', '220%'] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", repeatDelay: 1.2 }}
                />

                <span className="relative z-10">Get Started Free</span>
                <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </Link>
          </motion.div>
          <span className="text-[#64748B] text-[11px] font-medium">
            No credit card required
          </span>

          {/* Floating Cursive */}
          <div className="absolute -bottom-16 right-0 md:-right-12 rotate-[-10deg] font-medium text-blue-300 text-lg tracking-tight whitespace-nowrap hidden sm:block" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
            Your Health <br/>
            Our Priority
          </div>
        </div>

      </div>
    </div>
  );
}
