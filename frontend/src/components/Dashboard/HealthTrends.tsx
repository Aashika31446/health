'use client'

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';

export function HealthTrends({ profileId }: { profileId: string }) {
  const [data, setData] = useState<any[]>([]);
  const [rawMetrics, setRawMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('Hemoglobin');
  const [availableMetrics, setAvailableMetrics] = useState<string[]>([]);

  useEffect(() => {
    async function loadMetrics() {
      if (!profileId) return;
      const supabase = createClient();
      
      const { data: metrics } = await supabase
        .from('metrics')
        .select('*')
        .eq('profile_id', profileId)
        .order('date_recorded', { ascending: true });

      if (metrics && metrics.length > 0) {
        setRawMetrics(metrics);
        const uniqueMetrics = Array.from(new Set(metrics.map(m => m.metric_name)));
        setAvailableMetrics(uniqueMetrics as string[]);
        if (uniqueMetrics.length > 0 && !uniqueMetrics.includes(selectedMetric)) {
            setSelectedMetric(uniqueMetrics[0] as string);
        }

        const groupedData: any = {};
        metrics.forEach(m => {
            const date = new Date(m.date_recorded).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            if (!groupedData[date]) {
                groupedData[date] = { date };
            }
            groupedData[date][m.metric_name] = m.metric_value;
            groupedData[date][`${m.metric_name}_unit`] = m.unit;
            groupedData[date][`${m.metric_name}_flag`] = m.flag;
        });

        setData(Object.values(groupedData));
      }
      setLoading(false);
    }
    
    loadMetrics();
  }, [profileId, selectedMetric]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-3xl flex justify-center items-center h-64 border border-slate-200/80 shadow-sm">
        <Loader2 className="animate-spin text-[#0284C7]" size={32} />
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
            <TrendingUp size={18} />
          </div>
          Health Trends
        </h2>
        
        <select 
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-[#0F172A] text-sm font-semibold rounded-xl px-4 py-2 outline-none focus:border-[#0284C7] transition-colors"
        >
          {availableMetrics.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      
      {/* Metric Slots Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 mb-6 custom-scrollbar scroll-smooth">
        {availableMetrics.map(metric => {
           const points = rawMetrics.filter(m => m.metric_name === metric).sort((a, b) => new Date(a.date_recorded).getTime() - new Date(b.date_recorded).getTime());
           if (points.length === 0) return null;
           
           const latest = points[points.length - 1];
           const prev = points.length > 1 ? points[points.length - 2] : null;
           
           let trend = 'stable';
           if (prev) {
               if (latest.metric_value > prev.metric_value) trend = 'up';
               else if (latest.metric_value < prev.metric_value) trend = 'down';
           }
           
           const colorClass = latest.flag === 'high' || latest.flag === 'low' 
               ? 'text-red-500' 
               : 'text-emerald-600';
               
           const isActive = selectedMetric === metric;
           
           return (
             <div 
               key={metric} 
               onClick={() => setSelectedMetric(metric)}
               className={`min-w-[160px] p-4 rounded-2xl cursor-pointer transition-all border ${
                 isActive 
                   ? 'bg-sky-50/80 border-[#0284C7] shadow-sm' 
                   : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/70'
               }`}
             >
               <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-semibold text-slate-500 truncate pr-2">{metric}</span>
                 {trend === 'up' && <ArrowUp size={15} className="text-amber-500" />}
                 {trend === 'down' && <ArrowDown size={15} className="text-[#0284C7]" />}
                 {trend === 'stable' && <Minus size={15} className="text-slate-400" />}
               </div>
               <div className="flex items-baseline gap-1">
                 <span className={`text-2xl font-bold ${colorClass}`}>{latest.metric_value}</span>
                 <span className="text-xs text-slate-400 font-medium">{latest.unit}</span>
               </div>
             </div>
           )
        })}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', color: '#0f172a' }}
              itemStyle={{ color: '#0284C7', fontWeight: 600 }}
            />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke="#0284C7" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#0284C7', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#ffffff', stroke: '#0284C7', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
