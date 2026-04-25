import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Navbat.uz",
  description: "O'zbekiston uchun elektron navbat olish tizimi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${inter.className} min-h-screen antialiased bg-slate-50 dark:bg-[#0f172a]`}>
        <ThemeProvider>
          <LanguageProvider>
            {/* Global Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] transition-colors duration-500">
              <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px]"></div>
            </div>

            <div className="min-h-screen flex flex-col pt-16">
              <Navbar />
              <main className="flex-1 relative w-full text-slate-900 dark:text-white transition-colors duration-300">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
