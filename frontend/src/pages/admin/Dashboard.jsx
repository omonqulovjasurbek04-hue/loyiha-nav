import { useState } from 'react'
import {
  LayoutDashboard, Building2, Users, FileText, Settings,
  LogOut, Plus, Search, MoreVertical, TrendingUp, TrendingDown,
  Activity, Calendar
} from 'lucide-react'
import { Link } from 'react-router-dom'

// Mock Data
const orgs = [
  { id: 1, name: 'Ipoteka Bank', branch: 'Chilonzor', status: 'active', users: 156, date: '2026-03-25' },
  { id: 2, name: 'Oilaviy Poliklinika #32', branch: 'Yakkasaroy', status: 'active', users: 89, date: '2026-03-20' },
  { id: 3, name: "Pasport bo'limi", branch: "Mirzo Ulug'bek", status: 'inactive', users: 0, date: '2026-03-28' },
  { id: 4, name: 'Hokimiyat', branch: 'Chilonzor', status: 'active', users: 432, date: '2026-02-15' },
  { id: 5, name: 'Soliq inspeksiyasi', branch: 'Yunusobod', status: 'active', users: 67, date: '2026-03-10' },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-900/50 border-r border-slate-700/50 fixed h-full flex flex-col z-10 backdrop-blur-md">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Admin</span>
              <span className="text-xl font-bold text-amber-400">.uz</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">Tizimni Boshqarish Paneli</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
             onClick={() => setActiveTab('dashboard')} 
             className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Boshqaruv foni
          </button>
          <button 
             onClick={() => setActiveTab('organizations')} 
             className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'organizations' ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-slate-800'}`}
          >
            <Building2 className="w-5 h-5" /> Tashkilotlar
          </button>
          <button 
             onClick={() => setActiveTab('services')} 
             className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'services' ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-slate-800'}`}
          >
            <FileText className="w-5 h-5" /> Xizmat turlari
          </button>
          <button 
             onClick={() => setActiveTab('users')} 
             className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-slate-800'}`}
          >
            <Users className="w-5 h-5" /> Mijozlar bazasi
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /> Tizimdan chiqish
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 p-8 h-screen overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
           <div>
             <h2 className="text-3xl font-bold text-white mb-2 tracking-wide uppercase">
               {activeTab === 'dashboard' && 'Statistika paneli'}
               {activeTab === 'organizations' && 'Tashkilotlar Boshqaruvi'}
               {activeTab === 'services' && 'Xizmatlarni sozaslash'}
               {activeTab === 'users' && 'Foydalanuvchilar (Mijozlar)'}
             </h2>
             <p className="text-slate-500">Barcha ma'lumotlar real vaqt rejimida</p>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Tezkor qidiruv..." 
                  className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none w-64"
                />
             </div>
             {activeTab === 'organizations' && (
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> Yangi Tashkilot
                </button>
             )}
           </div>
        </div>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
           <div className="space-y-8 animate-fade-in">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   { label: 'Jami tashkilotlar', icon: Building2, value: '54', trend: '+12%', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                   { label: 'Jami Mijozlar', icon: Users, value: '1,245', trend: '+24%', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                   { label: 'Bugungi Navbatlar', icon: Activity, value: '342', trend: '+5%', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                   { label: 'Oylik daromad', icon: TrendingUp, value: '0 UZS', trend: '0%', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
                 ].map((s, i) => (
                    <div key={i} className={`p-6 rounded-2xl border bg-slate-800/30 ${s.border} shadow-lg shadow-black/20`}>
                       <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${s.bg}`}>
                             <s.icon className={`w-6 h-6 ${s.color}`} />
                          </div>
                          <div className={`flex items-center gap-1 text-xs font-semibold ${s.trend.startsWith('+') ? 'text-green-400' : 'text-slate-400'}`}>
                             {s.trend.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                             {s.trend}
                          </div>
                       </div>
                       <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                       <div className="text-sm text-slate-400">{s.label}</div>
                    </div>
                 ))}
              </div>

              {/* Simple Chart / Table Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-6">Navbatlar dinamikasi (haftalik)</h3>
                    {/* Fake Chart CSS Graphics */}
                    <div className="h-64 flex items-end justify-between gap-2 px-4 mt-8">
                       {[40, 65, 30, 85, 55, 90, 45].map((h, i) => (
                          <div key={i} className="w-full flex flex-col items-center gap-2 group">
                             <div className="text-xs text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded shadow">{h * 5} ta</div>
                             <div className="w-full bg-slate-700/50 rounded-t-lg relative" style={{ height: '100%' }}>
                                <div className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-400 rounded-t-md transition-all duration-1000" style={{ height: `${h}%` }}></div>
                             </div>
                             <span className="text-xs text-slate-500">Kun {i+1}</span>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">Top Tashkilotlar</h3>
                    <div className="space-y-4">
                       {orgs.filter(o => o.status === 'active').sort((a,b) => b.users - a.users).slice(0, 4).map((org, i) => (
                          <div key={org.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">{i+1}</div>
                               <div>
                                 <p className="text-sm text-white font-medium">{org.name}</p>
                                 <p className="text-xs text-slate-500">{org.branch}</p>
                               </div>
                             </div>
                             <div className="text-right">
                               <p className="text-sm font-bold text-white">{org.users}</p>
                               <p className="text-[10px] text-slate-400 uppercase">Navbat</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Organizations Tab Content */}
        {activeTab === 'organizations' && (
           <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden animate-fade-in">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-700 text-sm text-slate-400">
                       <th className="p-4 font-medium uppercase">ID</th>
                       <th className="p-4 font-medium uppercase">Tashkilot nomi</th>
                       <th className="p-4 font-medium uppercase">Filiali</th>
                       <th className="p-4 font-medium uppercase">Holati</th>
                       <th className="p-4 font-medium uppercase">Jami Navbatlar</th>
                       <th className="p-4 font-medium uppercase">Sana</th>
                       <th className="p-4 font-medium text-right uppercase">Amal</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-700/50">
                    {orgs.filter(o => o.name.toLowerCase().includes(search.toLowerCase())).map((org) => (
                       <tr key={org.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 text-sm text-slate-500">#{org.id}</td>
                          <td className="p-4">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                   <Building2 className="w-4 h-4 text-indigo-400" />
                                </div>
                                <span className="font-medium text-white">{org.name}</span>
                             </div>
                          </td>
                          <td className="p-4 text-slate-300">{org.branch}</td>
                          <td className="p-4">
                             <span className={`px-3 py-1 text-xs font-medium rounded-full ${org.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                {org.status === 'active' ? 'Faol' : 'Nofaol'}
                             </span>
                          </td>
                          <td className="p-4 font-bold text-white">{org.users}</td>
                          <td className="p-4 text-slate-400 text-sm flex items-center gap-2"><Calendar className="w-3 h-3"/> {org.date}</td>
                          <td className="p-4 text-right">
                             <button className="text-slate-400 hover:text-white transition-colors p-2"><MoreVertical className="w-5 h-5" /></button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {orgs.length === 0 && (
                 <div className="text-center py-10 text-slate-500">Hech nima topilmadi</div>
              )}
           </div>
        )}

      </div>
    </div>
  )
}
