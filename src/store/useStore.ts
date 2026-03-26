import { create } from 'zustand';
import { PlantingCycle, Task, Variety, TaskType, Transaction } from '../types';
import { dbActions } from '../lib/db';
import { addDays, format, parseISO } from 'date-fns';
import { VARIETIES } from '../data/knowledgeBase';

interface PadiState {
  cycles: PlantingCycle[];
  tasks: Task[];
  transactions: Transaction[];
  activeCycle: PlantingCycle | null;
  isLoading: boolean;
  
  // Actions
  loadData: () => Promise<void>;
  addCycle: (varietyId: string, startDate: string, fieldArea: number) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteCycle: (cycleId: string) => Promise<void>;
  clearData: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (json: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useStore = create<PadiState>((set, get) => ({
  cycles: [],
  tasks: [],
  transactions: [],
  activeCycle: null,
  isLoading: true,

  loadData: async () => {
    set({ isLoading: true });
    try {
      const cycles = await dbActions.getCycles();
      const activeCycle = cycles.find(c => c.status === 'active') || null;
      let tasks: Task[] = [];
      if (activeCycle) {
        tasks = await dbActions.getTasksByCycle(activeCycle.id);
      }
      const transactions = await dbActions.getTransactions();
      set({ cycles, activeCycle, tasks, transactions, isLoading: false });
    } catch (error) {
      console.error('Failed to load data', error);
      set({ isLoading: false });
    }
  },

  addCycle: async (varietyId, startDate, fieldArea) => {
    const variety = VARIETIES.find(v => v.id === varietyId);
    if (!variety) return;

    const newCycle: PlantingCycle = {
      id: crypto.randomUUID(),
      variety_id: varietyId,
      start_date: startDate,
      field_area: fieldArea,
      status: 'active',
    };

    // Generate tasks
    const generatedTasks: Task[] = generateTasks(newCycle, variety);

    // If there was an active cycle, mark it as harvested
    const { activeCycle } = get();
    if (activeCycle) {
      const updatedOldCycle = { ...activeCycle, status: 'harvested' as const };
      await dbActions.saveCycle(updatedOldCycle);
    }

    await dbActions.saveCycle(newCycle);
    await dbActions.saveTasks(generatedTasks);
    
    await get().loadData();
  },

  addTask: async (task) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
    };
    await dbActions.saveTasks([newTask]);
    await get().loadData();
  },

  deleteTask: async (taskId) => {
    await dbActions.deleteTask(taskId);
    await get().loadData();
  },

  toggleTask: async (taskId) => {
    const { tasks } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date().toISOString() : undefined,
    };

    await dbActions.updateTask(updatedTask);
    set({ tasks: tasks.map(t => t.id === taskId ? updatedTask : t) });
  },

  deleteCycle: async (cycleId) => {
    await dbActions.deleteCycle(cycleId);
    await get().loadData();
  },

  clearData: async () => {
    await dbActions.clearAllData();
    set({ cycles: [], tasks: [], transactions: [], activeCycle: null });
  },

  exportData: async () => {
    const data = await dbActions.exportData();
    return JSON.stringify(data);
  },

  importData: async (json) => {
    try {
      const data = JSON.parse(json);
      await dbActions.importData(data);
      await get().loadData();
    } catch (error) {
      console.error('Failed to import data', error);
      throw error;
    }
  },

  addTransaction: async (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    await dbActions.saveTransaction(newTransaction);
    await get().loadData();
  },

  deleteTransaction: async (id) => {
    await dbActions.deleteTransaction(id);
    await get().loadData();
  },
}));

function generateTasks(cycle: PlantingCycle, variety: Variety): Task[] {
  const tasks: Task[] = [];
  const start = parseISO(cycle.start_date);
  const area = cycle.field_area;

  const taskTemplates: { day: number; type: TaskType; title: string; description: string }[] = [
    { 
      day: 0, 
      type: 'water', 
      title: 'Pengairan Awal', 
      description: `Pastikan lahan seluas ${area} Ha terairi dengan cukup untuk persiapan tanam.` 
    },
    { 
      day: 14, 
      type: 'fertilizer', 
      title: 'Pemupukan Susulan 1', 
      description: `Gunakan Urea (${Math.round(100 * area)} kg) dan NPK (${Math.round(150 * area)} kg) untuk lahan ${area} Ha.` 
    },
    { 
      day: 21, 
      type: 'weeding', 
      title: 'Penyiangan 1', 
      description: 'Bersihkan gulma agar tidak berebut nutrisi dengan padi.' 
    },
    { 
      day: 35, 
      type: 'fertilizer', 
      title: 'Pemupukan Susulan 2', 
      description: `Gunakan Urea (${Math.round(100 * area)} kg), NPK (${Math.round(150 * area)} kg), dan KCl (${Math.round(50 * area)} kg).` 
    },
    { 
      day: 45, 
      type: 'pest_control', 
      title: 'Pengamatan Hama', 
      description: 'Cek keberadaan Wereng atau Penggerek Batang di seluruh area.' 
    },
    { 
      day: 60, 
      type: 'water', 
      title: 'Pengairan Intermittent (AWD)', 
      description: 'Keringkan lahan selama 3-5 hari untuk memperkuat akar dan mengurangi gas metana.' 
    },
    { 
      day: 90, 
      type: 'water', 
      title: 'Pengairan Fase Generatif', 
      description: 'Pastikan air cukup (macak-macak) saat pengisian bulir.' 
    },
    { 
      day: variety.harvest_age, 
      type: 'harvest', 
      title: 'Panen Raya', 
      description: `Waktunya memanen hasil dari lahan ${area} Ha. Selamat!` 
    },
  ];


  taskTemplates.forEach(template => {
    tasks.push({
      id: crypto.randomUUID(),
      cycle_id: cycle.id,
      day_offset: template.day,
      scheduled_date: addDays(start, template.day).toISOString(),
      type: template.type,
      title: template.title,
      description: template.description,
      is_completed: false,
    });
  });

  return tasks;
}
