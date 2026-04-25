'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/tickets', { params: { date } }),
      api.get('/admin/tickets/stats', { params: { date } }),
    ]).then(([tRes, sRes]) => {
      setTickets(tRes.data.data || []);
      setStats(sRes.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [date]);

  if (loading && !tickets.length && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const statusConfig: Record<string, { color: string, label: string }> = {
    WAITING: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Kutmoqda' },
    CALLED: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Chaqirildi' },
    COMPLETED: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Yakunlandi' },
    SKIPPED: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'O\'tkazib yuborildi' },
    CANCELLED: { color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'Bekor qilindi' },
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Navbatlar <span className="text-gradient">Tarixi</span></h2>
          <p className="text-slate-600 dark:text-slate-400">Tanlangan sanadagi barcha navbatlar ro'yxati</p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700/50">
           <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
             📅
           </div>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="bg-transparent border-none text-slate-900 dark:text-white focus:outline-none focus:ring-0 mr-2 cursor-pointer color-scheme-light dark:color-scheme-dark" 
            style={{ colorScheme: 'light dark' } as any}
          />
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 animate-slide-up">
          {[
            { label: 'Jami navbatlar', value: stats.total, color: 'from-indigo-500 to-blue-600', shadow: 'shadow-indigo-500/20' },
            { label: 'Kutmoqda', value: stats.waiting, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
            { label: 'Chaqirildi', value: stats.called, color: 'from-blue-500 to-cyan-600', shadow: 'shadow-blue-500/20' },
            { label: 'Yakunlandi', value: stats.completed, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
            { label: 'Bekor qilingan', value: stats.skipped + stats.cancelled, color: 'from-rose-500 to-red-600', shadow: 'shadow-rose-500/20' },
          ].map((s, idx) => (
            <div key={s.label} className="glass bg-white/50 dark:bg-transparent rounded-2xl p-5 relative overflow-hidden group hover:scale-105 transition-transform" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1 relative z-10">{s.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium relative z-10">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="glass bg-white/50 dark:bg-transparent rounded-3xl overflow-hidden animate-slide-up glow" style={{ animationDelay: '0.4s' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-24">Raqam</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Mijoz Telefoni</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Xizmat</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Holat</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-right">Olingan Vaqt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center min-w-[3rem] px-2 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      {t.ticket_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded">
                      {t.user?.phone || 'Mavjud emas'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                    {t.queue?.service?.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[t.status]?.color || 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'}`}>
                      {statusConfig[t.status]?.label || t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 text-right font-mono">
                    {new Date(t.issued_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                 <span className="text-2xl opacity-50">🧾</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Ushbu sanada navbatlar yo'q</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Boshqa sanani tanlab ko'ring yoki biroz kuting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
