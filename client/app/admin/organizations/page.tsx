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

  if (loading && !orgs.length) return <div className="text-gray-500">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Idoralar</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', type: 'government', address: '', phone: '', description: '' }); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          {showForm ? 'Bekor qilish' : '+ Yangi idora'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input className="border rounded-lg px-4 py-2" placeholder="Nomi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select className="border rounded-lg px-4 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="government">Davlat</option>
              <option value="medical">Tibbiyot</option>
              <option value="bank">Bank</option>
              <option value="other">Boshqa</option>
            </select>
            <input className="border rounded-lg px-4 py-2" placeholder="Manzil" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            <input className="border rounded-lg px-4 py-2" placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <textarea className="border rounded-lg px-4 py-2 w-full" placeholder="Tavsif" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">{editingId ? "Saqlash" : "Qo'shish"}</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nomi</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Turi</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Manzil</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Xizmatlar</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{org.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${org.type === 'government' ? 'bg-blue-100 text-blue-800' : org.type === 'medical' ? 'bg-green-100 text-green-800' : org.type === 'bank' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {org.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{org.address}</td>
                <td className="px-4 py-3 text-sm">{org.services?.length || 0}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleEdit(org)} className="text-indigo-600 hover:text-indigo-800 mr-3">Tahrirlash</button>
                  <button onClick={() => handleDelete(org.id)} className="text-red-600 hover:text-red-800">O'chirish</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orgs.length === 0 && <div className="text-center py-8 text-gray-500">Idoralar topilmadi</div>}
      </div>
    </div>
  );
}
