import { useState } from 'react'
import {
  Clock, Users, MapPin, Phone, RefreshCw, XCircle, CheckCircle2,
  AlertCircle, ChevronDown, ChevronUp, Banknote, Bell, Timer
} from 'lucide-react'

const myQueues = [
  {
    id: 1,
    token: 'A-048',
    org: 'Ipoteka Bank — Chilonzor',
    service: 'Karta ochish',
    date: '28 Mar, 2026',
    time: '10:30',
    status: 'waiting',
    position: 3,
    currentServing: 'A-045',
    estimatedWait: 12,
    icon: Banknote,
    color: 'from-emerald-500 to-teal-600',
    totalInQueue: 15,
    address: 'Chilonzor tumani, 9-mavze'
  },
  {
    id: 2,
    token: 'B-012',
    org: 'Oilaviy Poliklinika #32',
    service: 'Umumiy shifokor',
    date: '29 Mar, 2026',
    time: '14:00',
    status: 'upcoming',
    position: null,
    currentServing: null,
    estimatedWait: null,
    icon: Banknote,
    color: 'from-rose-500 to-pink-600',
    totalInQueue: 8,
    address: "Yakkasaroy tumani, Bobur ko'chasi"
  },
  {
    id: 3,
    token: 'C-089',
    org: "Pasport bo'limi — Mirzo Ulug'bek",
    service: 'Pasport olish',
    date: '27 Mar, 2026',
    time: '11:00',
    status: 'done',
    position: null,
    currentServing: null,
    estimatedWait: null,
    icon: Banknote,
    color: 'from-blue-500 to-cyan-600',
    totalInQueue: 0,
    address: "Mirzo Ulug'bek tumani, 5-uy"
  }
]

const statusConfig = {
  waiting: {
    label: 'Kutilmoqda',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Clock,
    dot: 'bg-amber-400'
  },
  called: {
    label: 'Chaqirilmoqda!',
    color: 'bg-green-500/10 text-green-400 border-green-500/20',
    icon: Bell,
    dot: 'bg-green-400'
  },
  upcoming: {
    label: 'Rejalashtirilgan',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: Timer,
    dot: 'bg-blue-400'
  },
  done: {
    label: 'Bajarilgan',
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    icon: CheckCircle2,
    dot: 'bg-slate-400'
  },
  cancelled: {
    label: 'Bekor qilingan',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
    icon: XCircle,
    dot: 'bg-red-400'
  }
}

export default function MyQueue() {
  const [queues, setQueues] = useState(myQueues)
  const [expandedId, setExpandedId] = useState(1)
  const [searchToken, setSearchToken] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  const handleCancel = (id) => {
    setQueues(queues.map(q =>
      q.id === id ? { ...q, status: 'cancelled' } : q
    ))
  }

  const activeQueue = queues.find(q => q.status === 'waiting' || q.status === 'called')

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Mening <span className="text-gradient">navbatlarim</span>
            </h1>
            <p className="text-slate-400">Navbat holatini real-vaqtda kuzating</p>
          </div>
          <button
            onClick={handleRefresh}
            className={`btn-secondary py-2.5 px-4 ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Search by Token */}
        <div className="glass rounded-2xl p-5 mb-8">
          <label className="text-sm font-medium text-slate-400 mb-2 block">
            Navbat raqami orqali qidirish
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Masalan: A-048"
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-800/50 rounded-xl text-white placeholder-slate-500 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
            />
            <button className="btn-primary py-3 px-6">
              Qidirish
            </button>
          </div>
        </div>

        {/* Active Queue - Big Card */}
        {activeQueue && (
          <div className="glass rounded-3xl p-8 mb-8 glow relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${statusConfig[activeQueue.status].color}`}>
                <div className={`w-2 h-2 rounded-full ${statusConfig[activeQueue.status].dot} animate-pulse`}></div>
                {statusConfig[activeQueue.status].label}
              </div>
              <div className="text-slate-400 text-sm">{activeQueue.date}</div>
            </div>

            {/* Token Number */}
            <div className="text-center mb-8">
              <div className="text-slate-400 text-sm mb-2">Sizning raqamingiz</div>
              <div className="text-7xl sm:text-8xl font-black text-gradient mb-2 animate-pulse-slow">
                {activeQueue.token}
              </div>
              <div className="text-slate-400">{activeQueue.service}</div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/40 rounded-2xl p-5 text-center">
                <Users className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{activeQueue.position}</div>
                <div className="text-slate-400 text-xs">Oldingizda</div>
              </div>
              <div className="bg-slate-800/40 rounded-2xl p-5 text-center">
                <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-amber-400 mb-1">~{activeQueue.estimatedWait}</div>
                <div className="text-slate-400 text-xs">Daqiqa</div>
              </div>
              <div className="bg-slate-800/40 rounded-2xl p-5 text-center">
                <AlertCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-400 mb-1">{activeQueue.currentServing}</div>
                <div className="text-slate-400 text-xs">Hozirgi</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Navbat jarayoni</span>
                <span className="text-indigo-400 font-medium">
                  {Math.round(((activeQueue.totalInQueue - activeQueue.position) / activeQueue.totalInQueue) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${((activeQueue.totalInQueue - activeQueue.position) / activeQueue.totalInQueue) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Organization Info */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{activeQueue.org}</div>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {activeQueue.address}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleCancel(activeQueue.id)}
                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Bekor qilish
              </button>
            </div>
          </div>
        )}

        {/* Queue History */}
        <h2 className="text-lg font-semibold text-white mb-4">Barcha navbatlar</h2>
        <div className="space-y-3">
          {queues.map((queue) => {
            const config = statusConfig[queue.status]
            const isExpanded = expandedId === queue.id

            return (
              <div key={queue.id} className="glass rounded-2xl overflow-hidden card-hover">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : queue.id)}
                  className="w-full p-5 text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gradient min-w-[80px]">{queue.token}</div>
                    <div>
                      <div className="text-white font-medium text-sm">{queue.org}</div>
                      <div className="text-slate-500 text-xs">{queue.service} • {queue.date}, {queue.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                      {config.label}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 animate-slide-up">
                    <div className="bg-slate-800/30 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Tashkilot</div>
                        <div className="text-white font-medium">{queue.org}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Xizmat</div>
                        <div className="text-white font-medium">{queue.service}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Sana</div>
                        <div className="text-white font-medium">{queue.date}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs mb-1">Vaqt</div>
                        <div className="text-white font-medium">{queue.time}</div>
                      </div>
                    </div>

                    {(queue.status === 'waiting' || queue.status === 'upcoming') && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleCancel(queue.id)}
                          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-all"
                        >
                          <XCircle className="w-4 h-4" />
                          Bekor qilish
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {queues.length === 0 && (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Navbatlar yo'q</h3>
            <p className="text-slate-400">Hali navbat olmadingiz</p>
          </div>
        )}
      </div>
    </div>
  )
}
