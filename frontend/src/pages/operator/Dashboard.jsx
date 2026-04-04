import { useState, useEffect, useCallback } from 'react'
import {
  Users, UserCheck, UserX, Clock, Bell,
  RefreshCw, CheckCircle2, Play, AlertTriangle, Loader2, LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import socket from '../../utils/socket'

export default function OperatorDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const orgId = user.organizationId

  const [queues, setQueues] = useState([])
  const [currentServing, setCurrentServing] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [orgName, setOrgName] = useState('')

  // Tashkilot ma'lumotini olish
  useEffect(() => {
    if (orgId) {
      api.get(`/organizations/${orgId}`)
        .then(({ data }) => { if (data.success) setOrgName(data.data.name + ' — ' + data.data.branch) })
        .catch(() => {})
    }
  }, [orgId])

  // Bugungi navbatlarni API dan yuklash
  const fetchQueues = useCallback(async () => {
    if (!orgId) return
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await api.get(`/queues/org/${orgId}?date=${today}`)
      if (data.success) {
        setQueues(data.data)
        const serving = data.data.find(q => q.status === 'called' || q.status === 'serving')
        setCurrentServing(serving || null)
      }
    } catch (e) {
      console.error('Navbatlarni yuklashda xato:', e)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    // Agar login qilinmagan bo'lsa yoki operator emas bo'lsa
    if (!user.id || (user.role !== 'operator' && user.role !== 'admin')) {
      navigate('/kirish')
      return
    }

    fetchQueues()

    // Vaqt soatini yangilash
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    // Socket xonasiga qo'shilish
    if (orgId) {
      socket.emit('join_org', orgId)
    }

    // Real-time yangilanish
    socket.on('queue_status_changed', (data) => {
      if (!data.orgId || data.orgId.toString() === orgId?.toString()) {
        fetchQueues()
      }
    })

    return () => {
      clearInterval(timer)
      socket.off('queue_status_changed')
    }
  }, [fetchQueues, orgId])

  // Keyingi navbatni chaqirish
  const handleCallNext = async () => {
    const nextQueue = queues.find(q => q.status === 'waiting')
    if (!nextQueue || actionLoading) return
    setActionLoading(true)
    try {
      // Joriy xizmat ko'rsatilayotganini tugatish
      if (currentServing) {
        await api.put(`/queues/${currentServing._id}/status`, { status: 'done' })
      }
      // Keyingisini chaqirish
      const { data } = await api.put(`/queues/${nextQueue._id}/status`, { status: 'called' })
      if (data.success) {
        socket.emit('call_next', {
          orgId,
          token: nextQueue.token,
          service: nextQueue.service,
          queueId: nextQueue._id
        })
        socket.emit('queue_updated', { orgId })
        await fetchQueues()
      }
    } catch (e) {
      console.error('Chaqirishda xato:', e)
    } finally {
      setActionLoading(false)
    }
  }

  // Xizmatni tugatish
  const handleComplete = async () => {
    if (!currentServing || actionLoading) return
    setActionLoading(true)
    try {
      await api.put(`/queues/${currentServing._id}/status`, { status: 'done' })
      socket.emit('queue_updated', { orgId })
      setCurrentServing(null)
      await fetchQueues()
    } catch (e) {
      console.error('Tugatishda xato:', e)
    } finally {
      setActionLoading(false)
    }
  }

  // Kelmagan — o'tkazib yuborish
  const handleSkip = async () => {
    if (!currentServing || actionLoading) return
    setActionLoading(true)
    try {
      await api.put(`/queues/${currentServing._id}/status`, { status: 'missed' })
      socket.emit('queue_updated', { orgId })
      setCurrentServing(null)
      await fetchQueues()
    } catch (e) {
      console.error('O\'tkazib yuborishda xato:', e)
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/kirish')
  }

  const stats = {
    waiting: queues.filter(q => q.status === 'waiting').length,
    served: queues.filter(q => q.status === 'done').length,
    missed: queues.filter(q => q.status === 'missed').length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Operator <span className="text-gradient">Paneli</span>
            </h1>
            <p className="text-slate-400">Ish o'rni: {orgName || 'Yuklanmoqda...'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-indigo-500/20">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span className="text-xl font-bold text-white tracking-widest">
                {currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <button onClick={handleLogout} className="p-3 glass rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">

            {/* Joriy xizmat ko'rsatilayotgan navbat */}
            <div className={`glass rounded-3xl p-8 glow relative overflow-hidden transition-all duration-500 ${currentServing ? 'border-2 border-indigo-500/30' : 'border-2 border-slate-700/50'}`}>
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${currentServing ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500' : 'bg-slate-700'}`}></div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-indigo-400" />
                  Joriy xizmat ko'rsatilayotgan navbat
                </h2>
                {currentServing && (
                  <div className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Xizmat jarayoni
                  </div>
                )}
              </div>

              {currentServing ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <div className="text-slate-400 mb-2">Navbat raqami:</div>
                    <div className="text-6xl sm:text-7xl font-black text-gradient mb-2 tracking-wider">
                      {currentServing.token}
                    </div>
                    <div className="text-slate-300 font-medium text-lg bg-slate-800/50 inline-block px-4 py-1.5 rounded-lg border border-slate-700/50">
                      {currentServing.service}
                    </div>
                    {currentServing.userId && (
                      <div className="mt-2 text-slate-400 text-sm">
                        Mijoz: {currentServing.userId.name} — {currentServing.userId.phone}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={handleComplete}
                      disabled={actionLoading}
                      className="btn-primary flex items-center justify-center gap-2 py-4 px-8 shadow-lg shadow-indigo-500/30 text-lg w-full disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                      Tugatish
                    </button>
                    <button
                      onClick={handleSkip}
                      disabled={actionLoading}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                      Kelmagan (O'tkazib yuborish)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-400 mb-2">Hozircha bo'sh o'rin</h3>
                  <p className="text-slate-500 mb-6">Navbatdagi mijozni chaqiring</p>
                  <button
                    onClick={handleCallNext}
                    disabled={stats.waiting === 0 || actionLoading}
                    className={`btn-primary py-4 px-10 text-lg shadow-lg flex items-center gap-2 mx-auto ${stats.waiting === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-indigo-500/30'}`}
                  >
                    {actionLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Bell className="w-6 h-6" />}
                    Keyingi raqamni chaqirish
                  </button>
                </div>
              )}
            </div>

            {/* Statistika */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 border border-indigo-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Kutyapti</span>
                </div>
                <div className="text-3xl font-bold text-white">{stats.waiting}</div>
              </div>
              <div className="glass rounded-2xl p-5 border border-green-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Bajarildi</span>
                </div>
                <div className="text-3xl font-bold text-green-400">{stats.served}</div>
              </div>
              <div className="glass rounded-2xl p-5 border border-red-500/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <UserX className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Kelmagan</span>
                </div>
                <div className="text-3xl font-bold text-red-400">{stats.missed}</div>
              </div>
            </div>
          </div>

          {/* O'ng: Navbatlar ro'yxati */}
          <div className="glass rounded-3xl overflow-hidden flex flex-col h-[700px] border border-slate-700/50">
            <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
              <h3 className="font-semibold text-white">Bugungi Navbatlar</h3>
              <button onClick={fetchQueues} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {queues.length === 0 ? (
                <div className="text-center py-10 text-slate-500">Bugun hech qanday navbat yo'q.</div>
              ) : (
                queues.map((q) => (
                  <div
                    key={q._id}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                      q.status === 'called' || q.status === 'serving'
                        ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[inset_4px_0_0_0_#6366f1]'
                        : q.status === 'done'
                        ? 'bg-green-500/5 border-green-500/10 opacity-70'
                        : q.status === 'missed'
                        ? 'bg-red-500/5 border-red-500/10 opacity-70'
                        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-xl font-bold w-16 ${
                        q.status === 'called' || q.status === 'serving' ? 'text-indigo-400' :
                        q.status === 'done' ? 'text-slate-500 line-through' :
                        q.status === 'missed' ? 'text-red-400' : 'text-white'
                      }`}>{q.token}</div>
                      <div>
                        <div className={`text-sm font-medium ${q.status === 'done' || q.status === 'missed' ? 'text-slate-500' : 'text-slate-300'}`}>
                          {q.service}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {q.bookedTime}
                          {q.userId && ` — ${q.userId.name}`}
                        </div>
                      </div>
                    </div>

                    {q.status === 'waiting' && !currentServing && (
                      <button onClick={handleCallNext} disabled={actionLoading} className="text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 p-2 rounded-lg transition-colors">
                        <Bell className="w-4 h-4" />
                      </button>
                    )}
                    {q.status === 'done' && <CheckCircle2 className="w-5 h-5 text-green-500/50" />}
                    {q.status === 'missed' && <UserX className="w-5 h-5 text-red-500/50" />}
                    {(q.status === 'called' || q.status === 'serving') && (
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse mr-2"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
