import Link from 'next/link';
import { Clock, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient">Navbat</span>
                <span className="text-xl font-bold text-amber-400">.uz</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Davlat va nodavlat tashkilotlar uchun zamonaviy onlayn navbat tizimi. Vaqtingizni tejang!
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sahifalar</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Bosh sahifa' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-indigo-400 text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kategoriyalar</h3>
            <ul className="space-y-2">
              {['Banklar', 'Shifoxonalar', 'Davlat xizmatlari', 'Hokimiyat', 'Soliq'].map((item) => (
                <li key={item}>
                  <span className="text-slate-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bog'lanish</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-indigo-400" />
                +998 90 123 45 67
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-indigo-400" />
                info@navbat.uz
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Toshkent, O'zbekiston
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700/50 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 Navbat.uz — Barcha huquqlar himoyalangan
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-xs">O'zbekiston rusumida 🇺🇿</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
