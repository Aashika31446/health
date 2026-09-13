'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Pill, User as UserIcon, Droplets, Calendar, Lock, TrendingUp, HeartPulse } from 'lucide-react'

export default function SharedPortalPage() {
    const params = useParams()
    const token = params.token as string
    
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    
    const [selectedMetric, setSelectedMetric] = useState<string>('')
    const [availableMetrics, setAvailableMetrics] = useState<string[]>([])
    const [chartData, setChartData] = useState<any[]>([])
    
    useEffect(() => {
        async function loadSharedData() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${baseUrl}/api/chat/doctor-links/${token}`);
                if (!res.ok) {
                    throw new Error("Invalid or expired link.")
                }
                const result = await res.json()
                setData(result.data)
                
                // Process chart data
                const metrics = result.data.metrics || []
                if (metrics.length > 0) {
                    const uniqueMetrics = Array.from(new Set(metrics.map((m: any) => m.metric_name)));
                    setAvailableMetrics(uniqueMetrics as string[]);
                    if (uniqueMetrics.length > 0) {
                        setSelectedMetric(uniqueMetrics[0] as string);
                    }
            
                    const groupedData: any = {};
                    metrics.forEach((m: any) => {
                        const date = new Date(m.date_recorded).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        if (!groupedData[date]) {
                            groupedData[date] = { date };
                        }
                        groupedData[date][m.metric_name] = m.metric_value;
                    });
            
                    setChartData(Object.values(groupedData));
                }
                
            } catch (e: any) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }
        if (token) {
            loadSharedData()
        }
    }, [token])
    
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0F5FA] flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-[#0284C7] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-[#F0F5FA] flex justify-center items-center p-4 text-center">
                <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-rose-200 shadow-xl">
                    <Lock className="text-rose-500 mx-auto mb-4" size={44} />
                    <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Access Denied</h1>
                    <p className="text-slate-500 text-sm mb-6">{error}</p>
                    <a
                      href="/dashboard"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-sm transition-all shadow-sm"
                    >
                      Go to Dashboard
                    </a>
                </div>
            </div>
        )
    }

    const profile = data?.profile || {}
    const prescriptions = data?.prescriptions || []

    return (
        <div className="min-h-screen bg-[#F0F5FA] text-[#0F172A] overflow-y-auto">
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
                
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#0284C7] flex items-center justify-center shadow-xs">
                            <HeartPulse size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">CuraMind Doctor Portal</h1>
                            <p className="text-slate-400 text-xs sm:text-sm font-medium">
                              Patient Health Summary {profile?.full_name ? `• ${profile.full_name}` : ''}
                            </p>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-[#0284C7] border border-sky-200/80 text-xs font-bold self-start sm:self-auto">
                        <Lock size={13} /> Secure Read-Only Access
                    </div>
                </header>
                
                {/* Patient Profile */}
                <section>
                    <h2 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                        <UserIcon className="text-[#0284C7]" size={20} /> Patient Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-200/80 shadow-xs">
                          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-3">
                            <Calendar size={24} />
                          </div>
                          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Age</h3>
                          <p className="text-3xl font-black text-[#0F172A] mt-1">{profile?.age || 32} <span className="text-sm font-medium text-slate-400">years</span></p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-200/80 shadow-xs">
                          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                            <Droplets size={24} />
                          </div>
                          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Blood Group</h3>
                          <p className="text-3xl font-black text-[#0F172A] mt-1">{profile?.blood_group || 'B+'}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 flex flex-col items-center justify-center border border-slate-200/80 shadow-xs">
                           <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-3">
                             <UserIcon size={24} />
                           </div>
                           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Gender</h3>
                           <p className="text-3xl font-black text-[#0F172A] mt-1 capitalize">{profile?.gender || 'Male'}</p>
                        </div>
                    </div>
                </section>
                
                {/* Health Trends */}
                {chartData.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                        <TrendingUp className="text-[#0284C7]" size={20} /> Lab Results Trends
                    </h2>
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <select 
                          value={selectedMetric}
                          onChange={(e) => setSelectedMetric(e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-[#0F172A] rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-[#0284C7] transition-colors"
                        >
                          {availableMetrics.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>

                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                              itemStyle={{ color: '#0284C7', fontWeight: 'bold' }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey={selectedMetric} 
                              stroke="#0284C7" 
                              strokeWidth={3}
                              dot={{ r: 4, fill: '#0284C7', strokeWidth: 0 }}
                              activeDot={{ r: 6, fill: '#ffffff', stroke: '#0284C7', strokeWidth: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                </section>
                )}
                
                {/* Prescriptions */}
                <section>
                    <h2 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                        <Pill className="text-[#0284C7]" size={20} /> Active Prescriptions
                    </h2>
                    {prescriptions?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {prescriptions.map((med: any) => (
                            <div key={med.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                              <h3 className="font-bold text-[#0F172A] text-base mb-2">{med.medicine_name}</h3>
                              <div className="space-y-1 text-xs text-slate-500">
                                {med.dosage && <p><strong className="text-slate-700 font-semibold">Dosage:</strong> {med.dosage}</p>}
                                {med.frequency && <p><strong className="text-slate-700 font-semibold">Frequency:</strong> {med.frequency}</p>}
                                {med.duration && <p><strong className="text-slate-700 font-semibold">Duration:</strong> {med.duration}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-xs text-center text-slate-400 text-sm">
                          No active prescriptions on file.
                        </div>
                    )}
                </section>
                
                <footer className="text-center pt-8 border-t border-slate-200/80 text-xs text-slate-400 pb-10">
                    This portal is securely provided by CuraMind AI. Data is shared with explicit patient consent and will automatically expire in 7 days.
                </footer>
            </div>
        </div>
    )
}
