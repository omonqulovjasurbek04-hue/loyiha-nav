'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Clock, User } from 'lucide-react';
import { getUser, clearTokens } from '@/lib/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
    
    // Interval check just to be safe across tabs (basic approach)
    const checkUser = () => setUser(getUser());
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [pathname]);

  const handleLogout = () => {
    clearTokens();
    setUser(null);
    router.push('/');
  };

  const links = [
    { href: '/', label: 'Bosh sahifa' },
    { href: '/dashboard', label: 'Tashkilotlar' },
    { href: '/dashboard', label: 'Navbat olish' },
    { href: '/dashboard', label: 'Mening navbatim' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gradient">Navbat</span>
              <span className="text-xl font-bold text-amber-400">.uz</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  {user.full_name || user.phone}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors font-medium border border-slate-700/50 hover:border-red-500/30 rounded-xl"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-sm py-2 px-5"
              >
                <User className="w-4 h-4 mr-2" />
                Kirish
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-light animate-slide-up">
          <div className="px-4 py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="pt-4 mt-2 border-t border-slate-700/50 space-y-2">
                <div className="text-sm font-medium text-slate-400 mb-2 px-4">
                  Salom, {user.full_name || user.phone}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm py-3 rounded-xl transition-colors font-medium border border-red-500/20"
                >
                  Tizimdan chiqish
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-primary text-sm py-3 mt-2"
              >
                Kirish
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
