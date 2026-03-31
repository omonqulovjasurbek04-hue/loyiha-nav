import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Banknote, Heart, Landmark, GraduationCap, Shield,
  ChevronRight, ChevronLeft, Calendar, Clock, User, Phone,
  FileText, CheckCircle2, ArrowRight, MapPin, Info
} from 'lucide-react'

const orgOptions = [
  { id: 1, name: 'Ipoteka Bank — Chilonzor', icon: Banknote, color: 'from-emerald-500 to-teal-600', category: 'Banklar' },
  { id: 2, name: 'Oilaviy Poliklinika #32', icon: Heart, color: 'from-rose-500 to-pink-600', category: 'Shifoxonalar' },
  { id: 3, name: "Pasport bo'limi — Mirzo Ulug'bek", icon: Landmark, color: 'from-blue-500 to-cyan-600', category: 'Davlat xizmatlari' },
  { id: 4, name: 'Chilonzor tuman Hokimiyati', icon: Building2, color: 'from-amber-500 to-orange-600', category: 'Hokimiyat' },
  { id: 5, name: 'ToshDTU — Qabul bo\'limi', icon: GraduationCap, color: 'from-violet-500 to-purple-600', category: "Ta'lim" },
  { id: 6, name: 'Soliq inspeksiyasi — Yunusobod', icon: Shield, color: 'from-indigo-500 to-blue-600', category: 'Soliq' },
]

const servicesByOrg = {
  1: ['Kredit olish', 'Karta ochish', 'Hisob ochish', "Pul o'tkazma", 'Valyuta ayirboshlash'],
  2: ['Umumiy shifokor', 'Tahlil topshirish', 'Mutaxassis ko\'rigi', 'Vaksinatsiya', 'Maslahatchiga'],
  3: ['Pasport olish', 'ID karta', 'Propiska', "Ma'lumotnoma", "Fuqarolik masalalari"],
  4: ['Qabulxona', 'Ariza topshirish', 'Yer masalasi', 'Murojaat', 'Uy-joy masalasi'],
  5: ["Qabul bo'limi", 'Dekanat', 'Stipendiya', "Ma'lumotnoma", "O'qishga topshirish"],
  6: ['Soliq deklaratsiya', 'Maslahat', 'Hisobot topshirish', 'Patent olish', 'QQS masalasi'],
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00'
]

const takenSlots = ['09:00', '10:00', '11:30', '14:00', '15:30']

