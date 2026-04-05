"use client";

import { useState } from 'react';

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('+998');
  const [code, setCode] = useState('');

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate OTP loading
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Login
    alert("Tizimga kirdingiz!");
    window.location.href = '/';
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full animate-slide-up relative overflow-hidden">
        {/* Dekorativ elementlar */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
           <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 animate-float cursor-pointer">
              <span className="text-3xl">🔐</span>
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">Xush Kelibsiz</h1>
           <p className="text-gray-400 text-sm">
             Navbat tizimidan to'liq foydalanish uchun tizimga kiring
           </p>
        </div>

        {step === 1 ? (
          <form onSubmit={sendOtp} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Telefon raqamingiz</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67" 
                className="input-glass text-lg tracking-wider font-medium"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full shadow-xl">
              Kodni Olish
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Davom etish orqali <a href="#" className="text-primary hover:underline">Foydalanish shartlariga</a> rozi bo'lasiz.
            </p>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-6 relative z-10">
            <div className="space-y-2 text-center">
              <label className="text-sm font-medium text-gray-300">
                <span className="text-primary font-bold">{phone}</span> raqamiga yuborilgan 5 xonali SMS kodni kiriting
              </label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="• • • • •" 
                maxLength={5}
                className="input-glass text-center text-3xl tracking-[1em] font-bold mt-4"
                required
                autoFocus
              />
            </div>
            
            <div className="pt-2">
               <button type="submit" className="btn-primary w-full shadow-xl">
                 Tizimga Kirish
               </button>
            </div>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Raqamni o'zgartirish
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
