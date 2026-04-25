'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';
import api from '@/lib/api';
import { LayoutDashboard, Building2, FileText, Users, Receipt, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/admin-login');
      return;
    }

    api
      .get('/users/me')
      .then((res) => {
        const role = res.data.data?.role;
        if (role === 'admin' || role === 'superadmin') {
          setIsAdmin(true);
        } else {
          router.push('/');
        }
      })
      .catch(() => router.push('/admin-login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/organizations', label: 'Idoralar', icon: Building2 },
    { href: '/admin/services', label: 'Xizmatlar', icon: FileText },
    { href: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
    { href: '/admin/tickets', label: 'Navbatlar', icon: Receipt },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-transparent">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-200 dark:border-slate-700/50 hidden md:flex flex-col sticky top-0 h-screen z-20 bg-white/50 dark:bg-transparent">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Admin<span className="text-indigo-600 dark:text-indigo-400">Panel</span></h1>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 hover:shadow-lg dark:hover:shadow-white/5 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Icon className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
           <button
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-500/10 hover:shadow-lg dark:hover:shadow-red-500/5 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-500/20 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              <ArrowLeft className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            Saytga qaytish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 relative h-screen overflow-y-auto">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="relative z-10 p-6 lg:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
