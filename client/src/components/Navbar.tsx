'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Clock, User, Sun, Moon, Globe } from 'lucide-react';
import { getUser, clearTokens } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Language } from '@/translations';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setUser(getUser());
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
    { href: '/', label: t('nav.home') },
    { href: '/dashboard', label: t('nav.orgs') },
    { href: '/dashboard', label: t('nav.get_ticket') },
    { href: '/dashboard', label: t('nav.my_tickets') },
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
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 shadow-lg shadow-indigo-500/10'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50 uppercase font-medium text-sm"
              >
                {lang}
              </button>
              
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-24 py-2 glass rounded-xl shadow-xl z-50 border border-slate-200 dark:border-slate-700/50">
                    {['uz', 'ru', 'en'].map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l as Language); setLangOpen(false); }}
                        className={`w-full text-center px-4 py-2 text-sm uppercase font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${lang === l ? 'text-indigo-500' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="relative group ml-2">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-700 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-slate-700/50">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <span className="truncate max-w-[120px]">{user.full_name || user.phone}</span>
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-56 py-2 glass rounded-xl shadow-xl shadow-black/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 border border-slate-200 dark:border-slate-700/50">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/50 mb-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('nav.logged_in_as')}</p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.full_name || user.phone}</p>
                  </div>
                  <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    {t('nav.profile')}
                  </Link>
                  <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    {t('nav.my_queue')}
                  </Link>
                  <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-sm py-2 px-5 ml-2"
              >
                <User className="w-4 h-4 mr-2" />
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-light animate-slide-up border-t border-slate-200 dark:border-slate-700/50">
          <div className="px-4 py-4 space-y-2">
            
            <div className="flex items-center gap-2 mb-4 px-4">
              <button
                onClick={toggleTheme}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Kunduzgi' : 'Kechki'}
              </button>
              
              <div className="flex gap-2">
                {['uz', 'ru', 'en'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l as Language)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center uppercase text-sm font-medium ${lang === l ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700/50 space-y-2">
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 px-4">
                  {t('nav.logged_in_as')} {user.full_name || user.phone}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-center bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 text-sm py-3 rounded-xl transition-colors font-medium border border-red-200 dark:border-red-500/20"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center btn-primary text-sm py-3 mt-2"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