export default function BookQueue() {
  const [step, setStep] = useState(1)
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [isBooked, setIsBooked] = useState(false)

  const today = new Date()
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  const dayNames = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"]
  const monthNames = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"]

  const handleBooking = () => {
    setIsBooked(true)
  }

  if (isBooked) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center animate-slide-up">
          <div className="glass rounded-3xl p-10 glow">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Navbat muvaffaqiyatli olindu!</h2>
            <p className="text-slate-400 mb-8">Sizning navbat ma'lumotlaringiz:</p>

            <div className="bg-indigo-500/10 rounded-2xl p-6 mb-6">
              <div className="text-slate-400 text-sm mb-1">Navbat raqamingiz</div>
              <div className="text-5xl font-black text-gradient mb-2">A-048</div>
            </div>

            <div className="space-y-3 text-left mb-8">
              <div className="flex justify-between py-2 border-b border-slate-700/30">
                <span className="text-slate-400">Tashkilot</span>
                <span className="text-white font-medium">{orgOptions.find(o => o.id === selectedOrg)?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/30">
                <span className="text-slate-400">Xizmat</span>
                <span className="text-white font-medium">{selectedService}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700/30">
                <span className="text-slate-400">Sana</span>
                <span className="text-white font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Vaqt</span>
                <span className="text-white font-medium">{selectedTime}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/mening-navbatim" className="btn-primary justify-center">
                Navbatimni kuzatish
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/" className="btn-secondary justify-center">
                Bosh sahifaga
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Navbat <span className="text-gradient">olish</span>
          </h1>
          <p className="text-slate-400 text-lg">
            3 bosqichda osongina navbat oling
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {[
            { num: 1, label: 'Tanlash' },
            { num: 2, label: 'Vaqt' },
            { num: 3, label: "Ma'lumot" }
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                step >= s.num
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-700/50 text-slate-500'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-white' : 'text-slate-500'}`}>
                {s.label}
              </span>
              {i < 2 && (
                <div className={`flex-1 h-0.5 rounded-full mx-2 transition-all duration-500 ${
                  step > s.num ? 'bg-indigo-500' : 'bg-slate-700/50'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Organization & Service */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Tashkilot va xizmatni tanlang
            </h2>

            {/* Organizations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {orgOptions.map((org) => (
                <button
                  key={org.id}
                  onClick={() => { setSelectedOrg(org.id); setSelectedService(null) }}
                  className={`glass rounded-2xl p-5 text-left card-hover group transition-all duration-300 ${
                    selectedOrg === org.id ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${org.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <org.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{org.name}</div>
                      <div className="text-slate-500 text-xs">{org.category}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Services */}
            {selectedOrg && (
              <div className="animate-slide-up">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Xizmat turini tanlang
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {servicesByOrg[selectedOrg]?.map((service, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedService(service)}
                      className={`glass rounded-xl p-4 text-left transition-all duration-300 flex items-center justify-between ${
                        selectedService === service
                          ? 'ring-2 ring-indigo-500 bg-indigo-500/10'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <span className={`text-sm font-medium ${selectedService === service ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {service}
                      </span>
                      {selectedService === service && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                    </button>
                  ))}
                </div>

                {selectedService && (
                  <button onClick={() => setStep(2)} className="btn-primary w-full justify-center py-3.5">
                    Davom etish
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Sana va vaqtni tanlang
            </h2>

            {/* Date Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-slate-400 mb-3">Kunni tanlang</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {dates.map((date, i) => {
                  const dateStr = `${date.getDate()} ${monthNames[date.getMonth()]}`
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`flex flex-col items-center min-w-[72px] py-4 px-3 rounded-2xl transition-all duration-300 ${
                        selectedDate === dateStr
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                          : 'glass text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xs font-medium mb-1">{dayNames[date.getDay()]}</span>
                      <span className="text-xl font-bold">{date.getDate()}</span>
                      <span className="text-xs">{monthNames[date.getMonth()]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="animate-slide-up mb-8">
                <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Vaqtni tanlang
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {timeSlots.map((time) => {
                    const taken = takenSlots.includes(time)
                    return (
                      <button
                        key={time}
                        disabled={taken}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                          taken
                            ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed line-through'
                            : selectedTime === time
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                            : 'glass text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-indigo-500"></div>
                    Tanlangan
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-slate-700"></div>
                    Bo'sh
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-slate-800/50"></div>
                    Band
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center py-3.5">
                <ChevronLeft className="w-5 h-5" />
                Orqaga
              </button>
              {selectedTime && (
                <button onClick={() => setStep(3)} className="btn-primary flex-1 justify-center py-3.5">
                  Davom etish
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Personal Info */}
        {step === 3 && (
          <div className="animate-slide-up">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Ma'lumotlaringizni kiriting
            </h2>

            {/* Summary Card */}
            <div className="glass rounded-2xl p-6 mb-8">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" />
                Tanlangan ma'lumotlar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-400">Tashkilot</div>
                    <div className="text-white font-medium">{orgOptions.find(o => o.id === selectedOrg)?.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-400">Xizmat</div>
                    <div className="text-white font-medium">{selectedService}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-400">Sana</div>
                    <div className="text-white font-medium">{selectedDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-400">Vaqt</div>
                    <div className="text-white font-medium">{selectedTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  To'liq ismingiz
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Ism Familiya"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Telefon raqam
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center py-3.5">
                <ChevronLeft className="w-5 h-5" />
                Orqaga
              </button>
              <button
                onClick={handleBooking}
                disabled={!formData.name || !formData.phone}
                className={`flex-1 justify-center py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 ${
                  formData.name && formData.phone
                    ? 'btn-primary'
                    : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                Navbat olish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
