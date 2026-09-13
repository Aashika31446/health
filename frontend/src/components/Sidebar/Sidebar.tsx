'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  Pill, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  HeartPulse,
  ArrowRight,
  Search,
  History,
  Clock
} from 'lucide-react'

interface ChatSession {
  id: string
  title: string
  created_at: string
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSessionId = searchParams.get('session')
  const supabase = createClient()
  
  const [userName, setUserName] = useState('Rakshit Katiyar')
  const [userId, setUserId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [showAllHistoryModal, setShowAllHistoryModal] = useState(false)
  const [historySearch, setHistorySearch] = useState('')
  
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
        const user = data?.user
        if (user) {
          setUserId(user.id)
          setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Rakshit Katiyar')
        } else {
          setUserId('default-user')
        }
      } catch (e) {
        setUserId('default-user')
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchSessions()
    }

    const handleSessionCreated = () => {
      if (userId) {
        fetchSessions()
      }
    }
    window.addEventListener('session-created', handleSessionCreated)
    return () => window.removeEventListener('session-created', handleSessionCreated)
  }, [userId, currentSessionId])

  const fetchSessions = async () => {
    setLoadingHistory(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/chat/sessions?user_id=${userId}`)
      if (res.ok) {
        const data = await res.json().catch(() => null)
        if (Array.isArray(data)) {
          setSessions(data)
        }
      } else {
        console.warn("Sessions fetch returned status:", res.status)
      }
    } catch (e) {
      console.error("Error fetching sessions:", e)
    }
    setLoadingHistory(false)
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/chat/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (currentSessionId === sessionId) {
          router.push('/chat');
        }
      } else {
        console.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Logout error:", e);
    }
    if (typeof window !== 'undefined') {
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.startsWith('curamind_') || key.startsWith('supabase')) {
            localStorage.removeItem(key);
          }
        });
        sessionStorage.clear();
      } catch (_) {}
      // Replace location to landing page ('/') so back button cannot re-enter protected dashboard
      window.location.replace('/');
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Prescriptions', path: '/prescriptions', icon: Pill },
  ]
  
  const handleNavClick = () => {
    if (isMobileOpen) setIsMobileOpen(false);
  }

  const parseUtcDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date();
    // Normalize date string with Z if no timezone is present
    const normalized = dateStr.endsWith('Z') || /[+-]\d{2}(:\d{2})?$/.test(dateStr) 
      ? dateStr 
      : `${dateStr}Z`;
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? new Date(dateStr) : d;
  }

  const formatRealTime = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const date = parseUtcDate(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

      // Calendar day checks
      const isToday = now.toDateString() === date.toDateString();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = yesterday.toDateString() === date.toDateString();

      if (isToday) {
        if (diffMins < 2) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago • ${timeStr}`;
        return `Today • ${timeStr}`;
      }
      if (isYesterday) {
        return `Yesterday • ${timeStr}`;
      }
      
      const isSameYear = now.getFullYear() === date.getFullYear();
      const monthDay = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      if (isSameYear) {
        return `${monthDay} • ${timeStr}`;
      }
      return `${monthDay}, ${date.getFullYear()}`;
    } catch {
      return 'Recently';
    }
  }

  const getFullTimestamp = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = parseUtcDate(dateStr);
      return date.toLocaleString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
  }

  const filteredSessions = sessions.filter(session => {
    if (!historySearch.trim()) return true;
    const q = historySearch.toLowerCase();
    const titleMatch = (session.title || '').toLowerCase().includes(q);
    const timeMatch = formatRealTime(session.created_at).toLowerCase().includes(q) || getFullTimestamp(session.created_at).toLowerCase().includes(q);
    return titleMatch || timeMatch;
  });

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white border border-slate-200 rounded-xl text-[#0F172A] shadow-md cursor-pointer"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/30 z-40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 h-full
        bg-white rounded-none md:rounded-3xl flex flex-col border-r md:border border-slate-200/80 shadow-sm transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'w-20 p-3' : 'w-64 p-5'}
      `}>
         
         {/* Desktop Collapse Toggle (when collapsed) */}
         {isCollapsed && (
           <button 
             className="hidden md:flex absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-[#0284C7] hover:border-blue-300 transition-colors z-50 shadow-sm cursor-pointer"
             onClick={() => setIsCollapsed(false)}
             title="Expand sidebar"
           >
              <ChevronRight size={14} />
           </button>
         )}

         {/* Mobile Close Button */}
         <button 
           className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-[#0F172A] cursor-pointer"
           onClick={() => setIsMobileOpen(false)}
         >
           <X size={20} />
         </button>

         {/* Logo Header */}
         <div className="mb-5 flex items-center justify-between h-11 px-1">
           <Link href="/dashboard" onClick={handleNavClick} className={`font-bold text-[#0F172A] hover:opacity-90 transition-opacity truncate flex items-center gap-2.5 ${isCollapsed ? 'justify-center w-full' : ''}`}>
             <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#0284C7] flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
               <HeartPulse size={20} className="text-[#0284C7]" />
             </div>
             {!isCollapsed && (
               <div className="flex flex-col">
                 <span className="tracking-tight text-lg font-black text-[#0F172A] leading-tight">CuraMind</span>
                 <span className="text-[10px] font-medium text-slate-400 leading-none mt-0.5">Your Health, Our Support</span>
               </div>
             )}
           </Link>
           {!isCollapsed && (
             <button
               onClick={() => setIsCollapsed(true)}
               className="hidden md:flex w-6 h-6 rounded-full border border-slate-200/80 hover:border-slate-300 items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-slate-50/50"
               title="Collapse sidebar"
             >
               <ChevronLeft size={13} />
             </button>
           )}
         </div>
         
         {/* New Chat Button */}
         <Link href="/chat" onClick={handleNavClick} className="block mb-6">
           <button className={`flex items-center justify-center gap-2 py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold rounded-2xl shadow-sm transition-all cursor-pointer ${isCollapsed ? 'w-12 h-12 rounded-full p-0 mx-auto' : 'w-full'}`}>
             <Plus size={18} strokeWidth={2.5} />
             {!isCollapsed && <span className="text-sm font-semibold">New Chat</span>}
           </button>
         </Link>
         
         <div className="flex-1 flex flex-col gap-6 overflow-hidden">
           {/* Main Navigation */}
           <div className="space-y-1">
             {!isCollapsed && <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2.5">Menu</h3>}
             {navItems.map((item) => {
               const isActive = pathname === item.path
               return (
                 <Link key={item.name} href={item.path} onClick={handleNavClick}>
                   <div className={`p-3 rounded-2xl font-semibold cursor-pointer flex items-center transition-all ${isCollapsed ? 'justify-center' : 'gap-3'} ${
                     isActive 
                       ? 'bg-[#E0F2FE]/70 text-[#0284C7] shadow-sm' 
                       : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]'
                   }`} title={isCollapsed ? item.name : undefined}>
                     <item.icon size={18} className={isActive ? "text-[#0284C7]" : "text-slate-400"} />
                     {!isCollapsed && <span className="text-sm">{item.name}</span>}
                   </div>
                 </Link>
               )
             })}
           </div>

           {/* Chat History */}
           <div className="flex-1 flex flex-col overflow-hidden">
             {!isCollapsed && <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-2.5 shrink-0">Recent Chats</h3>}
             
             <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
               {loadingHistory ? (
                 <div className="flex justify-center p-4">
                   <div className="w-4 h-4 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div>
                 </div>
               ) : sessions.length === 0 ? (
                 !isCollapsed && (
                   <div className="space-y-2 px-1">
                     <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80">
                       <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                         <MessageSquare size={13} className="text-[#0284C7]" />
                         <span>General Health Check</span>
                       </div>
                       <p className="text-[10px] text-slate-400 mt-1 pl-5">Just now</p>
                     </div>
                   </div>
                 )
               ) : (
                 <>
                   {sessions.slice(0, 5).map(session => (
                     <div key={session.id} className="relative group">
                       <Link 
                         href={`/chat?session=${session.id}`}
                         onClick={handleNavClick}
                         className={`flex items-start p-2.5 rounded-xl transition-all ${isCollapsed ? 'justify-center' : 'gap-2.5 w-full pr-8'} ${
                           currentSessionId === session.id 
                             ? 'bg-[#E0F2FE]/80 text-[#0284C7] font-semibold border border-blue-100 shadow-xs' 
                             : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]'
                         }`}
                         title={isCollapsed ? session.title : undefined}
                       >
                         <MessageSquare size={15} className={`mt-0.5 shrink-0 ${currentSessionId === session.id ? "text-[#0284C7]" : "text-slate-400"}`} />
                         {!isCollapsed && (
                           <div className="flex-1 text-left min-w-0">
                             <p className="truncate text-xs font-semibold text-[#0F172A]">
                               {session.title || 'New Chat'}
                             </p>
                             <p 
                               className="text-[10px] text-slate-400 font-medium mt-0.5"
                               title={getFullTimestamp(session.created_at)}
                             >
                               {formatRealTime(session.created_at)}
                             </p>
                           </div>
                         )}
                       </Link>
                       {!isCollapsed && (
                         <button
                           onClick={(e) => {
                             e.preventDefault();
                             e.stopPropagation();
                             handleDeleteSession(session.id);
                           }}
                           className="absolute right-2 top-3 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-red-50 cursor-pointer"
                           title="Delete Chat"
                         >
                           <Trash2 size={13} />
                         </button>
                       )}
                     </div>
                   ))}

                   {!isCollapsed && sessions.length > 0 && (
                     <button
                       onClick={() => setShowAllHistoryModal(true)}
                       className="w-full flex items-center justify-between px-2.5 py-2 mt-1.5 text-[11px] font-semibold text-[#0284C7] hover:text-[#0369a1] hover:bg-sky-50/80 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-sky-100"
                     >
                       <span className="flex items-center gap-1.5">
                         <History size={13} />
                         Show all history
                       </span>
                       <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                     </button>
                   )}

                   {isCollapsed && sessions.length > 0 && (
                     <button
                       onClick={() => setShowAllHistoryModal(true)}
                       className="w-full flex items-center justify-center p-2 mt-1 text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 rounded-xl transition-all cursor-pointer"
                       title="Show all history"
                     >
                       <History size={16} />
                     </button>
                   )}
                 </>
               )}
             </div>
           </div>
         </div>

         {/* Bottom Profile Area */}
         <div className={`mt-4 pt-4 border-t border-slate-100 ${isCollapsed ? 'flex flex-col items-center gap-3' : 'space-y-2'}`}>
           <Link href="/settings" className="block group w-full" onClick={handleNavClick}>
             <div className={`flex items-center p-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-200 transition-all cursor-pointer ${isCollapsed ? 'justify-center' : 'gap-3'}`} title={isCollapsed ? "Settings" : undefined}>
                <div className="w-9 h-9 shrink-0 rounded-full bg-[#6366F1] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                   {userName.charAt(0).toUpperCase()}
                </div>
                {!isCollapsed && (
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-[#0F172A] truncate">{userName}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[10px] font-medium text-slate-400">Free Plan</p>
                      <Settings size={13} className="text-slate-400 group-hover:text-[#0284C7] transition-colors" />
                    </div>
                  </div>
                )}
             </div>
           </Link>

           <button onClick={handleLogout} className={`flex items-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer ${isCollapsed ? 'justify-center p-2 w-full' : 'gap-2 text-xs font-semibold px-3 py-2 w-full'}`} title={isCollapsed ? "Logout" : undefined}>
              <LogOut size={15} /> 
              {!isCollapsed && <span>Logout</span>}
           </button>
         </div>
       </div>

      {/* Show All History Modal */}
      {showAllHistoryModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAllHistoryModal(false);
          }}
        >
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                  <History size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">Chat History</h3>
                    <span className="text-[11px] font-semibold bg-sky-100 text-[#0284C7] px-2 py-0.5 rounded-full">
                      {sessions.length} total
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Search and revisit your past medical consultations</p>
                </div>
              </div>
              <button
                onClick={() => setShowAllHistoryModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search chats by title, keyword, or date..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7] transition-all"
                  autoFocus
                />
                {historySearch && (
                  <button
                    onClick={() => setHistorySearch('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* History List */}
            <div className="overflow-y-auto flex-1 p-4 space-y-2 divide-y divide-transparent">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Search size={22} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">No chats found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {historySearch ? 'Try a different search term or clear the filter.' : 'You haven\'t started any chats yet.'}
                  </p>
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const isCurrent = currentSessionId === session.id;
                  return (
                    <div
                      key={session.id}
                      className={`group p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-[#E0F2FE]/60 border-blue-200 shadow-xs'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${isCurrent ? 'bg-[#0284C7] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-[#E0F2FE] group-hover:text-[#0284C7] transition-colors'}`}>
                          <MessageSquare size={15} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {session.title || 'New Consultation'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span 
                              className="text-[10px] text-slate-400 font-medium flex items-center gap-1"
                              title={getFullTimestamp(session.created_at)}
                            >
                              <Clock size={11} className="text-slate-400" />
                              {formatRealTime(session.created_at)}
                            </span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {getFullTimestamp(session.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link
                          href={`/chat?session=${session.id}`}
                          onClick={() => {
                            setShowAllHistoryModal(false);
                            handleNavClick();
                          }}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isCurrent
                              ? 'bg-[#0284C7] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-[#0284C7] hover:text-white'
                          }`}
                        >
                          <span>{isCurrent ? 'Current' : 'Open'}</span>
                          <ArrowRight size={12} />
                        </Link>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Chat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredSessions.length} of {sessions.length} chats</span>
              <button
                onClick={() => setShowAllHistoryModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition-colors cursor-pointer text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
