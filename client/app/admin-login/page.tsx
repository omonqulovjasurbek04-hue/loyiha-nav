'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setTokens } from '@/lib/auth';
import api from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/admin-login', { password });
      const { access_token, refresh_token } = res.data.data;
      setTokens(access_token, refresh_token);
      router.push('/admin');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Parol noto\'g\'ri';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-red-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">🔑</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Boshqaruv paneliga kirish uchun parolni kiriting</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolni kiriting"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-lg"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Tekshirilmoqda...' : 'Kirish'}
          </button>
          <div className="text-center">
            <a href="/login" className="text-sm text-gray-500 hover:text-indigo-600">
              ← Foydalanuvchi sifatida kirish
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
