'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

export default function Navbar({ activeTab: defaultActive = 'home' }: { activeTab?: 'home' | 'features' | 'how-it-works' | 'pricing' | 'about' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(defaultActive);

  const navLinks = [
    { name: 'Home', href: '/', tab: 'home' },
    { name: 'Features', href: '/features', tab: 'features' },
    { name: 'How It Works', href: '/how-it-works', tab: 'how-it-works' },
    { name: 'Pricing', href: '/pricing', tab: 'pricing' },
    { name: 'About', href: '/about', tab: 'about' },
  ];

  // Track scroll position on the home page to highlight the corresponding tab
  useEffect(() => {
    if (pathname !== '/') {
      setActiveTab(defaultActive);
      return;
    }

    const sections = ['about', 'pricing', 'how-it-works', 'features'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;

      if (window.scrollY < 300) {
        setActiveTab('home');
        return;
      }

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveTab(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, defaultActive]);

  const handleLinkClick = (e: React.MouseEvent, tab: string, href: string) => {
    if (pathname === '/') {
      e.preventDefault();
      setActiveTab(tab);
      if (tab === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(tab);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          router.push(href);
        }
      }
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScrollCheck = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScrollCheck, { passive: true });
    handleScrollCheck();
    return () => window.removeEventListener('scroll', handleScrollCheck);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm py-3.5'
          : 'bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/50 py-4 sm:py-5'
      }`}
    >
      <nav className="w-full flex items-center justify-between px-6 sm:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <HeartPulse className="text-[#3B82F6]" size={28} />
          <span className="text-[#0F172A] font-bold text-xl tracking-tight">CuraMind AI</span>
        </Link>

        {/* Center Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#475569]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.tab;
            return (
              <Link
                key={link.tab}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.tab, link.href)}
                className={`relative py-1 transition-colors ${isActive ? 'text-[#0F172A] font-semibold' : 'hover:text-[#0F172A]'}`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="navbarActiveIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#3B82F6] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="px-5 py-2.5 rounded-full border border-[#CBD5E1] text-[#0F172A] font-medium text-sm hover:bg-[#F1F5F9] transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/login" 
            className="hidden sm:inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
          >
            Get Started Free &rarr;
          </Link>
        </div>
      </nav>
    </header>
  );
}
