import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { VARIETIES } from '../data/knowledgeBase';
import { X, Sprout, Calendar, Ruler, CheckCircle2, Calculator } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function NewCycleModal({ onClose }: { onClose: () => void }) {
  const { addCycle } = useStore();
  const [varietyId, setVarietyId] = useState(VARIETIES[0].id);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [fieldArea, setFieldArea] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVariety = useMemo(() => VARIETIES.find(v => v.id === varietyId) || VARIETIES[0], [varietyId]);

  const calculations = useMemo(() => {
    const area = isNaN(fieldArea) || fieldArea <= 0 ? 0 : fieldArea;
    
    // Estimates per hectare
    const seedPerHa = 25; // kg
    const ureaPerHa = 250; // kg
    const npkPerHa = 300; // kg
    
    let harvestDate = null;
    if (startDate) {
      harvestDate = addDays(new Date(startDate), selectedVariety.harvest_age);
    }

    return {
      seed: (seedPerHa * area).toFixed(1),
      urea: (ureaPerHa * area).toFixed(1),
      npk: (npkPerHa * area).toFixed(1),
      harvestDate
    };
  }, [fieldArea, selectedVariety, startDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addCycle(varietyId, startDate, fieldArea);
      onClose();
    } catch (error) {
      console.error('Failed to add cycle', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-stone-900/40 backdrop-blur-sm sm:items-center p-4">
      <div className="w-full max-w-md animate-in slide-in-from-bottom duration-300 rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
          <h2 className="text-2xl font-bold text-stone-900">Mulai Siklus Tanam</h2>
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Variety Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
              <Sprout size={14} /> Pilih Varietas Padi
            </label>
            <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-200">
              {VARIETIES.map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVarietyId(v.id)}
                  className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                    varietyId === v.id ? 'border-emerald-500 bg-emerald-50' : 'border-stone-100 bg-white'
                  }`}
                >
                  <div>
                    <p className={`font-bold ${varietyId === v.id ? 'text-emerald-900' : 'text-stone-900'}`}>{v.name}</p>
                    <p className="text-xs text-stone-500">Umur Panen: {v.harvest_age} Hari</p>
                  </div>
                  {varietyId === v.id && <CheckCircle2 className="text-emerald-500" size={20} />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                <Calendar size={14} /> Tanggal Tanam
              </label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Field Area */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400">
                <Ruler size={14} /> Luas Lahan
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  value={fieldArea}
                  onChange={(e) => setFieldArea(parseFloat(e.target.value))}
                  required
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 pr-10 text-sm text-stone-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">Ha</span>
              </div>
            </div>
          </div>

          {/* Calculator Results */}
          <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-3 text-emerald-800">
              <Calculator size={18} />
              <h3 className="font-bold text-sm">Kalkulator Kebutuhan Estimasi</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-emerald-100/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Benih</p>
                <p className="font-bold text-stone-700">{calculations.seed} <span className="text-xs font-normal text-stone-500">kg</span></p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Pupuk Urea</p>
                <p className="font-bold text-stone-700">{calculations.urea} <span className="text-xs font-normal text-stone-500">kg</span></p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Pupuk NPK</p>
                <p className="font-bold text-stone-700">{calculations.npk} <span className="text-xs font-normal text-stone-500">kg</span></p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Estimasi Panen</p>
                <p className="font-bold text-emerald-700 text-sm">
                  {calculations.harvestDate ? format(calculations.harvestDate, 'd MMM yyyy', { locale: id }) : '-'}
                </p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : 'Buat Siklus Tanam'}
          </button>
        </form>
      </div>
    </div>
  );
}
