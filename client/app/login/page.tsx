'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, setTokens } from '@/lib/auth';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('+998');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/send-otp', { phone });
      setStep('otp');
      setCountdown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'OTP yuborishda xatolik';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { phone, code });
      const { access_token, refresh_token } = res.data.data;
      setTokens(access_token, refresh_token);
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tasdiqlashda xatolik';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-indigo-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Xush Kelibsiz</h1>
          <p className="text-gray-500 text-sm">
            Navbat tizimidan to'liq foydalanish uchun tizimga kiring
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqamingiz</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998901234567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Yuborilmoqda...' : 'Kodni Olish'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <label className="block text-sm text-gray-600 mb-2">
                <span className="font-bold text-indigo-600">{phone}</span> raqamiga yuborilgan kodni kiriting
              </label>
              {countdown > 0 && <p className="text-xs text-gray-400">{countdown} soniya qoldi</p>}
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-3xl tracking-widest focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mt-4"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Tekshirilmoqda...' : 'Tizimga Kirish'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
              >
                Raqamni o'zgartirish
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Test rejimida kod: <span className="font-mono font-bold">111111</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
