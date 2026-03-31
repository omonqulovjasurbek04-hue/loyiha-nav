import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Lock, Mail, Phone, Eye, EyeOff, Clock,
  ArrowRight, CheckCircle2
} from 'lucide-react'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Backend integration
  }

  return (
    <div className="pt-24 pb-16 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-up">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">Navbat</span>
              <span className="text-2xl font-bold text-amber-400">.uz</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isRegister ? "Ro'yxatdan o'tish" : 'Tizimga kirish'}
          </h1>
          <p className="text-slate-400">
            {isRegister
              ? "Yangi hisob yarating va navbat oling"
              : "Hisobingizga kiring va navbatingizni kuzating"
            }
          </p>
        </div>

        {/* Login/Register Form */}
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 glow animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-5">
            {/* Name (Register only) */}
            {isRegister && (
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  To'liq ism
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Ism Familiya"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Telefon raqam
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email (Register only) */}
            {isRegister && (
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email <span className="text-slate-500">(ixtiyoriy)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Parolni kiriting"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 rounded-xl text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Register only) */}
            {isRegister && (
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Parolni tasdiqlang
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Parolni qayta kiriting"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 rounded-xl text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Remember & Forgot */}
            {!isRegister && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-400">Eslab qolish</span>
                </label>
                <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  Parolni unutdim
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full justify-center py-3.5 mt-6 text-base">
            {isRegister ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Ro'yxatdan o'tish
              </>
            ) : (
              <>
                Kirish
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-700/50"></div>
            <span className="text-slate-500 text-sm">yoki</span>
            <div className="flex-1 h-px bg-slate-700/50"></div>
          </div>

          {/* Toggle Login/Register */}
          <p className="text-center text-slate-400 text-sm">
            {isRegister ? "Hisobingiz bormi? " : "Hisobingiz yo'qmi? "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              {isRegister ? 'Kirish' : "Ro'yxatdan o'tish"}
            </button>
          </p>
        </form>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: Clock, label: 'Tez navbat' },
            { icon: CheckCircle2, label: 'Ishonchli' },
            { icon: User, label: 'Qulay' },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-2">
                <f.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-slate-500 text-xs">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
