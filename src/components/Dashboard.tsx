import React from 'react';
import { useStore } from '../store/useStore';
import { VARIETIES } from '../data/knowledgeBase';
import { differenceInDays, parseISO, format, addDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { Sprout, Droplets, Bug, Scissors, CheckCircle2, AlertCircle } from 'lucide-react';
import { Task } from '../types';
import WeatherWidget from './WeatherWidget';
import MarketPriceWidget from './MarketPriceWidget';
import RicePlantIllustration from './RicePlantIllustration';

export default function Dashboard({ onStartNew }: { onStartNew: () => void }) {
  const { activeCycle, tasks } = useStore();

  if (!activeCycle) {
    return (
      <div className="p-6">
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
  const harvestAge = variety?.harvest_age || 120;
  const progress = Math.min(100, Math.max(0, Math.round((hst / harvestAge) * 100)));

  const todayTasks = tasks.filter(t => {
    const taskDate = format(parseISO(t.scheduled_date), 'yyyy-MM-dd');
    const today = format(new Date(), 'yyyy-MM-dd');
    return taskDate === today;
  });

  const upcomingTask = tasks
    .filter(t => !t.is_completed && parseISO(t.scheduled_date) >= new Date())
    .sort((a, b) => parseISO(a.scheduled_date).getTime() - parseISO(b.scheduled_date).getTime())[0];

  const progressColor = progress < 20
    ? 'bg-emerald-400'
    : progress < 60
    ? 'bg-emerald-500'
    : progress < 80
    ? 'bg-lime-500'
    : 'bg-amber-400';

  const progressGradient = progress < 20
    ? 'from-emerald-400 to-teal-400'
    : progress < 60
    ? 'from-emerald-500 to-green-500'
    : progress < 80
    ? 'from-lime-400 to-emerald-500'
    : 'from-amber-400 to-yellow-300';

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Header */}
      <header className="flex items-start justify-between pt-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Siklus Aktif</p>
          <h1 className="text-3xl font-black text-stone-900 leading-tight">{variety?.name}</h1>
          <p className="text-sm text-stone-400 mt-0.5">{format(parseISO(activeCycle.start_date), 'd MMMM yyyy', { locale: id })} • {activeCycle.field_area} Ha</p>
        </div>
        <button
          onClick={onStartNew}
          className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-200 mt-1"
          title="Mulai Siklus Baru"
        >
          <Sprout size={16} />
          <span className="hidden sm:inline">Siklus Baru</span>
        </button>
      </header>

      {/* ── Hero Progress Card ── */}
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 shadow-xl shadow-emerald-200`}>
        {/* Decorative ring */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative p-5 flex items-end justify-between gap-4">
          {/* Left — stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-6xl font-black text-white leading-none">{hst}</span>
              <span className="text-sm font-bold text-emerald-200 uppercase tracking-wider">HST</span>
            </div>
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-widest mb-4">Hari Setelah Tanam</p>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-emerald-200">Progres Panen</span>
                <span className="text-sm font-black text-white">{progress}%</span>
              </div>
              <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${progressGradient} rounded-full transition-all duration-1000`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Date range */}
            <div className="flex justify-between text-[10px] font-semibold text-emerald-300 mt-2">
              <span>{format(parseISO(activeCycle.start_date), 'd MMM yyyy', { locale: id })}</span>
              <span>Est. {format(addDays(parseISO(activeCycle.start_date), harvestAge), 'd MMM yyyy', { locale: id })}</span>
            </div>
          </div>

          {/* Right — rice illustration */}
          <div className="shrink-0 flex flex-col items-center drop-shadow-lg">
            <RicePlantIllustration progress={progress} />
          </div>
        </div>
      </div>

      {/* ── Weather + Market ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeatherWidget />
        <MarketPriceWidget />
      </div>

      {/* ── Today's Tasks ── */}
      <section>
        <h2 className="mb-3 text-base font-bold text-stone-900">Tugas Hari Ini</h2>
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

      {/* ── Upcoming Task ── */}
      {upcomingTask && (
        <section>
          <h2 className="mb-3 text-base font-bold text-stone-900">Tugas Terdekat</h2>
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
