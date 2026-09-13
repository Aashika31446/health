'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Pill, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  X, 
  Plus, 
  Trash2, 
  PlusCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface PrescriptionItem {
  id: string
  user_id?: string
  medicine_name: string
  dosage?: string
  frequency?: string
  duration?: string
  instructions?: string
  created_at?: string
}

interface ReminderItem {
  id: string
  user_id?: string
  prescription_id: string
  time_of_day: string
  taken_status: boolean
  prescriptions?: {
    id?: string
    medicine_name: string
    dosage?: string
  }
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([])
  const [reminders, setReminders] = useState<ReminderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('default-user')
  
  // Modals
  const [selectedMed, setSelectedMed] = useState<PrescriptionItem | null>(null)
  const [reminderTime, setReminderTime] = useState('morning')
  const [showAddMedModal, setShowAddMedModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Add Medication Form
  const [newMedName, setNewMedName] = useState('')
  const [newDosage, setNewDosage] = useState('')
  const [newFrequency, setNewFrequency] = useState('')
  const [newDuration, setNewDuration] = useState('')

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    async function initUser() {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
      const uid = data?.user?.id || 'default-user'
      setUserId(uid)
      fetchPrescriptionsAndReminders(uid)
    }
    initUser()
  }, [])

  const fetchPrescriptionsAndReminders = async (uid: string) => {
    setLoading(true)
    const prescMap = new Map<string, PrescriptionItem>()

    // 1. Fetch from backend API
    try {
      const res = await fetch(`${baseUrl}/api/chat/prescriptions?user_id=${uid}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          data.forEach(p => {
            if (p.id) prescMap.set(p.id, p)
          })
        }
      }
    } catch (e) {
      console.warn("Backend prescriptions fetch notice:", e)
    }

    // 2. Fetch from Supabase
    try {
      const supabase = createClient()
      if (uid && uid !== 'default-user') {
        const { data } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
        if (data && Array.isArray(data)) {
          data.forEach(p => {
            if (p.id && !prescMap.has(p.id)) {
              prescMap.set(p.id, p)
            }
          })
        }
      }
    } catch (e) {
      console.warn("Supabase prescriptions fetch notice:", e)
    }

    const mergedPrescs = Array.from(prescMap.values())
    setPrescriptions(mergedPrescs)

    // 3. Fetch reminders from backend API
    const remMap = new Map<string, ReminderItem>()
    try {
      const res = await fetch(`${baseUrl}/api/chat/pill-reminders?user_id=${uid}`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          data.forEach(r => {
            if (r.id) remMap.set(r.id, r)
          })
        }
      }
    } catch (e) {
      console.warn("Backend reminders fetch notice:", e)
    }

    // 4. Fetch reminders from Supabase
    try {
      const supabase = createClient()
      if (uid && uid !== 'default-user') {
        const { data: remData } = await supabase
          .from('pill_reminders')
          .select('*, prescriptions(*)')
        if (remData && Array.isArray(remData)) {
          remData.forEach(r => {
            if (r.id && !remMap.has(r.id)) {
              remMap.set(r.id, r)
            }
          })
        }
      }
    } catch (e) {
      console.warn("Supabase reminders fetch notice:", e)
    }

    setReminders(Array.from(remMap.values()))
    setLoading(false)
  }

  // Handle Save Pill Reminder
  const handleSaveReminder = async () => {
    if (!selectedMed) return
    setIsSaving(true)
    try {
      const res = await fetch(`${baseUrl}/api/chat/pill-reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          prescription_id: selectedMed.id,
          time_of_day: reminderTime
        })
      })

      if (res.ok) {
        const newRem = await res.json()
        setReminders(prev => [...prev, newRem])
        setSelectedMed(null)
      } else {
        // Fallback to Supabase
        const supabase = createClient()
        const { data } = await supabase.from('pill_reminders').insert({
          prescription_id: selectedMed.id,
          time_of_day: reminderTime,
          taken_status: false
        }).select()
        if (data) {
          setReminders(prev => [...prev, ...data])
          setSelectedMed(null)
        }
      }
    } catch (e) {
      console.error("Save reminder error:", e)
    }
    setIsSaving(false)
  }

  // Toggle Reminder Status
  const toggleReminder = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    setReminders(prev => prev.map(r => r.id === id ? { ...r, taken_status: newStatus } : r))

    try {
      await fetch(`${baseUrl}/api/chat/pill-reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taken_status: newStatus })
      })
    } catch (_) {}

    try {
      const supabase = createClient()
      await supabase.from('pill_reminders').update({ taken_status: newStatus }).eq('id', id)
    } catch (_) {}
  }

  // Delete Prescription
  const handleDeletePrescription = async (prescriptionId: string) => {
    if (!confirm("Are you sure you want to remove this medication?")) return
    setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId))
    setReminders(prev => prev.filter(r => r.prescription_id !== prescriptionId))

    try {
      await fetch(`${baseUrl}/api/chat/prescriptions/${prescriptionId}`, {
        method: 'DELETE'
      })
    } catch (e) {
      console.error("Delete prescription error:", e)
    }

    try {
      const supabase = createClient()
      await supabase.from('prescriptions').delete().eq('id', prescriptionId)
    } catch (_) {}
  }

  // Add Custom Medication
  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMedName.trim()) return

    setIsSaving(true)
    const medPayload = {
      user_id: userId,
      medicine_name: newMedName.trim(),
      dosage: newDosage.trim(),
      frequency: newFrequency.trim(),
      duration: newDuration.trim()
    }

    try {
      const res = await fetch(`${baseUrl}/api/chat/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medPayload)
      })
      if (res.ok) {
        const saved = await res.json()
        if (saved && saved.id) {
          setPrescriptions(prev => [saved, ...prev.filter(p => p.id !== saved.id)])
        }
      }
    } catch (err) {
      console.error("Add medication error:", err)
    }

    setNewMedName('')
    setNewDosage('')
    setNewFrequency('')
    setNewDuration('')
    setShowAddMedModal(false)
    setIsSaving(false)
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pr-0 md:pr-2 custom-scrollbar">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
              <Pill size={22} />
            </div>
            My Prescriptions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Auto-extracted from your uploaded medical prescriptions & AI consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/chat"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-[#0284C7]" />
            Upload New in Chat
          </Link>

          <button
            onClick={() => setShowAddMedModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Medication</span>
          </button>
        </div>
      </header>
      
      {/* Reminders Section */}
      {reminders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3 flex items-center gap-2">
            <Clock className="text-amber-500" size={20} /> Today&apos;s Reminders
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {reminders.map(rem => (
               <div 
                 key={rem.id} 
                 className={`bg-white p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer shadow-xs hover:shadow-sm ${
                   rem.taken_status ? 'border-emerald-200 bg-emerald-50/25' : 'border-amber-200/80 hover:border-amber-300'
                 }`} 
                 onClick={() => toggleReminder(rem.id, rem.taken_status)}
               >
                 <div className="flex items-center gap-3 min-w-0">
                    {rem.taken_status ? (
                      <CheckCircle className="text-emerald-500 shrink-0" size={22} />
                    ) : (
                      <Circle className="text-amber-500 shrink-0" size={22} />
                    )}
                    <div className="min-w-0">
                        <h4 className={`font-bold text-xs truncate ${rem.taken_status ? 'text-slate-400 line-through' : 'text-[#0F172A]'}`}>
                          {rem.prescriptions?.medicine_name || 'Medication'}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-semibold text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded-md">
                            {rem.time_of_day}
                          </span>
                          {rem.prescriptions?.dosage && (
                            <span className="text-[11px] text-slate-400 truncate">
                              {rem.prescriptions.dosage}
                            </span>
                          )}
                        </div>
                    </div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Medications List */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
          <AlertCircle className="text-[#0284C7]" size={20} /> Active Medications
        </h2>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {prescriptions.length} medications
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 flex flex-col justify-center items-center border border-slate-200/80 shadow-xs">
          <div className="w-9 h-9 border-3 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium mt-3">Loading prescriptions...</p>
        </div>
      ) : prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prescriptions.map((med) => (
            <div 
              key={med.id} 
              className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-sky-200 transition-all relative group overflow-hidden shadow-xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-2.5 rounded-2xl bg-sky-50 text-[#0284C7] border border-sky-100/80 shrink-0">
                      <Pill size={18} />
                    </span>
                    <h3 className="text-sm font-bold text-[#0F172A] truncate">
                      {med.medicine_name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeletePrescription(med.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Delete medication"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                
                <div className="space-y-2 bg-slate-50/60 p-3 rounded-2xl border border-slate-100 text-xs">
                  {med.dosage ? (
                    <div className="flex items-center">
                      <span className="w-20 text-slate-400 font-medium flex items-center gap-1.5">
                        <Pill size={12} /> Dosage:
                      </span>
                      <span className="text-slate-800 font-semibold">{med.dosage}</span>
                    </div>
                  ) : null}

                  {med.frequency ? (
                    <div className="flex items-center">
                      <span className="w-20 text-slate-400 font-medium flex items-center gap-1.5">
                        <Clock size={12} /> Frequency:
                      </span>
                      <span className="text-slate-800 font-semibold">{med.frequency}</span>
                    </div>
                  ) : null}

                  {med.duration ? (
                    <div className="flex items-center">
                      <span className="w-20 text-slate-400 font-medium flex items-center gap-1.5">
                        <Calendar size={12} /> Duration:
                      </span>
                      <span className="text-slate-800 font-semibold">{med.duration}</span>
                    </div>
                  ) : null}

                  {!med.dosage && !med.frequency && !med.duration && (
                    <p className="text-slate-400 italic text-[11px]">As prescribed by clinician</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                 <span className="text-slate-400">
                   {med.created_at ? `Added ${new Date(med.created_at).toLocaleDateString()}` : 'Active'}
                 </span>
                 <button 
                   onClick={() => setSelectedMed(med)} 
                   className="text-[#0284C7] hover:text-[#0369A1] font-bold transition-colors bg-sky-50 hover:bg-sky-100 border border-sky-100 px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1"
                 >
                   <Clock size={12} />
                   <span>+ Reminder</span>
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center border-dashed border-2 border-slate-200 rounded-3xl shadow-xs flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4 border border-sky-100">
            <Pill size={28} />
          </div>
          <h3 className="text-base font-bold text-[#0F172A] mb-1.5">No Prescriptions Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
            When you upload any prescription image or PDF in the Chat or Dashboard, CuraMind AI will automatically extract your medications and list them here.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369a1] transition-all shadow-xs cursor-pointer"
            >
              <span>Go to Chat & Consult</span>
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setShowAddMedModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
            >
              Add Manually
            </button>
          </div>
        </div>
      )}
      
      {/* Modal for setting reminder */}
      {selectedMed && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-center items-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center">
                        <Clock size={16} />
                      </div>
                      <h2 className="text-sm font-bold text-[#0F172A]">Set Pill Reminder</h2>
                    </div>
                    <button 
                      onClick={() => setSelectedMed(null)} 
                      className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Medication</p>
                        <p className="text-sm font-bold text-[#0F172A]">{selectedMed.medicine_name}</p>
                        {selectedMed.dosage && <p className="text-xs text-slate-500 mt-0.5">{selectedMed.dosage}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Time of Day</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['morning', 'afternoon', 'night'].map(time => (
                                <button 
                                    key={time}
                                    type="button"
                                    onClick={() => setReminderTime(time)}
                                    className={`py-3 rounded-2xl border capitalize text-xs font-bold transition-all cursor-pointer ${
                                      reminderTime === time 
                                        ? 'bg-sky-50 border-[#0284C7] text-[#0284C7] shadow-xs' 
                                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                      onClick={handleSaveReminder} 
                      disabled={isSaving}
                      className="w-full py-3 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-2xl transition-all shadow-md shadow-sky-500/20 mt-4 cursor-pointer text-xs flex items-center justify-center gap-2"
                    >
                        {isSaving ? "Saving..." : "Save Reminder"}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Modal for manually adding medication */}
      {showAddMedModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#0284C7] flex items-center justify-center">
                  <Pill size={16} />
                </div>
                <h2 className="text-sm font-bold text-[#0F172A]">Add Medication</h2>
              </div>
              <button 
                onClick={() => setShowAddMedModal(false)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMedication} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Medicine Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="e.g. Paracetamol 650mg, Amoxicillin"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage</label>
                  <input 
                    type="text"
                    placeholder="e.g. 1 tablet, 5ml"
                    value={newDosage}
                    onChange={(e) => setNewDosage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Frequency</label>
                  <input 
                    type="text"
                    placeholder="e.g. Twice daily, SOS"
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                <input 
                  type="text"
                  placeholder="e.g. 5 days, 1 month, Ongoing"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284C7]/20 focus:border-[#0284C7]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMedModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newMedName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
