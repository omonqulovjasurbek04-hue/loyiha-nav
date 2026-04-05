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

  if (loading) return <div className="text-gray-500">Yuklanmoqda...</div>;

  const statusColors: Record<string, string> = {
    WAITING: 'bg-yellow-100 text-yellow-800',
    CALLED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    SKIPPED: 'bg-orange-100 text-orange-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Navbatlar</h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-lg px-4 py-2" />
      </div>

      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Jami', value: stats.total },
            { label: 'Kutmoqda', value: stats.waiting },
            { label: 'Chaqirildi', value: stats.called },
            { label: 'Yakunlandi', value: stats.completed },
            { label: 'Bekor', value: stats.skipped + stats.cancelled },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Telefon</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Xizmat</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Holat</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vaqt</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">#{t.ticket_number}</td>
                <td className="px-4 py-3 font-mono text-sm">{t.user?.phone || '-'}</td>
                <td className="px-4 py-3 text-sm">{t.queue?.service?.name || '-'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[t.status] || 'bg-gray-100'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(t.issued_at).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tickets.length === 0 && <div className="text-center py-8 text-gray-500">Navbatlar topilmadi</div>}
      </div>
    </div>
  );
}
