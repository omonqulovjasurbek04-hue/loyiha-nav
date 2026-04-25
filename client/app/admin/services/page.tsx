'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', org_id: '', duration_minutes: 15, daily_limit: 50 });

  const fetchData = () => {
    Promise.all([api.get('/admin/services'), api.get('/admin/organizations')]).then(
      ([sRes, oRes]) => {
        setServices(sRes.data.data || []);
        setOrgs(oRes.data.data || []);
      }
    ).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/services', form);
      setForm({ name: '', org_id: '', duration_minutes: 15, daily_limit: 50 });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("O'chirishni xohlaysizmi?")) return;
    await api.delete(`/admin/services/${id}`);
    fetchData();
  };

  if (loading && !services.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Xizmatlar <span className="text-gradient">Boshqaruvi</span></h2>
          <p className="text-slate-600 dark:text-slate-400">Idoralardagi barcha xizmatlarni boshqarish</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setForm({ name: '', org_id: '', duration_minutes: 15, daily_limit: 50 });
          }} 
          className="btn-primary"
        >
          {showForm ? 'Bekor qilish' : '+ Yangi xizmat qo\'shish'}
        </button>
      </div>

      {showForm && (
        <div className="glass bg-white/50 dark:bg-transparent rounded-3xl p-6 md:p-8 mb-8 animate-slide-up glow">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700/50 pb-4">
            Yangi xizmat ma'lumotlari
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Xizmat nomi</label>
              <input 
                className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm dark:shadow-none" 
                placeholder="Misol: Terapevt qabuli" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tegishli idora</label>
                <select 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none shadow-sm dark:shadow-none" 
                  value={form.org_id} 
                  onChange={(e) => setForm({ ...form, org_id: e.target.value })} 
                  required
                >
                  <option value="" className="text-slate-500 dark:text-slate-500">Idorani tanlang</option>
                  {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Davomiylik (daqiqa)</label>
                <input 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm dark:shadow-none" 
                  type="number" 
                  min="1"
                  placeholder="15" 
                  value={form.duration_minutes} 
                  onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kunlik limit</label>
                <input 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm dark:shadow-none" 
                  type="number" 
                  min="0"
                  placeholder="50" 
                  value={form.daily_limit} 
                  onChange={(e) => setForm({ ...form, daily_limit: parseInt(e.target.value) })} 
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto min-w-[150px] justify-center">
                {loading ? 'Qo\'shilmoqda...' : 'Xizmatni qo\'shish'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass bg-white/50 dark:bg-transparent rounded-3xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Xizmat nomi</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Tegishli Idora</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-center">Davomiylik</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-center">Limit</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Holat</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{s.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{s.organization?.name || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                      ⏱ {s.duration_minutes}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                      {s.daily_limit || '∞'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      s.is_active 
                        ? 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                        : 'bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    }`}>
                      {s.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(s.id)} 
                      className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium px-3 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                 <span className="text-2xl opacity-50">📋</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Xizmatlar mavjud emas</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Yangi xizmat qo'shish uchun yuqoridagi tugmadan foydalaning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
