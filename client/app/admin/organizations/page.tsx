'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminOrganizations() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'government', address: '', phone: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchOrgs = () => {
    api.get('/admin/organizations').then((res) => setOrgs(res.data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrgs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/admin/organizations/${editingId}`, form);
      } else {
        await api.post('/admin/organizations', form);
      }
      setForm({ name: '', type: 'government', address: '', phone: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      fetchOrgs();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (org: any) => {
    setForm({ name: org.name, type: org.type, address: org.address, phone: org.phone || '', description: org.description || '' });
    setEditingId(org.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("O'chirishni xohlaysizmi?")) return;
    await api.delete(`/admin/organizations/${id}`);
    fetchOrgs();
  };

  if (loading && !orgs.length) {
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
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Idoralar <span className="text-gradient">Boshqaruvi</span></h2>
          <p className="text-slate-600 dark:text-slate-400">Tizimdagi barcha tashkilotlarni boshqarish</p>
        </div>
        <button 
          onClick={() => { 
            setShowForm(!showForm); 
            setEditingId(null); 
            setForm({ name: '', type: 'government', address: '', phone: '', description: '' }); 
          }} 
          className="btn-primary"
        >
          {showForm ? 'Bekor qilish' : '+ Yangi idora qo\'shish'}
        </button>
      </div>

      {showForm && (
        <div className="glass bg-white/50 dark:bg-transparent rounded-3xl p-6 md:p-8 mb-8 animate-slide-up glow">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700/50 pb-4">
            {editingId ? "Idorani tahrirlash" : "Yangi idora ma'lumotlari"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Idora nomi</label>
                <input 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm dark:shadow-none" 
                  placeholder="Misol: 1-sonli poliklinika" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Faoliyat turi</label>
                <select 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none shadow-sm dark:shadow-none" 
                  value={form.type} 
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="government">Davlat xizmatlari</option>
                  <option value="medical">Tibbiyot muassasasi</option>
                  <option value="bank">Bank va moliya</option>
                  <option value="other">Boshqa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Manzil</label>
                <input 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm dark:shadow-none" 
                  placeholder="To'liq manzilni kiriting" 
                  value={form.address} 
                  onChange={(e) => setForm({ ...form, address: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Aloqa telefoni</label>
                <input 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm dark:shadow-none" 
                  placeholder="+998 00 000 00 00" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Qo'shimcha ma'lumot</label>
              <textarea 
                className="w-full px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all min-h-[100px] resize-y shadow-sm dark:shadow-none" 
                placeholder="Idora haqida qisqacha ma'lumot..." 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto min-w-[150px] justify-center">
                {loading ? 'Saqlanmoqda...' : (editingId ? 'O\'zgarishlarni saqlash' : 'Idorani qo\'shish')}
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
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Nomi</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Turi</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Manzil</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Xizmatlar</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {orgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{org.name}</div>
                    <div className="text-xs text-slate-500 mt-1">{org.phone || 'Telefon yo\'q'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      org.type === 'government' ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 
                      org.type === 'medical' ? 'bg-green-100 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 
                      org.type === 'bank' ? 'bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20' : 
                      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                    }`}>
                      {org.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{org.address}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                         {org.services?.length || 0}
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEdit(org)} 
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium px-3 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors mr-2"
                    >
                      Tahrirlash
                    </button>
                    <button 
                      onClick={() => handleDelete(org.id)} 
                      className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium px-3 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orgs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
                 <span className="text-2xl opacity-50">🏢</span>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Hali idoralar qo'shilmagan</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Yangi idora qo'shish uchun yuqoridagi tugmadan foydalaning.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
