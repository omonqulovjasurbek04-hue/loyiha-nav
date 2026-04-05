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

  if (loading && !services.length) return <div className="text-gray-500">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Xizmatlar</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          {showForm ? 'Bekor qilish' : '+ Yangi xizmat'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <input className="border rounded-lg px-4 py-2 w-full" placeholder="Xizmat nomi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-3 gap-4">
            <select className="border rounded-lg px-4 py-2" value={form.org_id} onChange={(e) => setForm({ ...form, org_id: e.target.value })} required>
              <option value="">Idorani tanlang</option>
              {orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <input className="border rounded-lg px-4 py-2" type="number" placeholder="Davomiylik (daqiqa)" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: parseInt(e.target.value) })} />
            <input className="border rounded-lg px-4 py-2" type="number" placeholder="Kunlik limit" value={form.daily_limit} onChange={(e) => setForm({ ...form, daily_limit: parseInt(e.target.value) })} />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Qo'shish</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Xizmat</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Idora</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Davomiylik</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Limit</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Holat</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-sm">{s.organization?.name || '-'}</td>
                <td className="px-4 py-3 text-sm">{s.duration_minutes} daq</td>
                <td className="px-4 py-3 text-sm">{s.daily_limit || '∞'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${s.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {s.is_active ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && <div className="text-center py-8 text-gray-500">Xizmatlar topilmadi</div>}
      </div>
    </div>
  );
}
