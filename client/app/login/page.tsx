'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, setTokens } from '@/lib/auth';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('+998');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const token = getAccessToken();
    if (token) router.push('/');
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
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
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
    const fullCode = code.join('');
    try {
      const res = await api.post('/auth/verify-otp', { phone, code: fullCode });
      const { access_token, refresh_token } = res.data.data;
      setTokens(access_token, refresh_token);
      const role = res.data.data?.user?.role;
      if (role === 'admin' || role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tasdiqlashda xatolik';
      setError(msg);
      setCode(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', animationDuration: '4s' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', animationDuration: '6s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', animationDuration: '5s' }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-md mx-4 transition-all duration-700 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <div className="p-8 md:p-10">
          {/* Logo + Title */}
          <div className="text-center mb-8">
            <div className="relative inline-flex mb-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
                }}
              >
                🎫
              </div>
              <div
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 animate-pulse"
                style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }}
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
              {step === 'phone' ? 'Xush Kelibsiz' : 'Kodni Kiriting'}
            </h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {step === 'phone' ? (
                'E-Navbat tizimiga kirish'
              ) : (
                <>
                  <span className="text-indigo-300 font-semibold">{phone}</span> ga yuborildi
                </>
              )}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* PHONE STEP */}
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label
                  className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Telefon raqam
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📱</div>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-white text-lg font-medium outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid rgba(99,102,241,0.7)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border = '1px solid rgba(255,255,255,0.12)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <button
                id="send-otp-btn"
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all duration-200"
                style={{
                  background: loading
                    ? 'rgba(99,102,241,0.4)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.4)',
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Yuborilmoqda...
                  </span>
                ) : (
                  'SMS Kodni Olish →'
                )}
              </button>

              <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Tizimga kirish orqali foydalanish shartlarini qabul qilasiz
              </p>
            </form>
          ) : (
            /* OTP STEP */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label
                  className="block text-xs font-semibold mb-4 uppercase tracking-wider text-center"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  6 xonali tasdiqlash kodi
                </label>
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-2xl font-bold text-white rounded-xl outline-none transition-all duration-150"
                      style={{
                        background: digit ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)',
                        border: digit
                          ? '1px solid rgba(99,102,241,0.7)'
                          : '1px solid rgba(255,255,255,0.12)',
                        boxShadow: digit ? '0 0 12px rgba(99,102,241,0.3)' : 'none',
                        caretColor: '#6366f1',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown */}
              <div className="text-center">
                {countdown > 0 ? (
                  <div
                    className="flex items-center justify-center gap-2 text-sm"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    <svg
                      className="w-4 h-4 animate-spin"
                      style={{ animationDuration: '2s' }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    Qayta yuborish:{' '}
                    <span className="text-indigo-300 font-bold">{countdown}s</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
                  >
                    Kodni qayta yuborish
                  </button>
                )}
              </div>

              <button
                id="verify-otp-btn"
                type="submit"
                disabled={loading || code.join('').length < 6}
                className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all duration-200"
                style={{
                  background:
                    loading || code.join('').length < 6
                      ? 'rgba(99,102,241,0.3)'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow:
                    loading || code.join('').length < 6
                      ? 'none'
                      : '0 8px 24px rgba(99,102,241,0.4)',
                }}
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
                  'Tizimga Kirish ✓'
                )}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setCode(['', '', '', '', '', '']);
                    setError('');
                  }}
                  className="text-xs transition-colors flex items-center gap-1"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  ← Raqamni o&apos;zgartirish
                </button>
                <div
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}
                >
                  Test: <span className="font-mono font-bold text-indigo-300">111111</span>
                </div>
              </div>
            </form>
          )}

          {/* Step indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: step === 'phone' ? '24px' : '8px',
                background: step === 'phone' ? '#6366f1' : 'rgba(255,255,255,0.2)',
              }}
            />
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: step === 'otp' ? '24px' : '8px',
                background: step === 'otp' ? '#6366f1' : 'rgba(255,255,255,0.2)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
