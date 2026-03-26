import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { VARIETIES } from '../data/knowledgeBase';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertCircle, TrendingUp, TrendingDown, CheckCircle, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

export default function YieldAnalytics() {
  const { cycles, transactions } = useStore();

  const analyticsData = useMemo(() => {
    // Only analyze cycles that are either active or harvested, preferably harvested for meaningful analysis.
    // For this module, we will show all cycles but indicate their status.
    const analyzed = cycles.map(cycle => {
      const cycleTransactions = transactions.filter(t => t.cycle_id === cycle.id);
      let income = 0;
      let expense = 0;
      
      cycleTransactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
      });

      const profit = income - expense;
      const roi = expense > 0 ? (profit / expense) * 100 : 0;
      const variety = VARIETIES.find(v => v.id === cycle.variety_id);
      
      return {
        ...cycle,
        income,
        expense,
        profit,
        roi,
        varietyName: variety ? variety.name : 'Unknown',
        yieldPotential: variety ? variety.yield_potential : '-',
      };
    }).sort((a, b) => parseISO(b.start_date).getTime() - parseISO(a.start_date).getTime());

    return analyzed;
  }, [cycles, transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const chartData = analyticsData.map(c => ({
    name: `${c.varietyName} (${format(parseISO(c.start_date), 'MMM yyyy')})`,
    Pemasukan: c.income,
    Pengeluaran: c.expense,
    Profit: c.profit
  })).reverse(); // Oldest first for chronological chart

  const averageRoi = analyticsData.length > 0 
    ? analyticsData.reduce((acc, curr) => acc + curr.roi, 0) / analyticsData.length
    : 0;

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Analisis & Prediksi Panen</h1>
        <p className="text-sm text-stone-500">Evaluasi performa finansial dan efisiensi siklus panen Anda.</p>
      </header>

      {analyticsData.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center shadow-sm">
          <BarChart2 size={48} className="mx-auto mb-4 text-stone-300" />
          <h3 className="text-lg font-bold text-stone-900 mb-2">Belum Ada Data Siklus</h3>
          <p className="text-stone-500">Tambahkan siklus tanam dan catat transaksi keuangan untuk melihat analisis panen.</p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BarChart2 size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Siklus Tercatat</p>
                <p className="text-2xl font-bold text-stone-900">{analyticsData.length}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Rata-rata Profit per Siklus</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(analyticsData.reduce((acc, curr) => acc + curr.profit, 0) / analyticsData.length)}
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl ${averageRoi >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {averageRoi >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Rata-rata ROI</p>
                <p className={`text-2xl font-bold ${averageRoi >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {averageRoi.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-start">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
              <h3 className="text-sm font-bold text-stone-900 mb-6">Perbandingan Kinerja Antar Siklus</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 11 }} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#78716c', fontSize: 11 }}
                      tickFormatter={(value) => `Rp${value / 1000}k`}
                    />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      cursor={{ fill: '#f5f5f4' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="Pemasukan" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations (PANDUAN EVALUASI NON-AI) */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4 text-stone-800">
                <AlertCircle size={20} className="text-amber-500" />
                <h3 className="font-bold text-sm">Panduan & Evaluasi</h3>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-stone-300 relative">
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <h4 className="text-xs font-bold text-stone-900 mb-1">Evaluasi Margin Keuntungan (ROI)</h4>
                  <p className="text-xs text-stone-600">
                    Jika ROI di bawah 20%, pertimbangkan untuk mengoptimalkan biaya tenaga kerja atau beralih ke varietas unggul dengan potensi hasil lebih tinggi.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <h4 className="text-xs font-bold text-stone-900 mb-1">Ketepatan Waktu Pemupukan</h4>
                  <p className="text-xs text-stone-600">
                    Pemupukan yang terlambat dapat menurunkan hasil panen hingga 15%. Pastikan mematuhi jadwal di *Timeline* untuk efisiensi penyerapan hara.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <h4 className="text-xs font-bold text-stone-900 mb-1">Manajemen Pengairan (AWD)</h4>
                  <p className="text-xs text-stone-600">
                    Sistem pengairan berselang (Intermittent/AWD) selain menghemat biaya pompa, juga terbukti memperkuat sistem perakaran padi dan mencegah kerebahan.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                  <h4 className="text-xs font-bold text-stone-900 mb-1">Pencatatan Berkelanjutan</h4>
                  <p className="text-xs text-stone-600">
                    Akurasi analisis sangat bergantung pada kedisiplinan Anda mencatat pengeluaran harian dan total penjualan gabah (pemasukan panen) di menu Keuangan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cycles Details Table */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Rincian Per Siklus</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-stone-500">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Varietas & Tanggal</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Potensi Panen</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Biaya (HPP)</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Pendapatan</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {analyticsData.map(c => (
                    <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-bold text-stone-900">{c.varietyName}</p>
                        <p className="text-xs text-stone-500">{format(parseISO(c.start_date), 'd MMM yyyy', { locale: id })} - Luas: {c.field_area} Ha</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${c.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {c.status === 'active' ? 'Berjalan' : 'Panen'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-600 text-xs">
                        {c.yieldPotential}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-red-600 whitespace-nowrap">
                        {formatCurrency(c.expense)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600 whitespace-nowrap">
                        {formatCurrency(c.income)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold whitespace-nowrap">
                        <span className={c.roi >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                          {c.roi.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
