export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-24 w-full max-w-7xl mx-auto flex-1 text-center">
      
      <div className="animate-slide-up space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-primary mb-4 animate-float">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-sm font-medium">Tizim 100% online va ishonchli</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
           Orangizdagi masofani <span className="text-gradient">Navbat.uz</span> qisqartiradi
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Davlat idoralari, banklar, shifoxonalar va nodavlat xizmatlariga onlayn navbat oling. 
          Joylaringiz band va real-vaqtda xabardor bo'ling.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
          <a href="/login" className="btn-primary text-lg px-8 py-4">
             Navbat olish qoidasi
          </a>
          <a href="#demo" className="btn-outline text-lg px-8 py-4">
             Qanday ishlaydi?
          </a>
        </div>
      </div>

      <div className="mt-20 w-full animate-fade-in delay-200">
        <h2 className="text-2xl font-bold mb-8 text-white">Xizmat doiralari</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="glass-card hover:-translate-y-2 text-left">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 border border-orange-500/50">
                 🏦
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bank va Moliya</h3>
              <p className="text-gray-400">Plastik karta olish, kredit va hujjatlarni rasmiylashtirish.</p>
           </div>
           
           <div className="glass-card hover:-translate-y-2 text-left">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/50">
                 🏥
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sog'liqni Saqlash</h3>
              <p className="text-gray-400">Poliklinikalar, xususiy klinikalar va tish shifokorlariga qabul.</p>
           </div>
           
           <div className="glass-card hover:-translate-y-2 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 border border-blue-500/50">
                 🏛️
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Davlat Xizmatlari</h3>
              <p className="text-gray-400">Notarius, hokimiyat va barcha idoralardagi elektron qabullar.</p>
           </div>
        </div>
      </div>
      
    </div>
  );
}
