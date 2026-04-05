import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-Navbat UZ",
  description: "O'zbekiston uchun elektron navbat olish tizimi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${inter.className} min-h-screen bg-slate-50 antialiased`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">E-Navbat UZ</h1>
                  <p className="text-xs text-gray-500">Elektron navbat tizimi</p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white border-t mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
              © 2024 E-Navbat UZ. Barcha huquqlar himoyalangan.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
