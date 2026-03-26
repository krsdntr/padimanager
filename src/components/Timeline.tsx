import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  format, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday,
  differenceInDays
} from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon, CheckCircle2, Circle, Download, ExternalLink, List, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { Task, TaskType } from '../types';

export default function Timeline() {
  const { tasks, activeCycle, toggleTask, addTask, deleteTask } = useStore();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    scheduled_date: format(new Date(), 'yyyy-MM-dd'),
    type: 'lainnya' as TaskType | 'lainnya'
  });

  if (!activeCycle) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <CalendarIcon size={48} className="mb-4 text-stone-300" />
        <p className="text-stone-500">Belum ada jadwal. Mulai siklus tanam baru terlebih dahulu.</p>
      </div>
    );
  }

  const sortedTasks = [...tasks].sort((a, b) => parseISO(a.scheduled_date).getTime() - parseISO(b.scheduled_date).getTime());

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const cycleStart = parseISO(activeCycle.start_date);
    const taskDate = parseISO(newTask.scheduled_date);
    const dayOffset = differenceInDays(taskDate, cycleStart);

    await addTask({
      cycle_id: activeCycle.id,
      day_offset: dayOffset,
      scheduled_date: new Date(newTask.scheduled_date).toISOString(),
      type: newTask.type === 'lainnya' ? 'water' : newTask.type as TaskType, // Defaulting if 'lainnya'
      title: newTask.title,
      description: newTask.description,
      is_completed: false
    });

    setIsAddingTask(false);
    setNewTask({
      title: '',
      description: '',
      scheduled_date: format(new Date(), 'yyyy-MM-dd'),
      type: 'lainnya'
    });
  };

  const exportToGoogleCalendar = (task: Task) => {
    const start = format(parseISO(task.scheduled_date), "yyyyMMdd'T'HHmmss'Z'");
    const end = format(parseISO(task.scheduled_date), "yyyyMMdd'T'HHmmss'Z'");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.title)}&dates=${start}/${end}&details=${encodeURIComponent(task.description)}`;
    window.open(url, '_blank');
  };

  const exportToICS = (task: Task) => {
    const start = format(parseISO(task.scheduled_date), "yyyyMMdd'T'HHmmss'Z'");
    const end = format(parseISO(task.scheduled_date), "yyyyMMdd'T'HHmmss'Z'");
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${task.title}
DTSTART:${start}
DTEND:${end}
DESCRIPTION:${task.description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${task.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTaskCard = (task: Task) => (
    <div key={task.id} className="relative pl-10 mb-8 last:mb-0 group">
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-colors ${
        task.is_completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-stone-200 text-stone-400'
      }`}>
        {task.is_completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </div>

      {/* Task Content */}
      <div className={`rounded-2xl border border-stone-100 bg-white p-4 shadow-sm transition-opacity ${task.is_completed ? 'opacity-60' : ''}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              {task.day_offset} HST
            </span>
            <span className="text-xs font-medium text-stone-400">
              {format(parseISO(task.scheduled_date), 'd MMM yyyy', { locale: id })}
            </span>
          </div>
          <button 
            onClick={() => {
              if (window.confirm('Hapus tugas ini?')) {
                deleteTask(task.id);
              }
            }}
            className="text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Hapus Tugas"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <h3 className="mb-1 font-bold text-stone-900">{task.title}</h3>
        <p className="mb-4 text-sm text-stone-500 leading-relaxed">{task.description}</p>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => toggleTask(task.id)}
            className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
              task.is_completed ? 'bg-stone-100 text-stone-600' : 'bg-emerald-600 text-white'
            }`}
          >
            {task.is_completed ? 'Selesai' : 'Tandai Selesai'}
          </button>
          
          <div className="flex gap-1">
            <button 
              onClick={() => exportToGoogleCalendar(task)}
              title="Ekspor ke Google Calendar"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100"
            >
              <ExternalLink size={16} />
            </button>
            <button 
              onClick={() => exportToICS(task)}
              title="Unduh file .ics"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dateFormat = "d";
    const days = eachDayOfInterval({
      start: startDate,
      end: endDate
    });

    const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const selectedDateTasks = selectedDate 
      ? sortedTasks.filter(task => isSameDay(parseISO(task.scheduled_date), selectedDate))
      : [];

    return (
      <div className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-stone-100">
          <button onClick={prevMonth} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-stone-600" />
          </button>
          <h2 className="text-lg font-bold text-stone-900">
            {format(currentMonth, 'MMMM yyyy', { locale: id })}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ChevronRight size={20} className="text-stone-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-2xl bg-white p-4 shadow-sm border border-stone-100">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-bold text-stone-400 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const dayTasks = sortedTasks.filter(t => isSameDay(parseISO(t.scheduled_date), day));
              const hasTasks = dayTasks.length > 0;
              const allCompleted = hasTasks && dayTasks.every(t => t.is_completed);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-xl h-14 transition-all
                    ${!isCurrentMonth ? 'text-stone-300' : 'text-stone-700'}
                    ${isSelected ? 'bg-emerald-50 border-emerald-200 border' : 'hover:bg-stone-50 border border-transparent'}
                    ${isToday(day) && !isSelected ? 'bg-stone-100 font-bold' : ''}
                  `}
                >
                  <span className={`text-sm ${isSelected ? 'font-bold text-emerald-700' : ''}`}>
                    {format(day, dateFormat)}
                  </span>
                  <div className="flex gap-0.5 mt-1 h-1.5">
                    {hasTasks && (
                      <div className={`w-1.5 h-1.5 rounded-full ${allCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">
            {selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: id }) : 'Pilih Tanggal'}
          </h3>
          {selectedDateTasks.length > 0 ? (
            <div className="relative before:absolute before:left-4 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-stone-200">
              {selectedDateTasks.map(renderTaskCard)}
            </div>
          ) : (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
              <p className="text-stone-500 text-sm">Tidak ada jadwal perawatan pada tanggal ini.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Jadwal Perawatan</h1>
          <p className="text-sm text-stone-500">Daftar tugas berdasarkan Hari Setelah Tanam (HST).</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
          >
            {isAddingTask ? <X size={18} /> : <Plus size={18} />}
            <span className="hidden sm:inline">{isAddingTask ? 'Batal' : 'Tambah Tugas'}</span>
          </button>
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <List size={16} />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'calendar' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <CalendarIcon size={16} />
              <span className="hidden sm:inline">Kalender</span>
            </button>
          </div>
        </div>
      </header>

      {isAddingTask && (
        <div className="mb-8 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Tambah Tugas Baru</h2>
          <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Judul Tugas</label>
              <input 
                type="text" 
                required
                placeholder="Contoh: Semprot Pestisida"
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Tanggal</label>
              <input 
                type="date" 
                required
                value={newTask.scheduled_date}
                onChange={e => setNewTask({...newTask, scheduled_date: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Jenis</label>
              <select 
                value={newTask.type}
                onChange={e => setNewTask({...newTask, type: e.target.value as any})}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="fertilizer">Pemupukan</option>
                <option value="water">Pengairan</option>
                <option value="pest_control">Pengendalian Hama</option>
                <option value="weeding">Penyiangan</option>
                <option value="harvest">Panen</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Keterangan</label>
              <input 
                type="text" 
                placeholder="Detail tambahan..."
                value={newTask.description}
                onChange={e => setNewTask({...newTask, description: e.target.value})}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Simpan Tugas
              </button>
            </div>
          </form>
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="relative before:absolute before:left-4 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-stone-200">
          {sortedTasks.map(renderTaskCard)}
        </div>
      ) : (
        renderCalendar()
      )}
    </div>
  );
}
