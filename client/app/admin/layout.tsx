'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';
import api from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
      return;
    }

    api
      .get('/users/me')
      .then((res) => {
        const role = res.data.data?.role;
        if (role === 'admin' || role === 'superadmin') {
          setIsAdmin(true);
        } else {
          router.push('/');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            ← Saytga qaytish
          </button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex gap-2 mb-6 bg-white rounded-lg p-2 shadow-sm">
          {[
            { href: '/admin', label: 'Dashboard' },
            { href: '/admin/organizations', label: 'Idoralar' },
            { href: '/admin/services', label: 'Xizmatlar' },
            { href: '/admin/users', label: 'Foydalanuvchilar' },
            { href: '/admin/tickets', label: 'Navbatlar' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
