import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Navbat | Online Tizim",
  description: "Davlat va nodavlat idoralari uchun zamonaviy online navbat olish tizimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${inter.className} min-h-screen relative`}>
        {/* Orqa fon bezaklari (Glow effect) */}
        <div className="glow top-20 left-20"></div>
        <div className="glow bottom-20 right-20 bg-violet-600"></div>

        {/* Asosiy kontent layouti */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="glass-light sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                  N
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  Navbat<span className="text-primary">.uz</span>
                </span>
              </div>
              <nav className="hidden md:flex items-center gap-8 font-medium">
                <a href="/" className="hover:text-primary transition-colors">Bosh sahifa</a>
                <a href="#tashkilotlar" className="hover:text-primary transition-colors">Tashkilotlar</a>
                <a href="#qoida" className="hover:text-primary transition-colors">Qoidalar</a>
              </nav>
              <div className="flex gap-4">
                <a href="/login" className="btn-primary text-sm px-5 py-2">
                  Kirish
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col">
             {children}
          </main>

          <footer className="glass-light mt-auto">
             <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-400">
               © {new Date().getFullYear()} E-Navbat UZ. Barcha huquqlar himoyalangan.
             </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
