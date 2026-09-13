"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Mail, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
  mission: string;
  linkedin: string;
  email: string;
}

export default function AboutTeam() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Rakshit Katiyar',
      role: 'Founder & CEO',
      image: '/rakshitpic.png',
      bio: "Passionate about AI, data, and building solutions that make a real impact in people's lives.",
      expertise: ['AI & Deep Learning', 'System Architecture', 'HealthTech Innovation'],
      mission: "Passionate about AI, data architectures, and scalable intelligent systems. Leading CuraMind AI with a mission to eliminate healthcare barriers and make high-quality medical guidance accessible to every curious mind worldwide.",
      linkedin: 'https://www.linkedin.com/in/rakshit-katiyar-7738432a9/',
      email: 'rakshitkatiyar9@gmail.com'
    },
    {
      id: 2,
      name: 'Aashika kumari',
      role: 'Co-Founder & Product',
      image: '/aashikapic.jpeg',
      bio: 'Focused on creating user-centric experiences that make healthcare simple and accessible.',
      expertise: ['Product Strategy', 'UX & Patient Experience', 'Design Systems'],
      mission: "Passionate about intuitive design, empathetic patient interfaces, and accessible digital health solutions. Leading product vision at CuraMind AI to ensure complex clinical data is transformed into friendly, empowering guidance for patients and families.",
      linkedin: 'https://www.linkedin.com/in/aashika-kumari-999b222a9/',
      email: 'aashikasharma919@gmail.com'
    }
  ];

  // Close on Escape key press and prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMember(null);
      }
    };

    if (selectedMember) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-600 text-[10px] font-bold tracking-widest uppercase mb-4">
            The People Behind CuraMind AI
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] leading-tight tracking-tight shrink-0">
              Meet the Team
            </h2>
            <p className="text-[#475569] text-sm leading-relaxed border-l-0 md:border-l-2 border-gray-200 pl-0 md:pl-6 max-w-lg">
              We are a group of passionate builders, designers, and healthcare 
              enthusiasts working together to make health information accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:max-w-4xl relative">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="bg-white rounded-[24px] border border-gray-100 p-8 flex flex-col sm:flex-row gap-6 items-start transition-all duration-300 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 cursor-pointer group relative"
          >
            <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-sm shrink-0 overflow-hidden relative transition-all duration-300 group-hover:scale-105">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            <div className="flex flex-col text-left">
              <h3 className="font-bold text-[#0F172A] text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {member.name}
              </h3>
              <span className="text-blue-600 text-xs font-semibold mb-3">
                {member.role}
              </span>
              <p className="text-[#64748B] text-xs leading-relaxed mb-4">
                {member.bio}
              </p>

              <div className="flex gap-4 text-gray-400 relative z-10" onClick={(e) => e.stopPropagation()}>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0A66C2] transition-colors"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.89 0-1.61.72-1.61 1.61 0 .89.72 1.61 1.61 1.61.89 0 1.61-.72 1.61-1.61 0-.89-.72-1.61-1.61-1.61z" />
                  </svg>
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="hover:text-[#EA4335] transition-colors"
                  title="Email"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Spotlight Popup Modal via Portal to document.body */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedMember && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
              
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedMember(null)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
              />

              {/* Spotlight Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 320 }}
                className="relative z-10 w-full max-w-[490px] max-h-[90vh] overflow-y-auto bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-slate-100 text-left"
              >
                {/* Top Header Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    Core Leadership Spotlight
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                    title="Close (Esc)"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Profile Main Section */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-100 shadow-md shrink-0 border border-slate-100">
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-extrabold text-[#0F172A] text-2xl leading-tight mb-1">
                      {selectedMember.name}
                    </h3>
                    <span className="inline-block self-start px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-xs font-semibold mb-2">
                      {selectedMember.role}
                    </span>
                    <p className="text-[#64748B] text-xs leading-relaxed">
                      {selectedMember.bio}
                    </p>
                  </div>
                </div>

                {/* Expertise Row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    EXPERTISE:
                  </span>
                  {selectedMember.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full bg-slate-100/80 text-slate-700 text-xs font-medium border border-slate-200/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Mission & Vision Box */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 mb-5">
                  <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs uppercase tracking-wider mb-2">
                    <Zap size={14} className="fill-purple-600 text-purple-600" />
                    MISSION & VISION
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {selectedMember.mission}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.89 0-1.61.72-1.61 1.61 0 .89.72 1.61 1.61 1.61.89 0 1.61-.72 1.61-1.61 0-.89-.72-1.61-1.61-1.61z" />
                    </svg>
                    LinkedIn Profile
                  </a>
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <Mail size={16} />
                    Send Email
                  </a>
                </div>

                {/* Dismiss Hint */}
                <p className="text-[11px] text-slate-400 text-center mt-3">
                  ← Click anywhere outside or press Esc to zoom out
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
