import { useState, useEffect } from 'react'
import {
  Users, UserCheck, UserX, Clock, Bell,
  ChevronRight, RefreshCw, CheckCircle2, Play, AlertTriangle
} from 'lucide-react'

// Mock Data
const todayQueues = [
  { id: 1, token: 'A-044', service: 'Kredit olish', status: 'served', time: '09:00', waitTime: 5 },
  { id: 2, token: 'B-012', service: 'Valyuta ayirboshlash', status: 'served', time: '09:15', waitTime: 8 },
  { id: 3, token: 'A-045', service: 'Kredit olish', status: 'serving', time: '09:30', waitTime: 12 },
  { id: 4, token: 'A-046', service: 'Karta ochish', status: 'waiting', time: '09:45', waitTime: 15 },
  { id: 5, token: 'C-089', service: 'Hisob raqam ochish', status: 'waiting', time: '10:00', waitTime: null },
  { id: 6, token: 'A-047', service: 'Kredit olish', status: 'missed', time: '09:35', waitTime: 20 },
  { id: 7, token: 'A-048', service: 'Kredit olish', status: 'waiting', time: '10:30', waitTime: null },
]

export default function OperatorDashboard() {
  const [queues, setQueues] = useState(todayQueues)
  const [currentServing, setCurrentServing] = useState(queues.find(q => q.status === 'serving'))
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Update time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Actions
  const handleCallNext = () => {
    const nextQueue = queues.find(q => q.status === 'waiting')
    if (nextQueue) {
      if (currentServing) {
        setQueues(prev => prev.map(q => q.id === currentServing.id ? { ...q, status: 'served' } : q))
      }
      setCurrentServing(nextQueue)
      setQueues(prev => prev.map(q => q.id === nextQueue.id ? { ...q, status: 'serving' } : q))
    }
  }

  const handleComplete = () => {
    if (currentServing) {
      setQueues(prev => prev.map(q => q.id === currentServing.id ? { ...q, status: 'served' } : q))
      setCurrentServing(null)
    }
  }

  const handleSkip = () => {
     if (currentServing) {
      setQueues(prev => prev.map(q => q.id === currentServing.id ? { ...q, status: 'missed' } : q))
      setCurrentServing(null)
    }
  }

  // Stats calculate
  const stats = {
    waiting: queues.filter(q => q.status === 'waiting').length,
    served: queues.filter(q => q.status === 'served').length,
    missed: queues.filter(q => q.status === 'missed').length,
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Operator <span className="text-gradient">Paneli</span>
            </h1>
            <p className="text-slate-400">Ish o'rni: No.3 (Ipoteka Bank Chilonzor)</p>
          </div>
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span className="text-xl font-bold text-white tracking-widest">
              {currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute:'2-digit', second:'2-digit'})}
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Controls (Left/Center) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Current Serving Big Card */}
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
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-auto">
                       <button onClick={handleComplete} className="btn-primary flex items-center justify-center gap-2 py-4 px-8 shadow-lg shadow-indigo-500/30 text-lg w-full">
                         <CheckCircle2 className="w-6 h-6" />
                         Tugatish
                       </button>
                       <button onClick={handleSkip} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-semibold transition-all">
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
                      disabled={stats.waiting === 0}
                      className={`btn-primary py-4 px-10 text-lg shadow-lg ${stats.waiting === 0 ? 'opacity-50 cursor-not-allowed' : 'shadow-indigo-500/30'}`}
                    >
                      <Bell className="w-6 h-6 mr-2" />
                      Keyingi raqamni chaqirish
                    </button>
                 </div>
               )}
            </div>

            {/* Quick Stats Grid */}
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

          {/* Right Sidebar - Queue List */}
          <div className="glass rounded-3xl overflow-hidden flex flex-col h-[700px] border border-slate-700/50">
             <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
                <h3 className="font-semibold text-white">Navbatlar ro'yxatiBugungi</h3>
                <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {queues.map((q) => (
                  <div 
                    key={q.id} 
                    className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                      q.status === 'serving' ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[inset_4px_0_0_0_#6366f1]' : 
                      q.status === 'served' ? 'bg-green-500/5 border-green-500/10 opacity-70' :
                      q.status === 'missed' ? 'bg-red-500/5 border-red-500/10 opacity-70' :
                      'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                     <div className="flex items-center gap-4">
                        <div className={`text-xl font-bold w-16 ${
                           q.status === 'serving' ? 'text-indigo-400' :
                           q.status === 'served' ? 'text-slate-500 line-through' :
                           q.status === 'missed' ? 'text-red-400' : 'text-white'
                        }`}>{q.token}</div>
                        <div>
                           <div className={`text-sm font-medium ${q.status === 'served' || q.status === 'missed' ? 'text-slate-500' : 'text-slate-300'}`}>{q.service}</div>
                           <div className="text-xs text-slate-500 flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {q.time} {q.waitTime && `(kutdi: ${q.waitTime} daq)`}
                           </div>
                        </div>
                     </div>
                     
                     {q.status === 'waiting' && currentServing == null && (
                        <button onClick={handleCallNext} className="text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 p-2 rounded-lg transition-colors">
                           <Bell className="w-4 h-4" />
                        </button>
                     )}
                     {q.status === 'served' && <CheckCircle2 className="w-5 h-5 text-green-500/50" />}
                     {q.status === 'missed' && <UserX className="w-5 h-5 text-red-500/50" />}
                     {q.status === 'serving' && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse mr-2"></div>}
                  </div>
                ))}
                
                {queues.length === 0 && (
                   <div className="text-center py-10 text-slate-500">
                      Bugun hech qanday navbat yo'q.
                   </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
