'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, setTokens } from '@/lib/auth';
import api from '@/lib/api';
import { Clock, CheckCircle2, Phone, ArrowRight, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot_password';
type RegisterStep = 'details' | 'otp_verification';
type ForgotStep = 'phone' | 'reset_otp_and_password';

export default function LoginPage() {
  const router = useRouter();
  
  // State
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('details');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('phone');
  
  // Fields
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']); 
  const [showPass, setShowPass] = useState(false);

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
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

  // --------------- HELPERS ---------------
  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length <= 6) {
      const newCode = [...code];
      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i];
      }
      setCode(newCode);
      if (pasted.length === 6) inputRefs.current[5]?.focus();
      else inputRefs.current[pasted.length]?.focus();
    }
  };

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setRegisterStep('details');
    setForgotStep('phone');
    setError('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setCode(['', '', '', '', '', '']);
  };

  // --------------- LOGIN FLOW ---------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { phone, password });
      const { access_token, refresh_token, user } = res.data.data;
      setTokens(access_token, refresh_token);
      import('@/lib/auth').then((m) => m.setUser(user));
      
      const role = user?.role;
      if (role === 'admin' || role === 'superadmin') router.push('/admin');
      else router.push('/dashboard');
    } catch (err: unknown) {
      setError("Telefon raqam yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  // --------------- REGISTER FLOW ---------------
  const triggerRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) return setError("Parol kamida 6 belgidan iborat bo'lishi kerak");
    if (password !== confirmPassword) return setError("Parollar mos kelmadi, tekshiring");

    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone });
      setRegisterStep('otp_verification');
      setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setError("Kodni yuborishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const completeRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');
    if (fullCode.length < 6) return setError("Kodni to'liq kiriting");

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        phone,
        otp_code: fullCode,
        password,
        full_name: phone
      });
      const { access_token, refresh_token, user } = res.data.data;
      setTokens(access_token, refresh_token);
      import('@/lib/auth').then((m) => m.setUser(user));
      router.push('/dashboard');
    } catch (err: unknown) {
      setError("Tasdiqlash kodi noto'g'ri");
      setCode(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  // --------------- FORGOT PASSWORD FLOW ---------------
  const triggerForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { phone });
      setForgotStep('reset_otp_and_password');
      setCountdown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      setError("Xatolik: Bunday raqam topilmadi yoki sms tizimi band");
    } finally {
      setLoading(false);
    }
  };

  const completePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) return setError("Yangi parol kamida 6 belgidan iborat bo'lishi kerak");
    if (password !== confirmPassword) return setError("Parollar mos kelmadi");
    
    const fullCode = code.join('');
    if (fullCode.length < 6) return setError("Kodni to'liq kiriting");

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        phone,
        otp_code: fullCode,
        new_password: password
      });
      setSuccessMsg("Parol muvaffaqiyatli yangilandi! Endi tizimga kirishingiz mumkin.");
      setTimeout(() => switchMode('login'), 3000);
    } catch (err: unknown) {
      setError("Tasdiqlash kodi noto'g'ri yoki yaroqsiz");
      setCode(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  // --------------- UI RENDERERS ---------------
  const renderOtpInputs = () => (
    <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
      {code.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleOtpInput(i, e.target.value)}
          onKeyDown={(e) => handleOtpKeyDown(i, e)}
          className="w-12 h-14 text-center text-2xl font-bold bg-slate-800/50 text-white rounded-xl border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      ))}
    </div>
  );

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className={`w-full max-w-md mx-auto px-4 relative z-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              {authMode === 'forgot_password' ? <ShieldAlert className="w-6 h-6 text-white" /> : <Clock className="w-6 h-6 text-white" />}
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">Navbat</span>
              <span className="text-2xl font-bold text-amber-400">.uz</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
             {authMode === 'login' ? "Tizimga kirish" : authMode === 'register' ? "Ro'yxatdan o'tish" : "Parolni yangilash"}
          </h1>
          <p className="text-slate-400 text-sm">
             {authMode === 'login' && "Telefon raqam va parolingizni kiritib profilingizga kiring"}
             {authMode === 'register' && registerStep === 'details' && "Ma'lumotlaringizni kiritib o'zingizga profil yarating"}
             {authMode === 'register' && registerStep === 'otp_verification' && "Telefoningizga kelgan kodni kiriting"}
             {authMode === 'forgot_password' && "Parolingizni unutgan bo'lsangiz SMS kod orqali uni qayta tiklang"}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 md:p-10 glow flex flex-col gap-5">
          
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 flex items-center gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-sm text-green-400 flex items-center gap-2">
              <span>✔️</span><span>{successMsg}</span>
            </div>
          )}

          {/* ======================= LOGIN ======================= */}
          {authMode === 'login' && (
             <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Telefon raqam</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                   <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" required className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white outline-none border border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50" />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Parol</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                   <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Parolingizni kiriting" required className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 rounded-xl text-white outline-none border border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50" />
                   <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                     {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                 </div>
                 <div className="text-right mt-2">
                    <button type="button" onClick={() => switchMode('forgot_password')} className="text-sm text-indigo-400 hover:text-indigo-300">Parolni unutdimmi?</button>
                 </div>
               </div>

               <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                 {loading ? 'Kirilmoqda...' : 'Tizimga Kirish'}
               </button>
             </form>
          )}

          {/* ======================= REGISTER ======================= */}
          {authMode === 'register' && registerStep === 'details' && (
             <form onSubmit={triggerRegisterOtp} className="space-y-5 animate-fade-in">
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Telefon raqam</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                   <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" required className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white outline-none border border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50" />
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Yangi parol o'rnating</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                   <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kamida 6 belgi" required className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 rounded-xl text-white outline-none border border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50" />
                   <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                     {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                   </button>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Parol tasdig'i</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                   <input type={showPass ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Yuqoridagi parolni takrorlang" required className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white outline-none border border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50" />
                 </div>
               </div>

               <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2 text-base">
                 {loading ? 'Kuting...' : "Ro'yxatdan o'tish"}
               </button>
             </form>
          )}

          {authMode === 'register' && registerStep === 'otp_verification' && (
             <form onSubmit={completeRegister} className="space-y-6 animate-fade-in">
                <div className="text-center text-sm text-slate-300 mb-2">
                   Biz <span className="text-indigo-400 font-semibold">{phone}</span> raqamiga tasdiqlash kodini jo'natdik.
                </div>
                {renderOtpInputs()}
                <div className="text-center mt-3 text-xs text-slate-400">
                    Test kod: <span className="text-indigo-400">111111</span>. 
                    {countdown > 0 ? ` (${countdown}s)` : <button type="button" className="text-indigo-400 ml-2 hover:underline" onClick={triggerRegisterOtp}>Qayta yuborish</button>}
                </div>
                <button type="submit" disabled={loading || code.join('').length < 6} className="btn-primary w-full justify-center py-3.5 text-base">
                  {loading ? 'Tasdiqlanmoqda...' : 'Tasdiqlash'}
                </button>
                <div className="text-center">
                   <button type="button" onClick={() => setRegisterStep('details')} className="text-xs text-slate-400 hover:text-white">← Bekor qilish / Orqaga</button>
                </div>
             </form>
          )}

          {/* ======================= FORGOT PASSWORD ======================= */}
          {authMode === 'forgot_password' && forgotStep === 'phone' && (
            <form onSubmit={triggerForgotOtp} className="space-y-5 animate-fade-in">
               <div>
                 <label className="block text-sm font-medium text-slate-300 mb-2">Telefon raqam</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                   <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" required className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white outline-none border border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50" />
                 </div>
               </div>
               <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2 text-base">
                 {loading ? 'Kuting...' : 'SMS Kodni Yuborish'}
               </button>
               <div className="text-center pt-2">
                  <button type="button" onClick={() => switchMode('login')} className="text-sm text-slate-400 hover:text-white">Ortga qaytish</button>
               </div>
            </form>
          )}

          {authMode === 'forgot_password' && forgotStep === 'reset_otp_and_password' && (
             <form onSubmit={completePasswordReset} className="space-y-5 animate-fade-in">
                <div className="text-center text-sm text-slate-300 mb-2">
                   Tasdiqlash kodi:
                </div>
                {renderOtpInputs()}
                
                <div className="pt-4 space-y-4">
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Yangi parol (kamida 6)" required className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white outline-none border border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Parolni takrorlang" required className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white outline-none border border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading || code.join('').length < 6} className="btn-primary w-full justify-center py-3.5 text-base">
                  {loading ? 'Yangilanmoqda...' : 'Parolni Yangilash'}
                </button>
                <div className="text-center pt-2">
                   <button type="button" onClick={() => switchMode('login')} className="text-xs text-slate-400 hover:text-white">← Tizimga kirishga o'tish</button>
                </div>
             </form>
          )}

          {/* ======================= GLOBAL TOGGLE ACTIONS ======================= */}
          {authMode !== 'forgot_password' && (
             <div className="flex flex-col items-center gap-4 mt-2">
               <div className="flex items-center gap-4 w-full">
                 <div className="flex-1 h-px bg-slate-700/50"></div>
                 <span className="text-slate-500 text-sm">yoki</span>
                 <div className="flex-1 h-px bg-slate-700/50"></div>
               </div>
               
               <p className="text-center text-slate-400 text-sm">
                 {authMode === 'register' ? "Hisobingiz bormi? " : "Hisobingiz yo'qmi? "}
                 <button
                   type="button"
                   onClick={() => switchMode(authMode === 'register' ? 'login' : 'register')}
                   className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                 >
                   {authMode === 'register' ? 'Tizimga kirish' : "Ro'yxatdan o'tish"}
                 </button>
               </p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
