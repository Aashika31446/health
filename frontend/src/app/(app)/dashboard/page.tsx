'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HealthTrends } from "@/components/Dashboard/HealthTrends"
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Activity, User as UserIcon, Droplets, Calendar, Share2, Copy, Check, X, ArrowRight, HeartPulse, Sparkles } from "lucide-react"

const ClinicMap = dynamic(() => import('@/components/Map/ClinicMap').then(mod => mod.ClinicMap), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-white rounded-3xl flex items-center justify-center border border-slate-200/80 shadow-sm">
      <div className="w-8 h-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
})

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('User')
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  
  const handleShare = async () => {
      setIsSharing(true)
      const supabase = createClient()
      const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
      const user = data?.user
      if (!user) {
          setIsSharing(false)
          return
      }
      
      try {
          const token = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Math.random().toString(36).substring(2) + Date.now().toString(36))
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const { data: { session } } = await supabase.auth.getSession();
          
          // Upsert into users table first to satisfy foreign key
          try {
            await supabase.from('users').upsert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || 'User'
            }, { onConflict: 'id' })
          } catch (ue) {
            console.warn("User upsert notice:", ue)
          }

          // Fetch prescriptions and metrics snapshot if available
          let prescData = []
          try {
            const pRes = await fetch(`${baseUrl}/api/chat/prescriptions?user_id=${user.id}`)
            if (pRes.ok) {
              const pData = await pRes.json()
              if (pData.data) prescData = pData.data
            }
          } catch {}
          if (!prescData.length) {
            try {
              const { data } = await supabase.from('prescriptions').select('*').eq('user_id', user.id)
              if (data) prescData = data
            } catch {}
          }

          let metData = []
          if (profile?.id) {
            try {
              const { data } = await supabase.from('metrics').select('*').eq('profile_id', profile.id)
              if (data) metData = data
            } catch {}
          }

          // 1. Send to backend with snapshot so link is immediately viewable
          try {
            const res = await fetch(`${baseUrl}/api/chat/doctor-links`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
                },
                body: JSON.stringify({ 
                  user_id: user.id, 
                  expires_in_days: 7,
                  token: token,
                  profile: profile,
                  metrics: metData,
                  prescriptions: prescData
                })
            })
            if (res.ok) {
                const data = await res.json()
                if (data.token) {
                    const url = `${window.location.origin}/shared/${data.token}`
                    setShareLink(url)
                    setCopied(false)
                    setIsSharing(false)
                    return
                }
            }
          } catch (apiErr) {
            console.warn("Backend doctor-links notice:", apiErr)
          }

          // 2. Direct Supabase write
          try {
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            await supabase.from('doctor_links').insert({
                user_id: user.id,
                secure_token: token,
                expires_at: expiresAt
            })
          } catch (dbErr) {
            console.warn("Direct doctor_links write notice:", dbErr)
          }

          // Show link
          const url = `${window.location.origin}/shared/${token}`
          setShareLink(url)
          setCopied(false)
      } catch (e) {
          console.error("Error generating share link:", e)
      } finally {
          setIsSharing(false)
      }
  }

  const copyToClipboard = () => {
      if (!shareLink) return
      navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
  }
  
  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
      const user = data?.user
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User')
        
        // 0. Check localStorage cached profile first for instant UI response
        let loadedProfile = null
        try {
          const cached = localStorage.getItem(`curamind_profile_${user.id}`)
          if (cached) {
            loadedProfile = JSON.parse(cached)
            setProfile(loadedProfile)
          }
        } catch {}

        try {
          // 1. Fetch directly from Supabase (authenticated user session satisfies RLS)
          const { data: profData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()

          if (profData) {
            setProfile((prev: any) => ({ ...prev, ...profData }))
          } else {
            // Fallback to backend API
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${baseUrl}/api/chat/profile?user_id=${user.id}`);
            if (res.ok) {
              const result = await res.json();
              if (result.data) {
                setProfile((prev: any) => ({ ...prev, ...result.data }));
              }
            }
          }
        } catch (e) {
          console.error("Failed to load profile", e);
        }
      }
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-0 md:pr-2 custom-scrollbar">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Welcome, {userName} <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your health journey matters. Let&apos;s make it simpler, together.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare} 
              disabled={isSharing}
              className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 text-[#0284C7] px-5 py-2.5 rounded-full transition-all font-semibold text-sm border border-sky-100 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {isSharing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Link...</span>
                </>
              ) : (
                <>
                  <Share2 size={16} />
                  <span>Share with Doctor</span>
                </>
              )}
            </button>
            <div className="p-2.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100">
              <HeartPulse size={20} />
            </div>
          </div>
        </header>

        {/* Hero Health Banner */}
        <div className="w-full bg-gradient-to-r from-[#E0F2FE] via-[#F0F9FF] to-white rounded-[32px] p-6 sm:p-10 border border-sky-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[#0284C7] text-xs font-bold tracking-widest uppercase mb-3 border border-sky-200/60">
              <Sparkles size={12} /> Your Health, Our Priority
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight tracking-tight mb-3">
              A Healthier You <br />
              <span className="text-[#0284C7]">Starts</span> <span className="text-purple-600">Here</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
              Manage your health, get insights, and stay informed with the power of AI.
            </p>
            <Link 
              href="/settings"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              Go to Settings <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative z-10 flex flex-col items-center md:items-end gap-3">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-sky-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
                <Activity size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-xs text-[#0F172A]">Better Health</p>
                <p className="text-[11px] text-slate-400">Brighter Tomorrows</p>
              </div>
            </div>

            <div className="text-right font-medium text-sky-400 text-lg tracking-tight rotate-[-4deg] hidden sm:block" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
              Take Care, <br />
              Stay Healthy 💙
            </div>
          </div>
        </div>
        
        {/* Share Link Modal */}
        {shareLink && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                            <Share2 className="text-[#0284C7]" size={20} /> 
                            Doctor Sharing Link
                        </h2>
                        <button onClick={() => setShareLink('')} className="text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            Share this secure, read-only link with your doctor. It grants access to your health metrics and prescriptions, and automatically expires in 7 days.
                        </p>
                        
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
                            <input 
                                type="text" 
                                readOnly 
                                value={shareLink}
                                className="bg-transparent border-none outline-none text-[#0F172A] w-full px-3 text-xs font-mono"
                            />
                            <button 
                                onClick={copyToClipboard}
                                className={`py-2 px-4 rounded-xl transition-all font-semibold text-xs flex items-center gap-1.5 cursor-pointer ${copied ? 'bg-emerald-600 text-white' : 'bg-[#0284C7] text-white hover:bg-[#0369A1]'}`}
                            >
                                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Dynamic Profile Metrics */}
        {loading ? (
          <div className="bg-white p-6 rounded-3xl flex justify-center items-center h-32 border border-slate-200/80 shadow-sm">
             <div className="w-8 h-8 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : profile && (profile.age || profile.blood_group || profile.gender) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profile.age && (
              <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-3 border border-sky-100">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Age</h3>
                <p className="text-3xl font-extrabold text-[#0F172A] mt-1">{profile.age} <span className="text-sm font-medium text-slate-400">years</span></p>
              </div>
            )}

            {profile.blood_group && (
              <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3 border border-rose-100">
                  <Droplets size={24} />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Blood Group</h3>
                <p className="text-3xl font-extrabold text-[#0F172A] mt-1">{profile.blood_group}</p>
              </div>
            )}

            {profile.gender && (
              <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-3 border border-indigo-100">
                   <UserIcon size={24} />
                 </div>
                 <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender</h3>
                 <p className="text-3xl font-extrabold text-[#0F172A] mt-1 capitalize">{profile.gender}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border-dashed border-2 border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3 border border-slate-100">
              <UserIcon size={24} />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">Complete Your Profile</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Add your age, blood group, and medical history in Settings to see your personalized health metrics here.
            </p>
          </div>
        )}

        {/* Health Trends */}
        {profile?.id && (
          <div className="mt-6">
            <HealthTrends profileId={profile.id} />
          </div>
        )}

        {/* Nearby Clinics Map Area */}
        <div className="mt-6 pb-10">
           <ClinicMap />
        </div>

        {/* Share Link Modal Dialog */}
        {shareLink && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
                    <Share2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Share with Doctor</h3>
                    <p className="text-xs text-slate-400">Secure Read-Only Access</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShareLink('')} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Share this secure link with your healthcare provider. It grants temporary read-only access to your health vitals, lab reports, and prescriptions. Valid for 7 days.
                </p>
                
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
                  <input 
                    type="text" 
                    readOnly 
                    value={shareLink}
                    className="bg-transparent border-none outline-none text-slate-700 w-full px-2 text-xs font-mono select-all"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${copied ? 'bg-emerald-500 text-white shadow-sm' : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm'}`}
                  >
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" /> Auto-expires in 7 days
                  </span>
                  <a 
                    href={shareLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[#0284C7] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Preview Portal <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
  )
}
