import React, { useRef } from 'react';
import { useStore } from '../store/useStore';
import { Download, Upload, Trash2, Info, Github, ShieldCheck, LayoutTemplate } from 'lucide-react';

interface SettingsProps {
  onNavigateToLanding: () => void;
}

export default function Settings({ onNavigateToLanding }: SettingsProps) {
  const { exportData, importData, clearData } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `padi_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (window.confirm('Impor data akan menimpa data saat ini. Lanjutkan?')) {
        await importData(content);
        alert('Data berhasil diimpor!');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = async () => {
    if (window.confirm('Hapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
      await clearData();
      alert('Semua data telah dihapus.');
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Setelan</h1>
        <p className="text-sm text-stone-500">Kelola data dan preferensi aplikasi.</p>
      </header>

      <div className="space-y-6">
        {/* Tampilan */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">Tampilan</h2>
          <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
            <button 
              onClick={onNavigateToLanding}
              className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-stone-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <LayoutTemplate size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-stone-900">Lihat Landing Page</p>
                <p className="text-xs text-stone-500">Tampilkan halaman perkenalan aplikasi.</p>
              </div>
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">Manajemen Data</h2>
          <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
            <button 
              onClick={handleExport}
              className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-stone-50 border-b border-stone-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Download size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-stone-900">Ekspor Cadangan</p>
                <p className="text-xs text-stone-500">Unduh semua data dalam format JSON.</p>
              </div>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-stone-50 border-b border-stone-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Upload size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-stone-900">Impor Cadangan</p>
                <p className="text-xs text-stone-500">Pulihkan data dari file cadangan.</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                className="hidden" 
                accept=".json" 
              />
            </button>

            <button 
              onClick={handleClear}
              className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-stone-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Trash2 size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-stone-900 text-red-600">Hapus Semua Data</p>
                <p className="text-xs text-stone-500">Bersihkan penyimpanan lokal perangkat.</p>
              </div>
            </button>
          </div>
        </section>

        {/* App Info */}
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-stone-400">Tentang Aplikasi</h2>
          <div className="rounded-2xl border border-stone-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-900">PadiManager</h3>
                <p className="text-sm font-medium text-emerald-600">Versi 1.0.0 (Beta)</p>
              </div>
            </div>
            
            <p className="mb-6 text-sm text-stone-500 leading-relaxed">
              Aplikasi manajemen pertanian padi berbasis PWA (Progressive Web App) yang bekerja 100% secara offline. Data Anda aman tersimpan di perangkat Anda sendiri.
            </p>

            <div className="space-y-4 border-t border-stone-50 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Pengembang</span>
                <span className="font-bold text-stone-700">Tim Padi Digital</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-400">Lisensi</span>
                <span className="font-bold text-stone-700">MIT License</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
