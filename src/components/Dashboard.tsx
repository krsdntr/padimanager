import React from 'react';
import { useStore } from '../store/useStore';
import { VARIETIES } from '../data/knowledgeBase';
import { differenceInDays, parseISO, format, addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Sprout, Droplets, Bug, Scissors, CheckCircle2, AlertCircle } from 'lucide-react';
import { Task } from '../types';
import WeatherWidget from './WeatherWidget';
import MarketPriceWidget from './MarketPriceWidget';

export default function Dashboard({ onStartNew }: { onStartNew: () => void }) {
  const { activeCycle, tasks } = useStore();

  if (!activeCycle) {
    return (
      <div className="p-6">
        <WeatherWidget />
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Sprout size={48} />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-stone-900">Belum Ada Siklus Tanam</h1>
          <p className="mb-8 text-stone-500">Mulai siklus tanam baru untuk memantau perkembangan padi Anda secara otomatis.</p>
          <button 
            onClick={onStartNew}
            className="rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white shadow-lg transition-transform active:scale-95"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    );
  }

  const variety = VARIETIES.find(v => v.id === activeCycle.variety_id);
  const hst = differenceInDays(new Date(), parseISO(activeCycle.start_date));
  const progress = Math.min(100, Math.round((hst / (variety?.harvest_age || 120)) * 100));
  
  const todayTasks = tasks.filter(t => {
    const taskDate = format(parseISO(t.scheduled_date), 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    return taskDate === today;
  });

  const upcomingTask = tasks
    .filter(t => !t.is_completed && parseISO(t.scheduled_date) >= new Date())
    .sort((a, b) => parseISO(a.scheduled_date).getTime() - parseISO(b.scheduled_date).getTime())[0];

  return (
    <div className="p-6">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-emerald-600">Siklus Aktif</p>
          <h1 className="text-3xl font-bold text-stone-900">{variety?.name}</h1>
          <p className="text-stone-500">{format(parseISO(activeCycle.start_date), 'd MMMM yyyy', { locale: id })} • {activeCycle.field_area} Ha</p>
        </div>
        <button 
          onClick={onStartNew}
          className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-200"
          title="Mulai Siklus Baru"
        >
          <Sprout size={16} />
          <span className="hidden sm:inline">Siklus Baru</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 items-start">
        <WeatherWidget />
        <MarketPriceWidget />
      </div>

      {/* Progress Card */}
      <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm border border-stone-100">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-4xl font-black text-stone-900">{hst}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Hari Setelah Tanam (HST)</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-emerald-600">{progress}%</p>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Progres Panen</p>
          </div>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-stone-100 mb-3">
          <div 
            className="h-full bg-emerald-500 transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-medium text-stone-500">
          <span>{format(parseISO(activeCycle.start_date), 'd MMM yyyy', { locale: id })}</span>
          <span>Estimasi Panen: {format(addDays(parseISO(activeCycle.start_date), variety?.harvest_age || 120), 'd MMM yyyy', { locale: id })}</span>
        </div>
      </div>

      {/* Today's Tasks */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-stone-900">Tugas Hari Ini</h2>
        {todayTasks.length > 0 ? (
          <div className="space-y-3">
            {todayTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl bg-stone-100 p-4 text-stone-500">
            <CheckCircle2 size={20} />
            <p className="text-sm font-medium">Tidak ada tugas mendesak hari ini.</p>
          </div>
        )}
      </section>

      {/* Upcoming Task */}
      {upcomingTask && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-stone-900">Tugas Terdekat</h2>
          <div className="rounded-2xl border-2 border-dashed border-stone-200 p-4">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                {getTaskIcon(upcomingTask.type)}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  {format(parseISO(upcomingTask.scheduled_date), 'EEEE, d MMM', { locale: id })}
                </p>
                <h3 className="font-bold text-stone-900">{upcomingTask.title}</h3>
                <p className="text-sm text-stone-500">{upcomingTask.description}</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function TaskCard({ task }: { task: Task; key?: string }) {
  const { toggleTask } = useStore();
  
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-stone-100">
      <button 
        onClick={() => toggleTask(task.id)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          task.is_completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-stone-300'
        }`}
      >
        {task.is_completed && <CheckCircle2 size={16} />}
      </button>
      <div className="flex-1">
        <h3 className={`font-bold text-stone-900 ${task.is_completed ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </h3>
        <p className="text-xs text-stone-500">{task.description}</p>
      </div>
      <div className="text-stone-400">
        {getTaskIcon(task.type)}
      </div>
    </div>
  );
}

function getTaskIcon(type: string) {
  switch (type) {
    case 'fertilizer': return <Sprout size={20} />;
    case 'water': return <Droplets size={20} />;
    case 'pest_control': return <Bug size={20} />;
    case 'weeding': return <Scissors size={20} />;
    case 'harvest': return <Sprout size={20} />;
    default: return <AlertCircle size={20} />;
  }
}
