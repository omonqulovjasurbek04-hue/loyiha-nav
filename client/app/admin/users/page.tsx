'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  const updateRole = async (id: string, role: string) => {
    await api.put(`/admin/users/${id}`, { role });
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Foydalanuvchilar <span className="text-gradient">Boshqaruvi</span></h2>
        <p className="text-slate-600 dark:text-slate-400">Tizimdan ro'yxatdan o'tgan barcha foydalanuvchilar va ularning rollari</p>
      </div>

      <div className="glass bg-white/50 dark:bg-transparent rounded-3xl overflow-hidden animate-slide-up glow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Telefon / Ism</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Holat</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-center">Navbatlar</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-right">Ro'yxatdan o'tgan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{u.full_name || 'Kiritilmagan'}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-1 bg-slate-100 dark:bg-slate-800/50 inline-block px-2 py-0.5 rounded">{u.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select
                        className={`appearance-none bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium
                          ${u.role === 'admin' || u.role === 'superadmin' ? 'text-purple-600 dark:text-purple-400' : 
                            u.role === 'operator' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                      >
                        <option value="citizen" className="text-slate-700 dark:text-slate-300">Fuqaro</option>
                        <option value="operator" className="text-slate-700 dark:text-slate-300">Operator</option>
                        <option value="admin" className="text-slate-700 dark:text-slate-300">Admin</option>
                        <option value="superadmin" className="text-slate-700 dark:text-slate-300">Super Admin</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      u.is_active 
                        ? 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                        : 'bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    }`}>
                      {u.is_active ? 'Faol' : 'Bloklangan'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-sm">
                       {u.tickets?.length || 0}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 text-right">
                    {new Date(u.created_at).toLocaleDateString('uz-UZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                 <span className="text-2xl opacity-50">👥</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Foydalanuvchilar topilmadi</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Hozircha tizimda hech kim ro'yxatdan o'tmagan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
