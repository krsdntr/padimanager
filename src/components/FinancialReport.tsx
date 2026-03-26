import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Transaction, TransactionType, TransactionCategory } from '../types';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Wallet, TrendingUp, TrendingDown, Plus, Trash2, PieChart, DollarSign, Activity, X } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function FinancialReport() {
  const { transactions, activeCycle, addTransaction, deleteTransaction } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [filterCycle, setFilterCycle] = useState<'all' | 'active'>('active');

  useEffect(() => {
    if (isAdding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAdding]);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense' as TransactionType,
    category: 'operasional' as TransactionCategory,
    amount: '',
    description: ''
  });

  const categories: { value: TransactionCategory; label: string }[] = [
    { value: 'benih', label: 'Benih' },
    { value: 'pupuk', label: 'Pupuk' },
    { value: 'pestisida', label: 'Pestisida' },
    { value: 'tenaga_kerja', label: 'Tenaga Kerja' },
    { value: 'sewa_lahan', label: 'Sewa Lahan' },
    { value: 'panen', label: 'Hasil Panen' },
    { value: 'operasional', label: 'Operasional Lainnya' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#6366f1', '#64748b'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) return;

    addTransaction({
      cycle_id: activeCycle?.id,
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      category: formData.category,
      amount: Number(formData.amount),
      description: formData.description
    });

    setIsAdding(false);
    setFormData({
      ...formData,
      amount: '',
      description: ''
    });
  };

  const filteredTransactions = useMemo(() => {
    if (filterCycle === 'active' && activeCycle) {
      return transactions.filter(t => t.cycle_id === activeCycle.id);
    }
    return transactions;
  }, [transactions, activeCycle, filterCycle]);

  const { totalIncome, totalExpense, netProfit, roi, expenseByCategory } = useMemo(() => {
    let income = 0;
    let expense = 0;
    const categoryTotals: Record<string, number> = {};

    filteredTransactions.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    const profit = income - expense;
    const returnOnInvestment = expense > 0 ? ((profit) / expense) * 100 : 0;

    const pieData = Object.entries(categoryTotals).map(([key, value]) => ({
      name: categories.find(c => c.value === key)?.label || key,
      value
    })).sort((a, b) => b.value - a.value);

    return {
      totalIncome: income,
      totalExpense: expense,
      netProfit: profit,
      roi: returnOnInvestment,
      expenseByCategory: pieData
    };
  }, [filteredTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const sortedTransactions = [...filteredTransactions].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  const barData = [
    { name: 'Pemasukan', amount: totalIncome, fill: '#059669' },
    { name: 'Pengeluaran', amount: totalExpense, fill: '#ef4444' }
  ];

  return (
    <div className="p-6">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Laporan Keuangan</h1>
          <p className="text-sm text-stone-500">Pantau arus kas dan profitabilitas pertanian Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={filterCycle}
            onChange={(e) => setFilterCycle(e.target.value as any)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="active">Siklus Aktif</option>
            <option value="all">Semua Siklus</option>
          </select>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-emerald-700 shadow-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Tambah Transaksi</span>
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Total Pemasukan</h3>
          </div>
          <p className="text-2xl font-bold text-stone-900">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <TrendingDown size={20} />
            </div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Total Pengeluaran</h3>
          </div>
          <p className="text-2xl font-bold text-stone-900">{formatCurrency(totalExpense)}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet size={20} />
            </div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">Laba Bersih</h3>
          </div>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Activity size={20} />
            </div>
            <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider">ROI (Return)</h3>
          </div>
          <p className={`text-2xl font-bold ${roi >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {roi.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      {filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 mb-6">Arus Kas</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#78716c', fontSize: 12 }}
                    tickFormatter={(value) => `Rp ${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    cursor={{ fill: '#f5f5f4' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="text-sm font-bold text-stone-900 mb-6">Pengeluaran per Kategori</h3>
            {expenseByCategory.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-stone-400 text-sm">
                Belum ada data pengeluaran.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md animate-in zoom-in-95 duration-200 rounded-[32px] bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="mb-6 flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
              <h2 className="text-2xl font-bold text-stone-900">Tambah Transaksi Baru</h2>
              <button 
                onClick={() => setIsAdding(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Tanggal</label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Jenis</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="expense">Pengeluaran</option>
                    <option value="income">Pemasukan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Kategori</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as TransactionCategory})}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Nominal (Rp)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  placeholder="Contoh: 500000"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Keterangan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Beli benih Inpari 32"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 rounded-2xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900">Riwayat Transaksi</h2>
        </div>
        
        {sortedTransactions.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            <DollarSign size={48} className="mx-auto mb-4 text-stone-300" />
            <p>Belum ada data transaksi keuangan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Tanggal</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Keterangan</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Kategori</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Pemasukan</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Pengeluaran</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 text-stone-600 whitespace-nowrap">
                      {format(parseISO(t.date), 'd MMM yyyy', { locale: id })}
                    </td>
                    <td className="px-6 py-4 font-medium text-stone-900">
                      {t.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md text-xs font-medium capitalize">
                        {t.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      {t.type === 'income' ? formatCurrency(t.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">
                      {t.type === 'expense' ? formatCurrency(t.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => {
                          if (window.confirm('Hapus transaksi ini?')) {
                            deleteTransaction(t.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
