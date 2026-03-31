import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, MapPin, Clock, Star, ChevronRight, Filter,
  Banknote, Heart, Landmark, Building2, GraduationCap, Shield,
  Users, Phone
} from 'lucide-react'

const categoryFilters = [
  { id: 'all', label: 'Barchasi', icon: Building2 },
  { id: 'bank', label: 'Banklar', icon: Banknote },
  { id: 'hospital', label: 'Shifoxonalar', icon: Heart },
  { id: 'government', label: 'Davlat xizmatlari', icon: Landmark },
  { id: 'hokimiyat', label: 'Hokimiyat', icon: Building2 },
  { id: 'education', label: "Ta'lim", icon: GraduationCap },
  { id: 'tax', label: 'Soliq', icon: Shield },
]

const organizations = [
  {
    id: 1, name: 'Ipoteka Bank', category: 'bank',
    address: 'Toshkent, Chilonzor tumani, 9-mavze',
    rating: 4.8, reviews: 156, queueCount: 12,
    workHours: '09:00 — 18:00', phone: '+998 71 200 00 00',
    services: ['Kredit', 'Karta ochish', 'Hisob ochish', "Pul o'tkazma"],
    color: 'from-emerald-500 to-teal-600', icon: Banknote, isOpen: true
  },
  {
    id: 2, name: 'Oilaviy Poliklinika #32', category: 'hospital',
    address: "Toshkent, Yakkasaroy tumani, Bobur ko'chasi",
    rating: 4.5, reviews: 89, queueCount: 24,
    workHours: '08:00 — 17:00', phone: '+998 71 256 78 90',
    services: ['Umumiy shifokor', 'Tahlil topshirish', 'Mutaxassis', 'Vaksinatsiya'],
    color: 'from-rose-500 to-pink-600', icon: Heart, isOpen: true
  },
  {
    id: 3, name: 'Pasport bo\'limi — Mirzo Ulug\'bek', category: 'government',
    address: "Toshkent, Mirzo Ulug'bek tumani, 5-uy",
    rating: 4.2, reviews: 234, queueCount: 45,
    workHours: '09:00 — 17:00', phone: '+998 71 234 56 78',
    services: ['Pasport olish', 'ID karta', 'Propiska', 'Ma\'lumotnoma'],
    color: 'from-blue-500 to-cyan-600', icon: Landmark, isOpen: true
  },
  {
    id: 4, name: 'Chilonzor tuman Hokimiyati', category: 'hokimiyat',
    address: 'Toshkent, Chilonzor tumani, Qatortol 60',
    rating: 4.0, reviews: 67, queueCount: 8,
    workHours: '09:00 — 18:00', phone: '+998 71 277 00 00',
    services: ['Qabulxona', 'Ariza topshirish', 'Yer masalasi', 'Murojaat'],
    color: 'from-amber-500 to-orange-600', icon: Building2, isOpen: true
  },
  {
    id: 5, name: 'Toshkent davlat texnika universiteti', category: 'education',
    address: "Toshkent, Universitet ko'chasi 2",
    rating: 4.6, reviews: 112, queueCount: 15,
    workHours: '09:00 — 16:00', phone: '+998 71 246 00 00',
    services: ["Qabul bo'limi", "Dekanat", "Stipendiya", "Ma'lumotnoma"],
    color: 'from-violet-500 to-purple-600', icon: GraduationCap, isOpen: false
  },
  {
    id: 6, name: 'Soliq inspeksiyasi — Yunusobod', category: 'tax',
    address: 'Toshkent, Yunusobod tumani, A.Navoiy 30',
    rating: 3.9, reviews: 45, queueCount: 20,
    workHours: '09:00 — 17:00', phone: '+998 71 233 44 55',
    services: ['Soliq deklaratsiya', 'Maslahat', 'Hisobot topshirish', 'Patent'],
    color: 'from-indigo-500 to-blue-600', icon: Shield, isOpen: true
  },
  {
    id: 7, name: "Xalq Banki — Sergeli filiali", category: 'bank',
    address: 'Toshkent, Sergeli tumani, 7A-mavze',
    rating: 4.7, reviews: 198, queueCount: 18,
    workHours: '09:00 — 18:00', phone: '+998 71 255 00 00',
    services: ['Kredit', 'Depozit', 'Valyuta ayirboshlash', "Pul o'tkazma"],
    color: 'from-emerald-500 to-teal-600', icon: Banknote, isOpen: true
  },
  {
    id: 8, name: "Respublika Onkologiya markazi", category: 'hospital',
    address: "Toshkent, TTZ-3, Farobiy ko'chasi",
    rating: 4.4, reviews: 76, queueCount: 30,
    workHours: '08:00 — 16:00', phone: '+998 71 268 00 00',
    services: ["Ko'rik", 'UZI', 'Tahlil', 'Maslahat'],
    color: 'from-rose-500 to-pink-600', icon: Heart, isOpen: true
  },
]

export default function Organizations() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = organizations.filter((org) => {
    const matchCat = activeCategory === 'all' || org.category === activeCategory
    const matchSearch = org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.address.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Barcha <span className="text-gradient">tashkilotlar</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Kerakli tashkilotni toping va onlayn navbat oling
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Tashkilot nomini qidiring..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <button className="btn-secondary py-3 px-6">
            <Filter className="w-4 h-4" />
            Filtr
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                  : 'glass text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400 text-sm">
            <span className="text-white font-semibold">{filtered.length}</span> ta tashkilot topildi
          </p>
        </div>

        {/* Organization Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((org) => (
            <div key={org.id} className="glass rounded-2xl p-6 card-hover group">
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${org.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <org.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-lg truncate">{org.name}</h3>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                      org.isOpen
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                      }`}>
                      {org.isOpen ? 'Ochiq' : 'Yopiq'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{org.address}</span>
                  </div>
                </div>
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-medium">{org.rating}</span>
                  <span className="text-slate-500">({org.reviews})</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-4 h-4" />
                  {org.workHours}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-4 h-4" />
                  {org.queueCount} navbatda
                </div>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-2 mb-5">
                {org.services.map((s, i) => (
                  <span key={i} className="bg-slate-700/40 text-slate-300 text-xs px-3 py-1.5 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Phone className="w-4 h-4" />
                  {org.phone}
                </div>
                <Link
                  to="/navbat-olish"
                  className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors group/link"
                >
                  Navbat olish
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">Topilmadi</h3>
            <p className="text-slate-400">Boshqa kalit so'z bilan qidirib ko'ring</p>
          </div>
        )}
      </div>
    </div>
  )
}
