import React from 'react';
import { Sprout, Calendar, TrendingUp, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
            <Sprout size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-stone-900">PadiManager</span>
        </div>
        <button 
          onClick={onEnter}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Masuk Aplikasi
        </button>
      </nav>

      {/* Hero Section */}
      <main className="px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Aplikasi Pertanian Modern
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-stone-900 mb-6 leading-[1.1]">
          Kelola Sawah Anda <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            Lebih Cerdas & Mudah
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          PadiManager membantu Anda merencanakan jadwal tanam, memantau keuangan, dan memberikan panduan lengkap untuk hasil panen yang lebih maksimal. 100% Offline & Aman.
        </p>
        
        <button 
          onClick={onEnter}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-200 active:scale-95"
        >
          Mulai Sekarang
          <ArrowRight size={20} />
        </button>
      </main>

      {/* Features Section */}
      <section className="bg-white border-y border-stone-200 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900 mb-4">Fitur Unggulan</h2>
            <p className="text-stone-500 max-w-xl mx-auto">Semua yang Anda butuhkan untuk mengelola siklus pertanian padi dari awal hingga panen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar size={28} />}
              title="Jadwal Pintar"
              description="Buat jadwal tanam otomatis berdasarkan varietas padi. Dapatkan pengingat untuk pemupukan dan pengendalian hama."
              color="blue"
            />
            <FeatureCard 
              icon={<TrendingUp size={28} />}
              title="Laporan Keuangan"
              description="Catat setiap pemasukan dan pengeluaran. Pantau arus kas, laba bersih, dan ROI untuk setiap siklus tanam."
              color="emerald"
            />
            <FeatureCard 
              icon={<BookOpen size={28} />}
              title="Edukasi & Panduan"
              description="Akses ensiklopedia lengkap tentang varietas padi, jenis pupuk, dan cara mengatasi hama penyakit secara offline."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-center">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-50 grayscale">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-700 text-white">
              <Sprout size={18} />
            </div>
            <span className="text-lg font-black tracking-tight text-white">PadiManager</span>
          </div>
          <p className="text-sm mb-2 italic">"PadiManager - Kelola Sawah Anda Lebih Cerdas & Mudah"</p>
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} PadiManager. Dibuat oleh <strong>Krisdiantoro</strong>.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: 'blue' | 'emerald' | 'amber' }) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className="p-8 rounded-[32px] bg-stone-50 border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 border ${colorStyles[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-3">{title}</h3>
      <p className="text-stone-500 leading-relaxed">{description}</p>
    </div>
  );
}
