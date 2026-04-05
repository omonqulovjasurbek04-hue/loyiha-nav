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

  if (loading) return <div className="text-gray-500">Yuklanmoqda...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Foydalanuvchilar</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Telefon</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ism</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rol</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Holat</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sana</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-sm">{u.phone}</td>
                <td className="px-4 py-3">{u.full_name || '-'}</td>
                <td className="px-4 py-3">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                  >
                    <option value="citizen">Fuqaro</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.is_active ? 'Faol' : 'Bloklangan'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{u.tickets?.length || 0} navbat</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="text-center py-8 text-gray-500">Foydalanuvchilar topilmadi</div>}
      </div>
    </div>
  );
}
