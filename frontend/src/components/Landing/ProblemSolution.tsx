'use client';

import React from 'react';
import { FileText, FlaskConical, Pill, UploadCloud, Bot, MessageSquare } from 'lucide-react';
import InteractiveTiltCard from '@/components/ui/InteractiveTiltCard';

export default function ProblemSolution() {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row gap-8 items-stretch">
      
      {/* Left Area - The Problem */}
      <div className="flex-[3] flex flex-col justify-between pr-4">
        <div className="mb-8">
          <div className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 font-bold text-[10px] tracking-widest uppercase rounded-full mb-6">
            The Problem
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4 leading-tight">
            Medical reports are <br/> difficult to understand.
          </h2>
          <p className="text-[#475569] text-base leading-relaxed max-w-md">
            Complex medical terms, confusing lab values, and long prescriptions can be overwhelming. You're not alone — and there's a better way.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InteractiveTiltCard 
            variant="float"
            borderGlowColor="rgba(59, 130, 246, 0.45)"
            glowColor="rgba(59, 130, 246, 0.08)"
            className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col h-full"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center mb-4 transition-transform duration-200">
              <FileText size={20} />
            </div>
            <h3 className="font-semibold text-[#0F172A] text-sm mb-2">Complex Medical Terms</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">Hard to understand technical language and abbreviations.</p>
          </InteractiveTiltCard>
          
          <InteractiveTiltCard 
            variant="spotlight"
            borderGlowColor="rgba(14, 165, 233, 0.45)"
            glowColor="rgba(14, 165, 233, 0.08)"
            className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col h-full"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center mb-4 transition-transform duration-200">
              <FlaskConical size={20} />
            </div>
            <h3 className="font-semibold text-[#0F172A] text-sm mb-2">Confusing Lab Values</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">Not sure what your numbers really mean?</p>
          </InteractiveTiltCard>

          <InteractiveTiltCard 
            variant="magnetic"
            borderGlowColor="rgba(139, 92, 246, 0.45)"
            glowColor="rgba(139, 92, 246, 0.08)"
            className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col h-full"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center mb-4 transition-transform duration-200">
              <Pill size={20} />
            </div>
            <h3 className="font-semibold text-[#0F172A] text-sm mb-2">No Instant Explanation</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">Waiting for doctor's appointments can be stressful.</p>
          </InteractiveTiltCard>
        </div>
      </div>

      {/* Right Area - The Solution */}
      <InteractiveTiltCard
        variant="shimmer"
        containerClassName="flex-[2]"
        borderGlowColor="rgba(2, 132, 199, 0.5)"
        glowColor="rgba(56, 189, 248, 0.1)"
        className="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] border border-blue-100 p-10 rounded-[32px] flex flex-col justify-between relative overflow-hidden"
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/40 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 mb-10">
          <div className="inline-flex px-3 py-1 bg-white/60 backdrop-blur-sm text-blue-600 font-bold text-[10px] tracking-widest uppercase rounded-full mb-6 border border-blue-100">
            The Solution
          </div>
          <h2 className="text-3xl font-extrabold text-[#0F172A] mb-4 leading-tight">
            CuraMind simplifies <br/> healthcare.
          </h2>
          <p className="text-[#475569] text-sm leading-relaxed max-w-sm">
            Get clear, accurate, and easy-to-understand insights from your medical reports — powered by advanced AI.
          </p>
        </div>

        {/* 3 Solution Items (Horizontal on wide, vertical on mobile) */}
        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
          <div className="flex-1 flex flex-col sm:items-center sm:text-center text-left">
            <div className="w-10 h-10 rounded-full bg-white text-[#3B82F6] shadow-sm flex items-center justify-center mb-3">
              <UploadCloud size={18} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-[13px] mb-1">Upload Reports</h3>
            <p className="text-[11px] text-[#64748B]">PDF, Image, Lab Reports</p>
          </div>

          <div className="flex-1 flex flex-col sm:items-center sm:text-center text-left">
            <div className="w-10 h-10 rounded-full bg-white text-[#8B5CF6] shadow-sm flex items-center justify-center mb-3">
              <Bot size={18} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-[13px] mb-1">AI Explanation</h3>
            <p className="text-[11px] text-[#64748B]">Simple language explanations</p>
          </div>

          <div className="flex-1 flex flex-col sm:items-center sm:text-center text-left">
            <div className="w-10 h-10 rounded-full bg-white text-pink-500 shadow-sm flex items-center justify-center mb-3">
              <MessageSquare size={18} />
            </div>
            <h3 className="font-bold text-[#0F172A] text-[13px] mb-1">Chat With Reports</h3>
            <p className="text-[11px] text-[#64748B]">Ask questions & get instant answers</p>
          </div>
        </div>
      </InteractiveTiltCard>

    </div>
  );
}
