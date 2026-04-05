import Link from 'next/link';
import { ArrowRight, Clock, Users, Shield, Zap, Building2, Heart, Landmark, GraduationCap, Banknote, CheckCircle2, Star, ChevronRight, Timer } from 'lucide-react';

const categories = [
  { icon: Banknote, label: 'Banklar', count: 24, color: 'from-emerald-500 to-teal-600', desc: 'Kredit, karta, hisob' },
  { icon: Heart, label: 'Shifoxonalar', count: 18, color: 'from-rose-500 to-pink-600', desc: 'Shifokor, tahlil, kasalxona' },
  { icon: Landmark, label: 'Davlat xizmatlari', count: 32, color: 'from-blue-500 to-cyan-600', desc: 'Pasport, guvohnoma, litsenziya' },
  { icon: Building2, label: 'Hokimiyat', count: 15, color: 'from-amber-500 to-orange-600', desc: 'Qabulxona, ariza, murojaat' },
  { icon: GraduationCap, label: 'Ta\'lim', count: 12, color: 'from-violet-500 to-purple-600', desc: 'Universitet, maktab, kurslar' },
  { icon: Shield, label: 'Soliq', count: 8, color: 'from-indigo-500 to-blue-600', desc: 'Soliq hisoboti, maslahat' },
];

const stats = [
  { value: '50+', label: 'Tashkilotlar', icon: Building2 },
  { value: '10K+', label: 'Foydalanuvchilar', icon: Users },
  { value: '99.9%', label: 'Ishonchlilik', icon: Shield },
  { value: '3 daq', label: "O'rtacha kutish", icon: Timer },
];

const features = [
  { icon: Clock, title: 'Real-vaqt kuzatish', desc: "Navbatingiz holatini jonli kuzating — qancha odam oldingizda, taxminiy kutish vaqti" },
  { icon: Zap, title: 'Tez va oson', desc: "3 bosqichda navbat oling: tashkilot tanlang, xizmatni belgilang, vaqtni band qiling" },
  { icon: Shield, title: 'Xavfsiz tizim', desc: "Shaxsiy ma'lumotlaringiz shifrlangan holda saqlanadi, xavfsiz autentifikatsiya" },
  { icon: Users, title: "Barcha uchun qulay", desc: "Oddiy interfeys — yoshdan kattaga, har kim osongina foydalana oladi" }
];

export default function LandingPage() {
  return (
    <div className="pt-8 w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-indigo-300 text-sm font-medium">Tizim ishlamoqda</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
                <span className="text-white">Onlayn </span>
                <span className="text-gradient">Navbat</span>
                <br />
                <span className="text-white">Tizimi</span>
              </h1>

              <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl">
                Endi navbatda kutish shart emas! Internet orqali navbat oling, 
                vaqtingizni bilib, kerakli paytda tashkilotga boring.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/dashboard" className="btn-primary text-base py-3 px-8">
                  Navbat olish
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/dashboard" className="btn-secondary text-base py-3 px-8">
                  Tashkilotlarni ko'rish
                </Link>
              </div>

              {/* Mini Stats */}
              <div className="flex flex-wrap gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">{stat.value}</div>
                      <div className="text-slate-400 text-xs">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Queue Card Preview */}
            <div className="hidden lg:block animate-fade-in relative z-10" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                {/* Main Card */}
                <div className="glass rounded-3xl p-8 glow relative z-20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Banknote className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Ipoteka Bank</div>
                        <div className="text-slate-400 text-sm">Yunusobod filiali</div>
                      </div>
                    </div>
                    <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                      Faol
                    </div>
                  </div>

                  <div className="bg-indigo-500/10 rounded-2xl p-6 mb-6 text-center">
                    <div className="text-slate-400 text-sm mb-1">Sizning raqamingiz</div>
                    <div className="text-6xl font-black text-gradient mb-2">A-047</div>
                    <div className="text-slate-400 text-sm">Karta xizmatlari</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">3</div>
                      <div className="text-slate-400 text-xs">Oldingizda</div>
                    </div>
                    <div className="text-center border-x border-slate-700/50">
                      <div className="text-2xl font-bold text-amber-400">~12</div>
                      <div className="text-slate-400 text-xs">Daqiqa</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">A-044</div>
                      <div className="text-slate-400 text-xs">Hozirgi</div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 glass rounded-2xl p-4 animate-float shadow-xl z-30" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white text-sm font-medium">Navbat tasdiqlandi!</span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 animate-float shadow-xl z-30" style={{ animationDelay: '1.5s' }}>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span className="text-white text-sm font-medium">4.9 reyting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative z-10 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tashkilot <span className="text-gradient">kategoriyalari</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Bank, shifoxona, davlat idoralari — barcha tashkilotlarga onlayn navbat oling
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href="/dashboard"
                className="glass rounded-2xl p-6 card-hover group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-7 h-7 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{cat.label}</h3>
                <p className="text-slate-400 text-sm mb-3">{cat.desc}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-slate-500 text-xs">{cat.count} tashkilot</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Qanday <span className="text-gradient">ishlaydi?</span>
            </h2>
            <p className="text-slate-400 text-lg">Faqat 3 bosqichda navbat oling</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Tashkilotni tanlang', desc: 'Kerakli tashkilot va xizmat turini qidiring.', color: 'from-indigo-500 to-blue-600' },
              { step: '02', title: 'Onlayn navbat oling', desc: "Kerakli bo'limga tizim orqali yoziling va tasdiqlang", color: 'from-purple-500 to-violet-600' },
              { step: '03', title: 'Navbatga boring', desc: "Belgilangan raqam yaqinlashganda binosiga boring!", color: 'from-emerald-500 to-teal-600' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="glass rounded-2xl p-8 card-hover text-center h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl font-black text-white">{item.step}</span>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                    <ChevronRight className="w-8 h-8 text-indigo-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative z-10 w-full bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Nima uchun <span className="text-gradient">Navbat.uz?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-8 card-hover group w-full">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-colors">
                  <f.icon className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 z-10 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-10 sm:p-14 text-center glow relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Hoziroq navbat oling
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              Vaqtingizni tejang — onlayn navbat bilan kutish yo'q, asabingiz tinch!
            </p>
            <Link href="/dashboard" className="btn-primary text-lg py-4 px-10">
              Boshlash
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
