import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Settings as SettingsIcon,
  PlusCircle,
  Loader2,
  Wallet,
  BarChart2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Components
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import Encyclopedia from './components/Encyclopedia';
import Settings from './components/Settings';
import NewCycleModal from './components/NewCycleModal';
import FinancialReport from './components/FinancialReport';
import LandingPage from './components/LandingPage';
import YieldAnalytics from './components/YieldAnalytics';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const { loadData, isLoading, activeCycle, setDeferredPrompt } = useStore();
  const [activeTab, setActiveTab] = useState<'landing' | 'home' | 'schedule' | 'edu' | 'finance' | 'analytics' | 'settings'>(
    localStorage.getItem('hasSeenLanding') === 'true' ? 'home' : 'landing'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [setDeferredPrompt]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (activeTab === 'landing') {
    return <LandingPage onEnter={() => {
      localStorage.setItem('hasSeenLanding', 'true');
      setActiveTab('home');
    }} />;
  }

  return (
    <div className="flex h-screen flex-col bg-stone-50 text-stone-900 font-sans">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="mx-auto max-w-5xl">
          {activeTab === 'home' && <Dashboard onStartNew={() => setIsModalOpen(true)} />}
          {activeTab === 'schedule' && <Timeline />}
          {activeTab === 'edu' && <Encyclopedia />}
          {activeTab === 'finance' && <FinancialReport />}
          {activeTab === 'analytics' && <YieldAnalytics />}
          {activeTab === 'settings' && <Settings onNavigateToLanding={() => setActiveTab('landing')} />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white shadow-lg">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-around px-2 sm:px-4">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<Home size={22} />} 
            label="Beranda" 
          />
          <NavButton 
            active={activeTab === 'schedule'} 
            onClick={() => setActiveTab('schedule')} 
            icon={<Calendar size={22} />} 
            label="Jadwal" 
          />
          <NavButton 
            active={activeTab === 'finance'} 
            onClick={() => setActiveTab('finance')} 
            icon={<Wallet size={22} />} 
            label="Keuangan" 
          />
          <NavButton 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
            icon={<BarChart2 size={22} />} 
            label="Analisis" 
          />
          <NavButton 
            active={activeTab === 'edu'} 
            onClick={() => setActiveTab('edu')} 
            icon={<BookOpen size={22} />} 
            label="Edukasi" 
          />
          <NavButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<SettingsIcon size={22} />} 
            label="Setelan" 
          />
        </div>
      </nav>

      {/* New Cycle Modal */}
      {isModalOpen && <NewCycleModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 transition-colors",
        active ? "text-emerald-600" : "text-stone-400"
      )}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}
