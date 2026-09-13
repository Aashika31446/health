'use client';

import React, { useState } from 'react';
import { ArrowRight, Lightbulb, Users, Rocket, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutJourney() {
  const [activeHover, setActiveHover] = useState<number | null>(null);

  const milestones = [
    {
      year: "2025",
      status: "The Beginning",
      desc: "An idea to simplify medical reports using AI.",
      icon: Lightbulb,
      tag: "Ideation",
      color: "from-fuchsia-500 to-pink-500",
      bgLight: "bg-fuchsia-50",
      textColor: "text-fuchsia-600",
      glowColor: "rgba(217, 70, 239, 0.3)",
    },
    {
      year: "2026",
      status: "Building & Growing",
      desc: "Launched our platform and reached our first users.",
      icon: Users,
      tag: "Live Now",
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      glowColor: "rgba(59, 130, 246, 0.35)",
      isCurrent: true,
    },
    {
      year: "Beyond",
      status: "A Healthier Tomorrow",
      desc: "Continuing to innovate for a more informed and healthier world.",
      icon: Rocket,
      tag: "Vision",
      color: "from-sky-500 to-blue-600",
      bgLight: "bg-sky-50",
      textColor: "text-sky-600",
      glowColor: "rgba(14, 165, 233, 0.3)",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 lg:max-w-sm"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-6">
            <Sparkles size={12} className="text-blue-600" />
            Our Journey
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0F172A] leading-[1.15] tracking-tight mb-6">
            From an Idea to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">Real Impact</span>
          </h2>
          
          <p className="text-[#475569] text-base leading-relaxed mb-8">
            A journey driven by the belief that technology can make healthcare simpler, clearer, and more human.
          </p>

          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-6 py-3 rounded-full border border-gray-200 text-blue-600 font-semibold text-sm hover:bg-blue-50/80 hover:border-blue-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            Explore Innovations 
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Right Column (Timeline) */}
        <div className="flex-1 w-full relative pt-4">
          
          {/* Animated Connecting Track */}
          <div className="hidden md:block absolute top-[68px] left-12 right-12 h-[3px] bg-slate-200/80 rounded-full z-0 overflow-hidden">
            {/* Animated Gradient Progress Fill */}
            <motion.div 
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-to-r from-fuchsia-500 via-blue-500 to-sky-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </div>

          {/* Dotted Background Line */}
          <div className="hidden md:block absolute top-[68px] left-12 right-12 h-px border-t border-dashed border-slate-300 -z-10" />

          {/* Timeline Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {milestones.map((item, index) => {
              const Icon = item.icon;
              const isHovered = activeHover === index;

              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setActiveHover(index)}
                  onMouseLeave={() => setActiveHover(null)}
                  whileHover={{ y: -6 }}
                  className={`relative flex flex-col items-start md:items-center text-left md:text-center p-5 rounded-3xl transition-all duration-300 cursor-pointer ${
                    isHovered 
                      ? 'bg-white shadow-xl shadow-blue-500/8 border border-blue-100 ring-1 ring-blue-200/40' 
                      : 'bg-transparent border border-transparent hover:border-slate-100'
                  }`}
                >
                  {/* Floating Tag */}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-3 uppercase tracking-wider transition-all duration-300 ${
                    item.isCurrent
                      ? 'bg-blue-100 text-blue-600 shadow-xs ring-1 ring-blue-200'
                      : isHovered
                      ? 'bg-slate-100 text-slate-800'
                      : 'bg-slate-50 text-slate-400 border border-slate-200/50'
                  }`}>
                    {item.tag}
                  </span>

                  {/* Icon Node */}
                  <div className="relative mb-5">
                    {/* Pulsing ring for current phase (2026) */}
                    {item.isCurrent && (
                      <span className="absolute -inset-1.5 rounded-full bg-blue-500/20 animate-ping pointer-events-none" />
                    )}

                    {/* Ambient Glow */}
                    <div 
                      className="absolute inset-0 rounded-full blur-md transition-opacity duration-300"
                      style={{ backgroundColor: item.glowColor, opacity: isHovered ? 0.65 : item.isCurrent ? 0.4 : 0 }}
                    />

                    {/* Node Circle */}
                    <motion.div
                      animate={{ 
                        scale: isHovered ? 1.12 : 1,
                        rotate: isHovered ? [0, -5, 5, 0] : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-14 h-14 rounded-2xl ${item.bgLight} ${item.textColor} border-[3px] border-white flex items-center justify-center shadow-md relative z-10 transition-colors`}
                    >
                      <Icon size={22} className="transition-transform duration-300" />
                    </motion.div>
                  </div>

                  {/* Year */}
                  <h4 className={`font-black text-xl mb-1 tracking-tight transition-colors duration-200 ${
                    isHovered || item.isCurrent ? 'text-blue-600' : 'text-[#0F172A]'
                  }`}>
                    {item.year}
                  </h4>

                  {/* Status Title */}
                  <h5 className="font-bold text-[#334155] text-[13px] mb-2 leading-snug">
                    {item.status}
                  </h5>

                  {/* Description */}
                  <p className="text-[#64748B] text-xs leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Step Connector Arrow for Mobile */}
                  {index < milestones.length - 1 && (
                    <div className="md:hidden w-0.5 h-6 bg-slate-200 my-2 self-center" />
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
