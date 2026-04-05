import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../utils/api'
import socket from '../../utils/socket'

// Synthetic ding-dong ovozi (Board ekranida yangi chaqiriq kelganda)
function playCallSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    // 1-chi nota: Ding (yuqori)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, ctx.currentTime)
    gain1.gain.setValueAtTime(0.6, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc1.connect(gain1).connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + 0.5)

    // 2-chi nota: Dong (past)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.3)
    gain2.gain.setValueAtTime(0.6, ctx.currentTime + 0.3)
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0)
    osc2.connect(gain2).connect(ctx.destination)
    osc2.start(ctx.currentTime + 0.3)
    osc2.stop(ctx.currentTime + 1.0)

    // 3-chi nota: pastroq yakun
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(550, ctx.currentTime + 0.7)
    gain3.gain.setValueAtTime(0.4, ctx.currentTime + 0.7)
    gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5)
    osc3.connect(gain3).connect(ctx.destination)
    osc3.start(ctx.currentTime + 0.7)
    osc3.stop(ctx.currentTime + 1.5)

    setTimeout(() => ctx.close(), 3000)
  } catch (e) {
    console.warn('Board audio xatosi:', e)
  }
}

export default function DisplayBoard() {
  const [searchParams] = useSearchParams()
  const orgId = searchParams.get('org')

  const [currentTime, setCurrentTime] = useState(new Date())
  const [orgInfo, setOrgInfo] = useState(null)
  const [calledQueue, setCalledQueue] = useState(null)
  const [waitingQueues, setWaitingQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [flash, setFlash] = useState(false) // qizil-yashil effekt
  const prevTokenRef = useRef(null)

  // Soat
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Tashkilot ma'lumotini olish
  useEffect(() => {
    if (!orgId) return
    api.get(`/organizations/${orgId}`)
      .then(({ data }) => {
        if (data.success) setOrgInfo(data.data)
      })
      .catch(() => {})
  }, [orgId])

  // Navbatlarni API dan yuklash
  const fetchQueues = async () => {
    if (!orgId) return
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data } = await api.get(`/queues/org/${orgId}?date=${today}`)
      if (data.success) {
        const called = data.data.find(q => q.status === 'called' || q.status === 'serving')
        const waiting = data.data.filter(q => q.status === 'waiting')
        setCalledQueue(called || null)
        setWaitingQueues(waiting)
      }
    } catch (e) {
      console.error('Board: navbatlar xatosi', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!orgId) {
      setLoading(false)
      return
    }
    fetchQueues()

    // Socket xonasiga qo'shilish
    socket.emit('join_org', orgId)

    // Real-time: status o'zgarganda
    const handleStatusChanged = (data) => {
      if (!data.orgId || data.orgId.toString() === orgId.toString()) {
        fetchQueues()
      }
    }

    // Real-time: yangi chaqiriq
    const handleQueueCalled = (data) => {
      if (data.orgId?.toString() === orgId?.toString()) {
        // Flash animatsiya + ovoz
        triggerFlash()
        playCallSound()
        fetchQueues()
      }
    }

    socket.on('queue_status_changed', handleStatusChanged)
    socket.on('queue_called', handleQueueCalled)

    return () => {
      socket.off('queue_status_changed', handleStatusChanged)
      socket.off('queue_called', handleQueueCalled)
    }
  }, [orgId])

  // Yangi chaqiriq kelganda qizil-yashil flash effekti
  const triggerFlash = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 2500)
  }

  // Agar calledQueue o'zgarsa va yangi token bo'lsa — flash qilish
  useEffect(() => {
    if (calledQueue && calledQueue.token !== prevTokenRef.current) {
      prevTokenRef.current = calledQueue.token
      triggerFlash()
    }
  }, [calledQueue])

  // orgId yo'q bo'lsa
  if (!orgId) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-6">📺</div>
          <h1 className="text-4xl font-bold mb-4">Display Board</h1>
          <p className="text-xl text-slate-400 mb-6">Tashkilot tanlanmagan.</p>
          <p className="text-slate-500">URL ga <code className="bg-slate-800 px-3 py-1 rounded-lg text-indigo-400">?org=TASHKILOT_ID</code> qo'shing</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[#0a0f1c] flex flex-col p-6 text-white overflow-hidden transition-all duration-300 ${flash ? 'ring-4 ring-green-500/50' : ''}`}>

      {/* Flash overlay animatsiyasi */}
      {flash && (
        <div className="fixed inset-0 z-50 pointer-events-none animate-board-flash" />
      )}

      {/* Top Header */}
      <div className="flex justify-between items-center bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50 mb-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-indigo-400/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-wide">
              {orgInfo ? orgInfo.name : 'Yuklanmoqda...'}
            </h1>
            <p className="text-xl text-indigo-300">
              {orgInfo ? orgInfo.branch : ''}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-wider">
            {currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute:'2-digit', second:'2-digit'})}
          </div>
          <div className="text-xl text-slate-400 mt-1">
            {currentTime.toLocaleDateString('uz-UZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6 flex-1">
        
        {/* Main Calling Display (Currently Called) */}
        <div className={`col-span-2 rounded-3xl border flex flex-col items-center justify-center p-10 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)] transition-all duration-500 ${
          flash 
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/30 border-green-500/50' 
            : 'bg-gradient-to-br from-indigo-900/40 to-slate-900/90 border-indigo-500/30'
        }`}>
          <div className={`absolute top-0 left-0 w-full h-2 transition-all duration-500 ${
            flash 
              ? 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 animate-pulse' 
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse-slow'
          }`}></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] -z-10"></div>

          {calledQueue ? (
            <>
              <div className={`glass-light px-8 py-3 rounded-full text-3xl font-bold tracking-widest uppercase mb-12 animate-slide-up border flex items-center gap-4 transition-all duration-500 ${
                flash
                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                <span className={`w-4 h-4 rounded-full animate-ping ${flash ? 'bg-green-400' : 'bg-green-400'}`}></span>
                Hozirgi chaqiriq
              </div>

              <div className={`text-[14rem] font-black leading-none tracking-tighter drop-shadow-2xl mb-4 transition-all duration-500 ${
                flash ? 'text-green-300 animate-pulse scale-105' : 'text-white animate-pulse-slow'
              }`}>
                {calledQueue.token}
              </div>

              <div className="flex items-center gap-6 bg-slate-800/60 px-10 py-5 rounded-3xl border border-slate-700 mt-8">
                <span className="text-4xl text-slate-400">Xizmat:</span>
                <span className="text-5xl font-black text-amber-400">{calledQueue.service}</span>
              </div>
            </>
          ) : (
            <>
              <div className="glass-light bg-slate-500/20 text-slate-300 px-8 py-3 rounded-full text-3xl font-bold tracking-widest uppercase mb-12 border border-slate-500/30 flex items-center gap-4">
                <span className="w-4 h-4 rounded-full bg-slate-400 animate-pulse"></span>
                Kutilmoqda
              </div>

              <div className="text-[10rem] font-black text-slate-600 leading-none tracking-tighter mb-4">
                ---
              </div>

              <div className="flex items-center gap-6 bg-slate-800/60 px-10 py-5 rounded-3xl border border-slate-700 mt-8">
                <span className="text-3xl text-slate-500">Hozircha chaqiriq yo'q</span>
              </div>
            </>
          )}
        </div>

        {/* Queues List (Waiting) */}
        <div className="col-span-1 rounded-3xl border border-slate-700/50 bg-slate-800/20 overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="bg-slate-800/80 p-6 border-b border-slate-700/50 text-center flex items-center justify-between">
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Navbatdagilar</h2>
            <div className="bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full text-xl font-bold">
              {waitingQueues.length}
            </div>
          </div>

          {/* Waiting List */}
          <div className="flex-1 overflow-hidden p-6 flex flex-col gap-5">
            {loading ? (
              // Skeleton loading
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl p-6 animate-pulse border border-slate-700/50">
                  <div className="flex justify-between items-center">
                    <div className="h-10 bg-slate-700/60 rounded-xl w-28"></div>
                    <div className="h-6 bg-slate-700/40 rounded w-24"></div>
                  </div>
                </div>
              ))
            ) : waitingQueues.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <div className="text-6xl mb-4">✅</div>
                  <p className="text-2xl">Navbat bo'sh</p>
                </div>
              </div>
            ) : (
              waitingQueues.slice(0, 6).map((item, index) => (
                <div 
                  key={item.id} 
                  className={`bg-slate-800/50 rounded-2xl p-6 flex justify-between items-center border border-slate-700/50 shadow-lg transition-all duration-500 ${
                    index === 0 ? 'ring-2 ring-indigo-500/30 bg-indigo-900/20' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-5xl font-bold text-slate-300">{item.token}</div>
                  <div className="text-right">
                    <div className="text-xl text-slate-500 font-medium">Kutmoqda</div>
                    <div className="text-sm text-slate-600">{item.bookedTime}</div>
                  </div>
                </div>
              ))
            )}
            {waitingQueues.length > 6 && (
              <div className="text-center text-slate-500 text-xl py-2">
                ...va yana {waitingQueues.length - 6} ta
              </div>
            )}
          </div>

          {/* Footer Alert */}
          <div className="bg-amber-500/10 border-t border-amber-500/20 p-6 text-center">
            <p className="text-amber-400 text-2xl font-medium animate-pulse">
              Iltimos, raqamingiz chaqirilishini kuting!
            </p>
          </div>
        </div>

      </div>

      {/* CSS Animatsiyalar */}
      <style>{`
        @keyframes boardFlash {
          0% { background: transparent; }
          15% { background: rgba(34, 197, 94, 0.15); }
          30% { background: transparent; }
          45% { background: rgba(34, 197, 94, 0.10); }
          60% { background: transparent; }
          75% { background: rgba(34, 197, 94, 0.05); }
          100% { background: transparent; }
        }
        .animate-board-flash {
          animation: boardFlash 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
