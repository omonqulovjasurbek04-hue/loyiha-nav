import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Building2, Users, FileText, Settings,
  LogOut, Plus, Search, MoreVertical, TrendingUp, TrendingDown,
  Activity, Loader2, X, CheckCircle2
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../utils/api'

// Tashkilot qo'shish modal komponenti
function AddOrgModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', category: 'bank', branch: '', address: '', phone: '', workHours: '09:00 - 18:00',
    services: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/organizations', {
        ...form,
        services: form.services.split(',').map(s => s.trim()).filter(Boolean)
      })
      if (data.success) {
        onSuccess()
        onClose()
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-lg border border-indigo-500/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Yangi Tashkilot</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Tashkilot nomi *"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none">
            <option value="bank">Bank</option>
            <option value="hospital">Shifoxona</option>
            <option value="government">Davlat idorasi</option>
            <option value="hokimiyat">Hokimiyat</option>
            <option value="education">Ta'lim</option>
            <option value="tax">Soliq</option>
          </select>
          <input required value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}
            placeholder="Filial nomi *"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
          <input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
            placeholder="Manzil *"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="Telefon raqam"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
          <input value={form.services} onChange={e => setForm({ ...form, services: e.target.value })}
            placeholder="Xizmatlar (vergul bilan: Kredit, Karta, Hisob)"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 outline-none" />
          <button type="submit" disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Qo'shish
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!user.id || user.role !== 'admin') {
      navigate('/kirish')
      return
    }
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/organizations')
      if (data.success) setOrgs(data.data)
    } catch (e) {
      console.error('Tashkilotlarni yuklashda xato:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/kirish')
  }

  const filteredOrgs = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.branch.toLowerCase().includes(search.toLowerCase())
  )

  const stats = [
    {
      label: 'Jami tashkilotlar', icon: Building2,
      value: orgs.length.toString(),
      trend: '+' + orgs.length, color: 'text-indigo-400',
      bg: 'bg-indigo-500/10', border: 'border-indigo-500/20'
    },
    {
      label: 'Faol tashkilotlar', icon: CheckCircle2,
      value: orgs.filter(o => o.isOpen).length.toString(),
      trend: 'Faol', color: 'text-green-400',
      bg: 'bg-green-500/10', border: 'border-green-500/20'
    },
    {
      label: 'Bugungi Navbatlar', icon: Activity,
      value: '—', trend: 'Real-vaqt', color: 'text-amber-400',
      bg: 'bg-amber-500/10', border: 'border-amber-500/20'
    },
    {
      label: 'Jami Xizmatlar', icon: FileText,
      value: orgs.reduce((acc, o) => acc + (o.services?.length || 0), 0).toString(),
      trend: 'Umumiy', color: 'text-purple-400',
      bg: 'bg-purple-500/10', border: 'border-purple-500/20'
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-300 flex">
      {showAddModal && (
        <AddOrgModal onClose={() => setShowAddModal(false)} onSuccess={fetchOrganizations} />
      )}

      {/* Sidebar */}
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
          {[
            { id: 'dashboard', label: 'Boshqaruv foni', icon: LayoutDashboard },
            { id: 'organizations', label: 'Tashkilotlar', icon: Building2 },
            { id: 'services', label: 'Xizmat turlari', icon: FileText },
            { id: 'users', label: 'Mijozlar bazasi', icon: Users },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === item.id ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-slate-800'}`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <div className="px-4 py-2 text-xs text-slate-500 truncate">{user.name}</div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /> Tizimdan chiqish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8 h-screen overflow-y-auto">

        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-wide uppercase">
              {activeTab === 'dashboard' && 'Statistika paneli'}
              {activeTab === 'organizations' && 'Tashkilotlar Boshqaruvi'}
              {activeTab === 'services' && 'Xizmatlarni sozlash'}
              {activeTab === 'users' && 'Foydalanuvchilar (Mijozlar)'}
            </h2>
            <p className="text-slate-500">Real ma'lumotlar</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Tezkor qidiruv..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none w-64"
              />
            </div>
            {activeTab === 'organizations' && (
              <button onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Yangi Tashkilot
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className={`p-6 rounded-2xl border bg-slate-800/30 ${s.border} shadow-lg shadow-black/20`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${s.bg}`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <div className="text-xs font-semibold text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {s.trend}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Top tashkilotlar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">So'nggi tashkilotlar</h3>
                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-indigo-400 animate-spin" /></div>
                ) : (
                  <div className="space-y-3">
                    {orgs.slice(0, 5).map((org, i) => (
                      <div key={org._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                          <div>
                            <p className="text-sm text-white font-medium">{org.name}</p>
                            <p className="text-xs text-slate-500">{org.branch}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${org.isOpen ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {org.isOpen ? 'Faol' : 'Yopiq'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Kategoriyalar bo'yicha</h3>
                <div className="space-y-3">
                  {['bank', 'hospital', 'government', 'hokimiyat', 'education', 'tax'].map(cat => {
                    const count = orgs.filter(o => o.category === cat).length
                    const labels = { bank: 'Bank', hospital: 'Shifoxona', government: 'Davlat idorasi', hokimiyat: 'Hokimiyat', education: "Ta'lim", tax: 'Soliq' }
                    const pct = orgs.length ? Math.round((count / orgs.length) * 100) : 0
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{labels[cat]}</span>
                          <span className="text-slate-400">{count} ta</span>
                        </div>
                        <div className="h-2 bg-slate-700/50 rounded-full">
                          <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden animate-fade-in">
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-10 h-10 text-indigo-400 animate-spin" /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700 text-sm text-slate-400">
                    <th className="p-4 font-medium uppercase">Tashkilot nomi</th>
                    <th className="p-4 font-medium uppercase">Kategoriya</th>
                    <th className="p-4 font-medium uppercase">Filiali</th>
                    <th className="p-4 font-medium uppercase">Holati</th>
                    <th className="p-4 font-medium uppercase">Ish vaqti</th>
                    <th className="p-4 font-medium text-right uppercase">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredOrgs.map((org) => (
                    <tr key={org._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                            <span className="font-medium text-white">{org.name}</span>
                            <p className="text-xs text-slate-500">{org.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 text-sm capitalize">{org.category}</td>
                      <td className="p-4 text-slate-300">{org.branch}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${org.isOpen ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {org.isOpen ? 'Faol' : 'Yopiq'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-sm">{org.workHours}</td>
                      <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-white transition-colors p-2">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filteredOrgs.length === 0 && (
              <div className="text-center py-10 text-slate-500">Hech nima topilmadi</div>
            )}
          </div>
        )}

        {/* Services & Users Tab */}
        {(activeTab === 'services' || activeTab === 'users') && (
          <div className="text-center py-20 text-slate-500">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl">Tez orada ishga tushadi...</p>
          </div>
        )}

      </div>
    </div>
  )
}
