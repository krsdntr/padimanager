import React, { useState } from 'react';
import { VARIETIES, PESTS_DISEASES, FERTILIZERS } from '../data/knowledgeBase';
import { Search, Info, Bug, Sprout, ShieldAlert, Droplets, AlertTriangle } from 'lucide-react';

export default function Encyclopedia() {
  const [activeTab, setActiveTab] = useState<'varieties' | 'pests' | 'fertilizers'>('varieties');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVarieties = VARIETIES.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPests = PESTS_DISEASES.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredFertilizers = FERTILIZERS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Pusat Pengetahuan</h1>
        <p className="text-sm text-stone-500">Panduan lengkap budidaya padi.</p>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
        <input 
          type="text" 
          placeholder="Cari informasi..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <TabButton 
          active={activeTab === 'varieties'} 
          onClick={() => setActiveTab('varieties')} 
          label="Varietas" 
          icon={<Sprout size={16} />} 
        />
        <TabButton 
          active={activeTab === 'pests'} 
          onClick={() => setActiveTab('pests')} 
          label="Hama & Penyakit" 
          icon={<Bug size={16} />} 
        />
        <TabButton 
          active={activeTab === 'fertilizers'} 
          onClick={() => setActiveTab('fertilizers')} 
          label="Pupuk & Nutrisi" 
          icon={<Droplets size={16} />} 
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'varieties' && filteredVarieties.map(v => (
          <div key={v.id} className="rounded-2xl bg-white p-5 shadow-sm border border-stone-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-stone-900">{v.name}</h3>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {v.category}
              </span>
            </div>
            <p className="mb-4 text-sm text-stone-600 leading-relaxed">{v.description}</p>
            
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1">
                <ShieldAlert size={14} /> Ketahanan
              </p>
              <div className="flex flex-wrap gap-2">
                {v.resistance.map((res, i) => (
                  <span key={i} className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-md">
                    {res}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Umur Panen" value={`${v.harvest_age} Hari`} />
              <InfoCard label="Potensi Hasil" value={v.yield_potential} />
              <InfoCard label="Elevasi" value={v.elevation_suitability} className="col-span-2" />
            </div>
          </div>
        ))}

        {activeTab === 'pests' && filteredPests.map(p => (
          <div key={p.id} className="rounded-2xl bg-white p-5 shadow-sm border border-stone-100">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">{p.name}</h3>
                {p.scientific_name && (
                  <p className="text-xs italic text-stone-500">{p.scientific_name}</p>
                )}
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                p.type === 'pest' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
              }`}>
                {p.type === 'pest' ? 'Hama' : 'Penyakit'}
              </span>
            </div>
            
            {p.trigger && (
              <div className="mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <AlertTriangle size={12} /> Pemicu / Epidemiologi
                </p>
                <p className="text-xs text-stone-600 leading-relaxed">{p.trigger}</p>
              </div>
            )}

            <div className="mb-4">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-400">Gejala Visual</p>
              <p className="text-sm text-stone-600 leading-relaxed">{p.symptoms}</p>
            </div>
            
            <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-600">Solusi Pengendalian Terpadu</p>
              <p className="text-sm text-emerald-800 leading-relaxed">{p.solution}</p>
            </div>
          </div>
        ))}

        {activeTab === 'fertilizers' && filteredFertilizers.map(f => (
          <div key={f.id} className="rounded-2xl bg-white p-5 shadow-sm border border-stone-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-stone-900">{f.name}</h3>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                f.type === 'Makro' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                Hara {f.type}
              </span>
            </div>
            <p className="mb-4 text-sm text-stone-600 leading-relaxed">{f.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <InfoCard label="Dosis Standar" value={f.dosage_per_ha} />
              <InfoCard label="Waktu Aplikasi" value={f.application_time} />
            </div>

            <div className="space-y-3">
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-1">Gejala Defisiensi (Kekurangan)</p>
                <p className="text-xs text-orange-800 leading-relaxed">{f.deficiency_symptoms}</p>
              </div>
              
              {f.toxicity_symptoms && (
                <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-600 mb-1">Gejala Toksisitas (Kelebihan)</p>
                  <p className="text-xs text-red-800 leading-relaxed">{f.toxicity_symptoms}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
        active ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-stone-500 border border-stone-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoCard({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-xl bg-stone-50 p-3 border border-stone-100 ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
      <p className="text-sm font-bold text-stone-700 mt-1">{value}</p>
    </div>
  );
}
