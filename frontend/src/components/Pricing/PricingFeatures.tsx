import React from 'react';
import { ShieldCheck, HeadphonesIcon, CalendarDays, CheckCircle2 } from 'lucide-react';

export default function PricingFeatures() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-20 relative z-10">
      <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-gray-100 flex flex-col md:flex-row flex-wrap justify-between gap-8 md:gap-4 shadow-sm">
        
        {/* Feature 1 */}
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#0F172A] text-[15px]">Secure & Private</h4>
            <p className="text-[#64748B] text-xs mt-0.5">Your data is always protected</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <HeadphonesIcon size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#0F172A] text-[15px]">24/7 Support</h4>
            <p className="text-[#64748B] text-xs mt-0.5">We're here to help</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <CalendarDays size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#0F172A] text-[15px]">Cancel Anytime</h4>
            <p className="text-[#64748B] text-xs mt-0.5">No long-term commitments</p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-center gap-4 flex-1 min-w-[200px]">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#0F172A] text-[15px]">Trusted by Thousands</h4>
            <p className="text-[#64748B] text-xs mt-0.5">Join a growing community</p>
          </div>
        </div>

      </div>
    </div>
  );
}
