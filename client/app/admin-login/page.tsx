'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setTokens } from '@/lib/auth';
import api from '@/lib/api';
import { Shield, ArrowRight, Lock } from 'lucide-react';

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
      const msg = err instanceof Error ? err.message : "Parol noto'g'ri";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-md mx-auto px-4 relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Admin</span>
              <span className="text-2xl font-bold text-red-400">.uz</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Xavfsiz Kirish
          </h1>
          <p className="text-slate-400">
            Tizim boshqaruv paneliga kirish uchun parolni kiriting
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 md:p-10 glow animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Boshqaruvchi paroli
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting..."
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Tekshirilmoqda...
                </span>
              ) : (
                <>
                  Tizimga Kirish
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <div className="text-center pt-2 border-t border-slate-700/50 mt-4">
              <a href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                ← Foydalanuvchi sifatida kirish
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
