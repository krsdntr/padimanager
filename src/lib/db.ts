import { openDB, IDBPDatabase } from 'idb';
import { PlantingCycle, Task, Transaction } from '../types';

const DB_NAME = 'padi_management_db';
const DB_VERSION = 2;

export interface PadiDB extends IDBPDatabase {
  planting_cycles: PlantingCycle;
  tasks: Task;
  transactions: Transaction;
}

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      if (!db.objectStoreNames.contains('planting_cycles')) {
        db.createObjectStore('planting_cycles', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('cycle_id', 'cycle_id');
      }
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
        txStore.createIndex('cycle_id', 'cycle_id');
      }
    },
  });
};

export const dbActions = {
  async saveCycle(cycle: PlantingCycle) {
    const db = await initDB();
    await db.put('planting_cycles', cycle);
  },
  async getCycles() {
    const db = await initDB();
    return db.getAll('planting_cycles');
  },
  async deleteCycle(id: string) {
    const db = await initDB();
    await db.delete('planting_cycles', id);
    // Also delete associated tasks
    const tasks = await db.getAllFromIndex('tasks', 'cycle_id', id);
    for (const task of tasks) {
      await db.delete('tasks', task.id);
    }
  },
  async saveTasks(tasks: Task[]) {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readwrite');
    for (const task of tasks) {
      await tx.store.put(task);
    }
    await tx.done;
  },
  async getTasksByCycle(cycleId: string) {
    const db = await initDB();
    return db.getAllFromIndex('tasks', 'cycle_id', cycleId);
  },
  async updateTask(task: Task) {
    const db = await initDB();
    await db.put('tasks', task);
  },
  async deleteTask(id: string) {
    const db = await initDB();
    await db.delete('tasks', id);
  },
  async clearAllData() {
    const db = await initDB();
    await db.clear('planting_cycles');
    await db.clear('tasks');
    await db.clear('transactions');
  },
  async exportData() {
    const db = await initDB();
    const cycles = await db.getAll('planting_cycles');
    const tasks = await db.getAll('tasks');
    const transactions = await db.getAll('transactions');
    return { cycles, tasks, transactions };
  },
  async importData(data: { cycles: PlantingCycle[]; tasks: Task[]; transactions?: Transaction[] }) {
    const db = await initDB();
    const tx = db.transaction(['planting_cycles', 'tasks', 'transactions'], 'readwrite');
    for (const cycle of data.cycles) {
      await tx.objectStore('planting_cycles').put(cycle);
    }
    for (const task of data.tasks) {
      await tx.objectStore('tasks').put(task);
    }
    if (data.transactions) {
      for (const transaction of data.transactions) {
        await tx.objectStore('transactions').put(transaction);
      }
    }
    await tx.done;
  },
  async saveTransaction(transaction: Transaction) {
    const db = await initDB();
    await db.put('transactions', transaction);
  },
  async getTransactions() {
    const db = await initDB();
    return db.getAll('transactions');
  },
  async deleteTransaction(id: string) {
    const db = await initDB();
    await db.delete('transactions', id);
  }
};
