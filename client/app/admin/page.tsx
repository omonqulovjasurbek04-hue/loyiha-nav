'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Building2, FileText, Users, Receipt, PlayCircle, ShieldAlert, BarChart3, TrendingUp, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Idoralar', value: stats?.total_organizations, color: 'from-blue-500 to-cyan-600', icon: Building2 },
    { label: 'Xizmatlar', value: stats?.total_services, color: 'from-emerald-500 to-teal-600', icon: FileText },
    { label: 'Foydalanuvchilar', value: stats?.total_users, color: 'from-purple-500 to-violet-600', icon: Users },
    { label: 'Jami navbatlar', value: stats?.total_tickets, color: 'from-indigo-500 to-blue-600', icon: Receipt },
    { label: 'Bugungi navbatlar', value: stats?.today_tickets, color: 'from-amber-500 to-orange-600', icon: PlayCircle },
    { label: 'Aktiv navbatlar', value: stats?.active_tickets, color: 'from-rose-500 to-red-600', icon: ShieldAlert },
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-10 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Boshqaruv <span className="text-gradient">Paneli</span></h1>
          <p className="text-slate-600 dark:text-slate-400">Umumiy tizim holati va statistika</p>
        </div>
        <div className="flex gap-4">
          <button className="glass bg-white/50 dark:bg-transparent flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
            <BarChart3 className="w-5 h-5" />
            Hisobotlar
          </button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl">
            <Settings className="w-5 h-5" />
            Sozlamalar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        {cards.map((card, idx) => (
          <div key={card.label} className="glass bg-white/50 dark:bg-transparent rounded-2xl p-6 glow card-hover relative overflow-hidden" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-10 pointer-events-none">
               <card.icon className="w-24 h-24 text-slate-900 dark:text-white" />
            </div>
            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{card.value ?? 0}</span>
                {idx > 2 && <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Dynamic Visual Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        
        {/* Bugungi faollik kesimi */}
        <div className="glass bg-white/50 dark:bg-transparent rounded-3xl p-8 glow flex flex-col justify-center">
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Bugungi faollik kesimi</h3>
           <div className="space-y-8">
             <div>
               <div className="flex justify-between text-sm font-medium mb-3">
                 <span className="text-slate-600 dark:text-slate-300">Xizmat ko'rsatilganlar</span>
                 <span className="text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded">
                   {stats?.today_tickets ? stats.today_tickets - stats.active_tickets : 0} / {stats?.today_tickets || 0}
                 </span>
               </div>
               <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-4 overflow-hidden relative">
                 <div 
                   className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                   style={{ width: `${stats?.today_tickets > 0 ? ((stats.today_tickets - stats.active_tickets) / stats.today_tickets) * 100 : 0}%` }}
                 ></div>
               </div>
             </div>
             
             <div>
               <div className="flex justify-between text-sm font-medium mb-3">
                 <span className="text-slate-600 dark:text-slate-300">Kutayotganlar (Aktiv)</span>
                 <span className="text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded">
                   {stats?.active_tickets || 0} kishi
                 </span>
               </div>
               <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-4 overflow-hidden relative">
                 <div 
                   className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(244,63,94,0.5)]" 
                   style={{ width: `${stats?.today_tickets > 0 ? (stats.active_tickets / stats.today_tickets) * 100 : 0}%` }}
                 ></div>
               </div>
             </div>
           </div>
        </div>

        {/* Tizim qamrovi (Radial) */}
        <div className="glass bg-white/50 dark:bg-transparent rounded-3xl p-8 glow flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
           <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
           
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 w-full text-left relative z-10">Jami faollik ulushi</h3>
           
           <div className="relative w-48 h-48 flex-shrink-0 z-10">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               {/* Background Circle */}
               <circle 
                 cx="50" cy="50" r="40" 
                 stroke="currentColor" 
                 strokeWidth="8" 
                 fill="transparent" 
                 className="text-slate-200 dark:text-slate-800" 
               />
               {/* Progress Circle */}
               <circle 
                 cx="50" cy="50" r="40" 
                 stroke="currentColor" 
                 strokeWidth="8" 
                 fill="transparent" 
                 strokeDasharray="251.2" 
                 strokeDashoffset={251.2 - (251.2 * (stats?.total_tickets > 0 ? (stats.today_tickets / stats.total_tickets) * 100 : 0) / 100)} 
                 strokeLinecap="round" 
                 className="text-indigo-500 transition-all duration-1500 ease-out drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-500">
                 {Math.round(stats?.total_tickets > 0 ? (stats.today_tickets / stats.total_tickets) * 100 : 0)}%
               </span>
               <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-1 uppercase text-center px-2">
                 Bugungi<br/>Ulush
               </span>
             </div>
           </div>
        </div>
        
      </div>
    </div>
  );
}
