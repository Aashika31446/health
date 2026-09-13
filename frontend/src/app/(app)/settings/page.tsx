'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Bell, Shield, Key, Clock, Calendar, Droplets, Check } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  
  // Profile fields
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  
  const [pushStatus, setPushStatus] = useState('Checking...')
  const [isTogglingPush, setIsTogglingPush] = useState(false)
  
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          reg.pushManager.getSubscription().then(sub => {
            if (sub) {
              setPushStatus('Enabled')
            } else {
              setPushStatus('Not Enabled')
            }
          })
        } else {
          setPushStatus('Not Enabled')
        }
      })
    } else {
      setPushStatus('Not Supported')
    }
  }, [])

  const handleToggleNotifications = async () => {
    if (pushStatus === 'Not Supported') {
      alert("Push notifications are not supported in this browser.")
      return
    }

    setIsTogglingPush(true)

    // CASE 1: Turn OFF
    if (pushStatus === 'Enabled') {
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration()
          if (reg) {
            const sub = await reg.pushManager.getSubscription()
            if (sub) {
              await sub.unsubscribe()
            }
          }
        }

        if (userId) {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
          await fetch(`${baseUrl}/api/notifications/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
          }).catch(() => {})
        }

        setPushStatus('Not Enabled')
        try {
          localStorage.setItem('curamind_push_enabled', 'false')
        } catch (_) {}
      } catch (err: any) {
        console.error("Error disabling push:", err)
        alert("Failed to turn off notifications: " + err.message)
      } finally {
        setIsTogglingPush(false)
      }
      return
    }

    // CASE 2: Turn ON
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        alert("Notification permission was blocked in your browser. Please allow notifications in site settings.")
        setIsTogglingPush(false)
        return
      }

      await navigator.serviceWorker.register('/sw.js')
      const registration = await navigator.serviceWorker.ready

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        alert("VAPID key missing from environment")
        setIsTogglingPush(false)
        return
      }

      const padding = '='.repeat((4 - vapidPublicKey.length % 4) % 4)
      const base64 = (vapidPublicKey + padding).replace(/\-/g, '+').replace(/_/g, '/')
      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray
      })

      if (userId) {
        const subJSON = subscription.toJSON()
        const { data: { session } } = await supabase.auth.getSession()
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        await fetch(`${baseUrl}/api/notifications/subscribe`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            user_id: userId,
            endpoint: subJSON.endpoint,
            p256dh: subJSON.keys?.p256dh,
            auth: subJSON.keys?.auth
          })
        })
      }

      setPushStatus('Enabled')
      try {
        localStorage.setItem('curamind_push_enabled', 'true')
      } catch (_) {}
    } catch (e: any) {
      console.error(e)
      alert("Failed to enable notifications: " + e.message)
    } finally {
      setIsTogglingPush(false)
    }
  }

  const [isSaving, setIsSaving] = useState(false)
  const supabase = React.useMemo(() => createClient(), [])

  useEffect(() => {
    let isMounted = true

    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser().catch((err) => {
          console.warn("Notice checking user auth status:", err?.message || err)
          return { data: { user: null } }
        })

        const user = data?.user
        if (!isMounted) return

        if (user) {
          setEmail(user.email || '')
          setName(user.user_metadata?.full_name || '')
          setUserId(user.id)
          
          // 0. Check localStorage cached profile for instant prefill
          try {
            const cached = localStorage.getItem(`curamind_profile_${user.id}`)
            if (cached) {
              const parsed = JSON.parse(cached)
              if (parsed.age) setAge(parsed.age.toString())
              if (parsed.gender) setGender(parsed.gender)
              if (parsed.blood_group) setBloodGroup(parsed.blood_group)
            }
          } catch {}

          // 1. Fetch profile from Supabase
          try {
            const { data: profData } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
            if (isMounted && profData) {
              if (profData.age) setAge(profData.age.toString())
              if (profData.gender) setGender(profData.gender)
              if (profData.blood_group) setBloodGroup(profData.blood_group)
            }
          } catch (err) {
            console.warn("Notice reading profile from Supabase:", err)
          }
        }
      } catch (err) {
        console.warn("Notice in SettingsPage fetchUser:", err)
      }
    }
    fetchUser()

    return () => {
      isMounted = false
    }
  }, [supabase])

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true)
    
    try {
      const profileData = {
        age: age ? parseInt(age) : null,
        gender: gender || null,
        blood_group: bloodGroup || null
      }

      // 0. Save immediately to localStorage so data is never lost
      try {
        localStorage.setItem(`curamind_profile_${userId}`, JSON.stringify(profileData))
      } catch {}

      // 1. Upsert public.users first to satisfy foreign key constraints
      try {
        await supabase.from('users').upsert({
          id: userId,
          email: email || '',
          full_name: name || 'User'
        }, { onConflict: 'id' })
      } catch (userErr) {
        console.warn("Notice: public.users upsert:", userErr)
      }

      // 2. Direct Supabase write
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle()

        if (existingProfile) {
          await supabase
            .from('profiles')
            .update(profileData)
            .eq('user_id', userId)
        } else {
          await supabase
            .from('profiles')
            .insert([{
              user_id: userId,
              name: name || 'Primary Profile',
              ...profileData
            }])
        }
      } catch (dbErr) {
        console.warn("Supabase direct write notice:", dbErr)
      }

      // 3. Also notify backend with Bearer token for sync
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        await fetch(`${baseUrl}/api/chat/profile`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            user_id: userId,
            ...profileData
          })
        });
      } catch (syncErr) {
        console.warn("Backend sync notice:", syncErr)
      }
      
      router.push('/dashboard')
      router.refresh()
      return;
    } catch (e: any) {
      console.error("Detailed handleSave error:", e)
      router.push('/dashboard')
      router.refresh()
    }
  }

  const [activeTab, setActiveTab] = useState('Profile Details')

  const tabs = [
    { id: 'Profile Details', icon: User },
    { id: 'Notifications', icon: Bell },
    { id: 'Privacy & Security', icon: Shield },
    { id: 'Billing (Premium)', icon: Key }
  ]

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full rounded-3xl bg-white border border-slate-200/80 shadow-sm">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <header className="pb-4 border-b border-slate-100">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile, health vitals, and application preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
          
          {/* Navigation / Tabs */}
          <div className="col-span-1 space-y-1.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 font-semibold text-sm transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-sky-50 text-[#0284C7] border border-sky-200/70 shadow-xs' 
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <tab.icon size={18} className={isActive ? 'text-[#0284C7]' : 'text-slate-400'} /> 
                  <span>{tab.id}</span>
                </button>
              )
            })}
          </div>

          {/* Content Area */}
          <div className="col-span-1 lg:col-span-3 pb-12">
            <div className="bg-slate-50/40 rounded-3xl p-6 md:p-8 border border-slate-100 min-h-[460px]">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/60">
                <h3 className="text-lg md:text-xl font-bold text-[#0F172A]">{activeTab}</h3>
                <span className="text-[11px] font-bold text-sky-600 bg-sky-50 border border-sky-200/60 px-3 py-1 rounded-full">
                  Account Settings
                </span>
              </div>
              
              {activeTab === 'Profile Details' && (
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-2xl text-white font-extrabold shadow-md shadow-blue-500/20">
                      {name ? name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-[#0F172A]">{name || 'CuraMind User'}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{email || 'No email associated'}</p>
                    </div>
                  </div>

                  {/* Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                        <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-md">Synced with Account</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User size={18} />
                        </div>
                        <input 
                          type="text" 
                          value={name}
                          readOnly
                          className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none cursor-not-allowed select-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">Verified</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          value={email}
                          readOnly
                          className="w-full bg-slate-100/70 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-700 text-sm font-medium focus:outline-none cursor-not-allowed select-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Health Metrics Header */}
                  <div className="pt-2">
                    <h4 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span> Health Metrics
                    </h4>
                    <p className="text-xs text-slate-500">
                      Used by CuraMind AI to personalize health insights and medication guidance.
                    </p>
                  </div>

                  {/* Metrics Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Age</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Calendar size={18} />
                        </div>
                        <input 
                          type="number" 
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g. 23"
                          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-[#0F172A] text-sm font-medium focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/10 transition-all shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Gender</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User size={18} />
                        </div>
                        <select 
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-[#0F172A] text-sm font-medium focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/10 transition-all shadow-xs cursor-pointer"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Blood Group</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-500">
                          <Droplets size={18} />
                        </div>
                        <select 
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-[#0F172A] text-sm font-medium focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-sky-500/10 transition-all shadow-xs cursor-pointer"
                        >
                          <option value="">Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 mt-6 border-t border-slate-200/80 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Changes are securely synced to your private healthcare vault.
                    </p>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-8 py-3 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-95 text-white font-semibold text-sm rounded-full transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Notifications' && (
                <div className="space-y-6">
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                     <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] border border-sky-100 flex items-center justify-center shrink-0">
                       <Bell size={22} />
                     </div>
                     <div>
                       <h4 className="text-base font-bold text-[#0F172A]">Push Notifications</h4>
                       <p className="text-xs text-slate-500 mt-0.5">Receive daily prescription reminders and health check alerts on this device.</p>
                     </div>
                   </div>
                   
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
                       <div>
                           <h5 className="font-bold text-sm text-[#0F172A]">Browser Push Alerts</h5>
                           <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                             <span>Status:</span> 
                             <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1.5 ${
                               pushStatus === 'Enabled' 
                                 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' 
                                 : 'bg-slate-100 text-slate-500 border border-slate-200'
                             }`}>
                               <span className={`w-1.5 h-1.5 rounded-full ${pushStatus === 'Enabled' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                               {pushStatus === 'Enabled' ? 'Enabled' : 'Disabled'}
                             </span>
                           </p>
                       </div>

                       {/* Interactive ON / OFF Toggle Switch */}
                       <div className="flex items-center gap-3">
                         <span className="text-xs font-bold tracking-wider text-slate-500 min-w-[32px] text-right select-none">
                           {pushStatus === 'Enabled' ? 'ON' : 'OFF'}
                         </span>
                         <button
                           type="button"
                           role="switch"
                           aria-checked={pushStatus === 'Enabled'}
                           onClick={handleToggleNotifications}
                           disabled={isTogglingPush || pushStatus === 'Not Supported'}
                           className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                             pushStatus === 'Enabled' ? 'bg-emerald-500' : 'bg-slate-200'
                           }`}
                           title={pushStatus === 'Enabled' ? 'Click to Turn OFF' : 'Click to Turn ON'}
                         >
                           <span
                             aria-hidden="true"
                             className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                               pushStatus === 'Enabled' ? 'translate-x-6' : 'translate-x-0'
                             }`}
                           >
                             {isTogglingPush ? (
                               <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                             ) : pushStatus === 'Enabled' ? (
                               <Check size={12} className="text-emerald-600 stroke-[3]" />
                             ) : null}
                           </span>
                         </button>
                       </div>
                    </div>
                </div>
              )}

              {activeTab !== 'Profile Details' && activeTab !== 'Notifications' && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                   <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200/80 flex items-center justify-center mb-4 text-slate-400 shadow-xs">
                     <Clock size={26} />
                   </div>
                   <h4 className="text-base font-bold text-[#0F172A] mb-1">{activeTab}</h4>
                   <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                     This section is currently being enhanced with additional privacy controls and account options.
                   </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
