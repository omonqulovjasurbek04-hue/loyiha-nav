'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, clearTokens } from '@/lib/auth';
import { getSocket } from '@/lib/socket';
import api from '@/lib/api';
import {
  Search, MapPin, Clock, Star, Users, Phone, ChevronRight, Filter, ChevronLeft, Calendar, User, FileText, Building2,
  Banknote, Heart, Landmark, GraduationCap, Shield, CheckCircle2, ArrowRight
} from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  type: string;
  address: string;
}

interface Ticket {
  id: string;
  ticket_number: number;
  status: string;
  service?: { name: string };
  queue?: { id: string };
}

interface QueueStatus {
  current_number: number;
  total_issued: number;
  waiting_count: number;
}

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [myTicket, setMyTicket] = useState<Ticket | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wsPosition, setWsPosition] = useState<number | null>(null);
  const [wsCalled, setWsCalled] = useState(false);
  const [wsWindow, setWsWindow] = useState<number | null>(null);
  
  // UI states
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/login');
      return;
    }
    setReady(true);
    fetchOrganizations();
    fetchMyTickets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!myTicket) return;

    const socket = getSocket();
    if (!socket) return;
    
    socket.emit('join_queue', { ticket_id: myTicket.id });

    const handleUpdate = (data: { position: number; waiting_count: number; estimated_wait: number }) => {
      setWsPosition(data.position);
      setQueueStatus(prev => prev ? { ...prev, waiting_count: data.waiting_count } : null);
    };

    const handleCalled = (data: { ticket_number: number; window_number: number }) => {
      setWsCalled(true);
      setWsWindow(data.window_number);
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('Navbat.uz', { body: `${data.window_number}-oynaga o'ting!` });
      }
    };

    socket.on('queue_update', handleUpdate);
    socket.on('ticket_called', handleCalled);

    return () => {
      socket.off('queue_update', handleUpdate);
      socket.off('ticket_called', handleCalled);
      socket.emit('leave_queue', { ticket_id: myTicket.id });
    };
  }, [myTicket]);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/organizations');
      setOrganizations(res.data.data || []);
    } catch {
      /* ignore */
    }
  };

  const fetchMyTickets = async () => {
    try {
      const res = await api.get('/tickets/my');
      const tickets = res.data.data || [];
      const active = tickets.find((t: Ticket) => t.status === 'WAITING' || t.status === 'CALLED');
      if (active) {
        setMyTicket(active);
        fetchQueueStatus(active.queue?.id || '');
      }
    } catch {
      /* ignore */
    }
  };

  const fetchQueueStatus = async (queueId: string) => {
    if (!queueId) return;
    try {
      const res = await api.get(`/queue/${queueId}/status`);
      setQueueStatus(res.data.data);
    } catch {
      /* ignore */
    }
  };

  const handleLogout = () => {
    clearTokens();
    router.replace('/login');
  };

  const handleSelectOrg = async (org: Organization) => {
    setSelectedOrg(org);
    try {
      const res = await api.get(`/organizations/${org.id}/services`);
      setServices(res.data.data || []);
    } catch {
      /* ignore */
    }
  };

  const handleGetTicket = async (serviceId: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/tickets', { service_id: serviceId });
      setMyTicket(res.data.data);
      setSelectedOrg(null);
      setServices([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Navbat olishda xatolik';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!myTicket) return;
    setLoading(true);
    try {
      await api.delete(`/tickets/${myTicket.id}`);
      setMyTicket(null);
      setWsPosition(null);
      setWsCalled(false);
      setWsWindow(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bekor qilishda xatolik';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = useCallback(() => {
    if (!myTicket) return '';
    if (wsCalled) return `Chaqirildi! ${wsWindow}-oyna`;
    if (myTicket.status === 'CALLED') return 'Chaqirildi!';
    return 'Kutmoqda...';
  }, [myTicket, wsCalled, wsWindow]);

  const getOrgIconColor = (type: string) => {
    switch(type) {
      case 'government': return { icon: Landmark, color: 'from-blue-500 to-cyan-600' };
      case 'medical': return { icon: Heart, color: 'from-rose-500 to-pink-600' };
      case 'bank': return { icon: Banknote, color: 'from-emerald-500 to-teal-600' };
      default: return { icon: Building2, color: 'from-amber-500 to-orange-600' };
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(search.toLowerCase()) || org.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        


        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {myTicket ? (
          /* ================================== */
          /*         MY TICKET DASHBOARD        */
          /* ================================== */
          <div className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-8">
              Mening <span className="text-gradient">navbatim</span>
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Ticket Card */}
              <div className="relative">
                <div className={`glass rounded-3xl p-8 glow h-full flex flex-col ${wsCalled ? 'shadow-green-500/20 shadow-2xl ring-1 ring-green-500/50' : ''}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-slate-900 dark:text-white font-semibold">{myTicket.service?.name || 'Xizmat'}</div>
                        <div className="text-slate-600 dark:text-slate-400 text-sm">{statusLabel()}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${wsCalled ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${wsCalled ? 'bg-green-500 dark:bg-green-400' : 'bg-yellow-500 dark:bg-yellow-400 animate-pulse'}`}></div>
                      {wsCalled ? 'Chaqirildi' : 'Kutmoqda'}
                    </div>
                  </div>

                  <div className={`rounded-2xl p-6 mb-6 text-center ${wsCalled ? 'bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-transparent' : 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-transparent'}`}>
                    <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">Sizning raqamingiz</div>
                    <div className={`text-7xl font-black mb-2 ${wsCalled ? 'text-green-600 dark:text-green-400' : 'text-gradient'}`}>
                      #{myTicket.ticket_number}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                    <div className="text-center glass-light rounded-2xl py-4 bg-white/50 dark:bg-transparent">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{wsPosition ?? queueStatus?.waiting_count ?? 0}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-xs">Sizdan orqada (kutmoqda)</div>
                    </div>
                    <div className="text-center glass-light rounded-2xl py-4 bg-white/50 dark:bg-transparent">
                      <div className="text-2xl font-bold text-amber-500 dark:text-amber-400">~{Math.max(0, (wsPosition ?? queueStatus?.waiting_count ?? 0) * 15)}</div>
                      <div className="text-slate-600 dark:text-slate-400 text-xs">Daqiqa kutish</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Action Card */}
              <div className="glass rounded-3xl p-8 flex flex-col justify-between bg-white/50 dark:bg-transparent">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Holat ma'lumotlari</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
                      <span className="text-slate-600 dark:text-slate-400">Hozirgi navbat:</span>
                      <span className="text-slate-900 dark:text-white font-bold text-lg">{queueStatus?.current_number ? `#${queueStatus.current_number}` : '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
                      <span className="text-slate-600 dark:text-slate-400">Jami berilgan:</span>
                      <span className="text-slate-900 dark:text-white font-medium">{queueStatus?.total_issued || 0} ta</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleCancelTicket}
                    disabled={loading}
                    className="w-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 py-4 rounded-xl font-medium transition-all duration-300"
                  >
                    {loading ? 'Bekor qilinmoqda...' : 'Navbatdan chiqish'}
                  </button>
                  <p className="text-xs text-slate-500 dark:text-slate-500 text-center mt-4">
                    Agar navbat kutishni xohlamasangiz, navbatdan chiqing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : selectedOrg ? (
          /* ================================== */
          /*         SERVICES SELECTION         */
          /* ================================== */
          <div className="animate-slide-up">
            <button
              onClick={() => { setSelectedOrg(null); setServices([]); }}
              className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-white transition-colors mb-6 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Orqaga qaytish
            </button>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedOrg.name}</h2>
            <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2 mb-8">
              <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> {selectedOrg.address}
            </p>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              Xizmat turini tanlang
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleGetTicket(service.id)}
                  disabled={loading}
                  className="glass rounded-xl p-6 text-left transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:ring-2 hover:ring-indigo-500 card-hover bg-white/50 dark:bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">🎫</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{service.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">Navbat olish uchun bosing</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {services.length === 0 && (
               <div className="text-center py-12 text-slate-500 glass rounded-2xl bg-white/50 dark:bg-transparent">
                 <FileText className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                 <p>Ushbu tashkilotda xizmatlar mavjud emas</p>
               </div>
            )}
          </div>
        ) : (
          /* ================================== */
          /*       ORGANIZATIONS SELECTION      */
          /* ================================== */
          <div className="animate-slide-up">
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Barcha <span className="text-gradient">tashkilotlar</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Kerakli tashkilotni toping va navbat oling
              </p>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tashkilot nomini qidiring..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all bg-white/70 dark:bg-transparent"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                <span className="text-slate-900 dark:text-white font-semibold">{filteredOrgs.length}</span> ta tashkilot topildi
              </p>
            </div>

            {/* Organizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredOrgs.map((org) => {
                const style = getOrgIconColor(org.type);
                const IconComponent = style.icon;

                return (
                  <div key={org.id} className="glass rounded-2xl p-6 card-hover group cursor-pointer bg-white/50 dark:bg-transparent" onClick={() => handleSelectOrg(org)}>
                    <div className="flex items-start gap-4 mb-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${style.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-slate-900 dark:text-white font-semibold text-lg truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{org.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500 dark:text-indigo-400" />
                          <span className="truncate">{org.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-slate-200 dark:border-slate-700/30">
                      <button className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-medium text-sm transition-colors group/link">
                        Xizmatlarni ko'rish
                        <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredOrgs.length === 0 && (
              <div className="text-center py-20 p-8 glass rounded-2xl bg-white/50 dark:bg-transparent">
                <Search className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-slate-900 dark:text-white text-xl font-semibold mb-2">Topilmadi</h3>
                <p className="text-slate-500 dark:text-slate-400">Boshqa kalit so'z bilan qidirib ko'ring yoki hozircha idoralar mavjud emas.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
