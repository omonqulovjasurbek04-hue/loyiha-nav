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
          <h1 className="text-3xl font-bold text-white mb-2">Boshqaruv <span className="text-gradient">Paneli</span></h1>
          <p className="text-slate-400">Umumiy tizim holati va statistika</p>
        </div>
        <div className="flex gap-4">
          <button className="glass flex items-center gap-2 px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all">
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
          <div key={card.label} className="glass rounded-2xl p-6 glow card-hover relative overflow-hidden" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
               <card.icon className="w-24 h-24 text-white" />
            </div>
            <div className="flex items-start gap-4 mb-4 relative z-10">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-white">{card.value ?? 0}</span>
                {idx > 2 && <TrendingUp className="w-4 h-4 text-green-400" />}
              </div>
              <p className="text-sm text-slate-400">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Visual Chart Placeholder */}
      <div className="mt-8 glass rounded-3xl p-8 glow animate-slide-up" style={{ animationDelay: '0.6s' }}>
         <h3 className="text-xl font-bold text-white mb-6">Aktivlik kesimi</h3>
         <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-700/50 rounded-2xl">
            <p className="text-slate-500">Diagramma qismini qo'shish kutilmoqda...</p>
         </div>
      </div>
    </div>
  );
}
