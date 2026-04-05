'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccessToken, setTokens, clearTokens } from '@/lib/auth';
import { getSocket } from '@/lib/socket';
import api from '@/lib/api';

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
  const [step, setStep] = useState<'phone' | 'otp' | 'main'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [services, setServices] = useState<{ id: string; name: string }[]>([]);
  const [myTicket, setMyTicket] = useState<Ticket | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [wsPosition, setWsPosition] = useState<number | null>(null);
  const [wsCalled, setWsCalled] = useState(false);
  const [wsWindow, setWsWindow] = useState<number | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setStep('main');
      fetchOrganizations();
      fetchMyTickets();
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!myTicket) return;

    const socket = getSocket();
    socket.emit('join_queue', { ticket_id: myTicket.id });

    const handleUpdate = (data: { position: number; waiting_count: number; estimated_wait: number }) => {
      setWsPosition(data.position);
      setQueueStatus(prev => prev ? { ...prev, waiting_count: data.waiting_count } : null);
    };

    const handleCalled = (data: { ticket_number: number; window_number: number }) => {
      setWsCalled(true);
      setWsWindow(data.window_number);
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('E-Navbat UZ', { body: `${data.window_number}-oynaga o'ting!` });
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      await api.post('/auth/send-otp', { phone: formattedPhone });
      setStep('otp');
      setCountdown(60);
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
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      const res = await api.post('/auth/verify-otp', { phone: formattedPhone, code: otp });
      const { access_token, refresh_token } = res.data.data;
      setTokens(access_token, refresh_token);
      setStep('main');
      fetchOrganizations();
      fetchMyTickets();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tasdiqlashda xatolik';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    setMyTicket(null);
    setSelectedOrg(null);
    setServices([]);
    setWsPosition(null);
    setWsCalled(false);
    setWsWindow(null);
    setStep('phone');
    setPhone('');
    setOtp('');
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

  if (step === 'phone') {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">N</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tizimga Kirish</h2>
            <p className="text-gray-500 mt-2">Telefon raqamingizni kiriting</p>
          </div>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998901234567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={loading}>
              {loading ? 'Yuborilmoqda...' : 'Kod yuborish'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Kodni Kiriting</h2>
            <p className="text-gray-500 mt-2">{phone} raqamiga kod yuborildi</p>
            {countdown > 0 && <p className="text-sm text-gray-400 mt-1">{countdown} soniya</p>}
          </div>
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasdiqlash kodi</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                maxLength={6}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={loading}>
              {loading ? 'Tekshirilmoqda...' : 'Kirish'}
            </button>
            <button type="button" onClick={() => setStep('phone')} className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Orqaga
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">
            Test rejimida kod: <span className="font-mono font-bold">111111</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">E-Navbat UZ</h2>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500">
          Chiqish
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {myTicket ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`rounded-xl shadow-lg p-6 text-white ${wsCalled ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
            <div className="text-center">
              <p className="text-white/80 mb-2">Sizning navbat raqamingiz</p>
              <div className="text-7xl font-bold mb-4">#{myTicket.ticket_number}</div>
              <p className="text-xl">{myTicket.service?.name || 'Xizmat'}</p>
              <div className="mt-6 p-4 bg-white/20 rounded-lg backdrop-blur">
                <p className="text-sm">Hozirgi raqam</p>
                <p className="text-3xl font-bold">{queueStatus?.current_number || '-'}</p>
              </div>
              <div className="mt-4 flex justify-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold">{wsPosition ?? queueStatus?.waiting_count ?? 0}</p>
                  <p className="text-sm text-white/70">Oldinda</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{Math.max(0, (wsPosition ?? queueStatus?.waiting_count ?? 0) * 15)}</p>
                  <p className="text-sm text-white/70">Daqiqa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Holatingiz</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${wsCalled ? 'bg-green-500' : myTicket.status === 'CALLED' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                <span className="font-medium">{statusLabel()}</span>
              </div>
              {queueStatus && (
                <div className="text-sm text-gray-500">
                  Jami berilgan: {queueStatus.total_issued} ta chipta
                </div>
              )}
              <button
                onClick={handleCancelTicket}
                disabled={loading}
                className="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                {loading ? 'Bekor qilinmoqda...' : 'Navbatdan chiqish'}
              </button>
            </div>
          </div>
        </div>
      ) : selectedOrg ? (
        <div>
          <button
            onClick={() => { setSelectedOrg(null); setServices([]); }}
            className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            ← Orqaga
          </button>
          <h2 className="text-2xl font-bold mb-6">{selectedOrg.name}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleGetTicket(service.id)}
                disabled={loading}
                className="bg-white rounded-xl shadow-lg p-6 hover:border-indigo-500 border-2 border-transparent transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">🎫</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-500">Navbat olish</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-6">Idoralarni tanlang</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrg(org)}
                className="bg-white rounded-xl shadow-lg p-6 hover:border-indigo-500 border-2 border-transparent transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">
                      {org.type === 'government' ? '🏛️' :
                       org.type === 'medical' ? '🏥' :
                       org.type === 'bank' ? '🏦' : '🏢'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{org.name}</h3>
                    <p className="text-sm text-gray-500">{org.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {organizations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-4">📭</p>
              <p>Hozircha idoralar mavjud emas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
