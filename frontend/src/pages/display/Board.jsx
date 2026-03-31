import { useState, useEffect } from 'react'

export default function DisplayBoard() {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex flex-col p-6 text-white overflow-hidden">
       {/* Top Header */}
       <div className="flex justify-between items-center bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50 mb-6 shadow-2xl">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-indigo-400/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
             </div>
             <div>
                <h1 className="text-4xl font-extrabold text-white tracking-wide">Ipoteka Bank</h1>
                <p className="text-xl text-indigo-300">Chilonzor filiali</p>
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
          <div className="col-span-2 bg-gradient-to-br from-indigo-900/40 to-slate-900/90 rounded-3xl border border-indigo-500/30 flex flex-col items-center justify-center p-10 relative overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.15)]">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse-slow"></div>
             
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] -z-10"></div>

             <div className="glass-light bg-indigo-500/20 text-indigo-300 px-8 py-3 rounded-full text-3xl font-bold tracking-widest uppercase mb-12 animate-slide-up border border-indigo-500/30 flex items-center gap-4">
                <span className="w-4 h-4 rounded-full bg-green-400 animate-ping"></span>
                Hozirgi chaqiriq
             </div>

             <div className="text-[14rem] font-black text-white leading-none tracking-tighter drop-shadow-2xl animate-pulse-slow mb-4">
               A-045
             </div>

             <div className="flex items-center gap-6 bg-slate-800/60 px-10 py-5 rounded-3xl border border-slate-700 mt-8">
               <span className="text-4xl text-slate-400">Ish o'rni:</span>
               <span className="text-7xl font-black text-amber-400">No. 3</span>
             </div>
          </div>

          {/* Queues List (Waiting & Previous) */}
          <div className="col-span-1 rounded-3xl border border-slate-700/50 bg-slate-800/20 overflow-hidden flex flex-col">
             
             {/* Header */}
             <div className="bg-slate-800/80 p-6 border-b border-slate-700/50 text-center">
                <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Navbatdagilar</h2>
             </div>

             {/* Waiting List */}
             <div className="flex-1 overflow-hidden p-6 flex flex-col gap-5">
                {[
                  { token: 'A-046', window: 'Kutkich...', status: 'waiting' },
                  { token: 'A-047', window: 'Kutkich...', status: 'waiting' },
                  { token: 'C-089', window: 'Kutkich...', status: 'waiting' },
                  { token: 'B-012', window: 'Kutkich...', status: 'waiting' }
                ].map((item, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-2xl p-6 flex justify-between items-center border border-slate-700/50 shadow-lg">
                    <div className="text-5xl font-bold text-slate-300">{item.token}</div>
                    <div className="text-xl text-slate-500 font-medium">Kutmoqda</div>
                  </div>
                ))}
             </div>

             {/* Footer Alert */}
             <div className="bg-amber-500/10 border-t border-amber-500/20 p-6 text-center">
                <p className="text-amber-400 text-2xl font-medium animate-pulse">
                   Iltimos, raqamingiz chaqirilishini kuting!
                </p>
             </div>
          </div>

       </div>
    </div>
  )
}
