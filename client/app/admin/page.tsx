'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

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

  if (loading) return <div className="text-gray-500">Yuklanmoqda...</div>;

  const cards = [
    { label: 'Idoralar', value: stats?.total_organizations, color: 'bg-blue-500' },
    { label: 'Xizmatlar', value: stats?.total_services, color: 'bg-green-500' },
    { label: 'Foydalanuvchilar', value: stats?.total_users, color: 'bg-purple-500' },
    { label: 'Jami navbatlar', value: stats?.total_tickets, color: 'bg-orange-500' },
    { label: 'Bugungi navbatlar', value: stats?.today_tickets, color: 'bg-indigo-500' },
    { label: 'Aktiv navbatlar', value: stats?.active_tickets, color: 'bg-red-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <div className={`w-10 h-10 ${card.color} rounded-lg mb-3`} />
            <p className="text-3xl font-bold text-gray-900">{card.value ?? 0}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
