import { useState } from 'react';
import Header from '../components/layout/Header';
import { useCategoryBreakdown, useMonthlyStats } from '../db/useTransactions';
import { useFundSourceStats } from '../db/useFundSources';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { getCategoryIcon } from '../utils/categories';
import { Wallet, Banknote, Smartphone, MoreHorizontal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const FUND_TYPE_ICONS = { cash: Wallet, bank: Banknote, ewallet: Smartphone, other: MoreHorizontal };

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const categoryBreakdown = useCategoryBreakdown(selectedMonth);
  const monthlyStats = useMonthlyStats(selectedMonth);
  const fundSourceStats = useFundSourceStats(selectedMonth);
  const totalExpense = categoryBreakdown?.reduce((s, c) => s + c.amount, 0) || 0;

  const handleMonthChange = (dir) => {
    const d = new Date(selectedMonth);
    d.setMonth(d.getMonth() + dir);
    setSelectedMonth(d);
  };

  const compData = [
    { name: 'Pemasukan', amount: monthlyStats?.income || 0, color: '#10b981' },
    { name: 'Pengeluaran', amount: monthlyStats?.expense || 0, color: '#ef4444' },
  ];

  return (
    <div>
      <Header title="Laporan" subtitle="Analisis keuanganmu" />
      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={() => handleMonthChange(-1)} className="btn btn-ghost p-2">←</button>
        <span className="text-lg font-semibold text-surface-800 dark:text-surface-200 min-w-[180px] text-center">
          {MONTHS[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
        </span>
        <button onClick={() => handleMonthChange(1)} className="btn btn-ghost p-2">→</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 overflow-hidden min-w-0">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-4">Ringkasan Bulanan</h3>
          <div className="space-y-4 mb-6">
            {[{l:'Pemasukan',v:monthlyStats?.income||0,c:'text-emerald-600 dark:text-emerald-400',dot:'bg-emerald-500'},
              {l:'Pengeluaran',v:monthlyStats?.expense||0,c:'text-red-500 dark:text-red-400',dot:'bg-red-500'}].map(i=>(
              <div key={i.l} className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-3 min-w-0"><div className={`w-3 h-3 rounded-full shrink-0 ${i.dot}`}/><span className="text-sm text-surface-600 dark:text-surface-400">{i.l}</span></div>
                <span className={`text-sm font-bold shrink-0 ml-2 ${i.c}`}>{formatCurrency(i.v)}</span>
              </div>
            ))}
            <div className="border-t border-surface-200 dark:border-surface-700 pt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">Selisih</span>
              <span className={`text-sm font-bold ${(monthlyStats?.balance||0)>=0?'text-emerald-600 dark:text-emerald-400':'text-red-500 dark:text-red-400'}`}>
                {formatCurrency(monthlyStats?.balance||0)}
              </span>
            </div>
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" horizontal={false}/>
                <XAxis type="number" tickFormatter={v=>formatCompactCurrency(v)} tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:12,fill:'#94a3b8'}} axisLine={false} tickLine={false} width={80}/>
                <Bar dataKey="amount" radius={[0,8,8,0]}>{compData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 overflow-hidden min-w-0">
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-4">Pengeluaran per Kategori</h3>
          {categoryBreakdown && categoryBreakdown.length > 0 ? (
            <>
              <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="amount">
                    {categoryBreakdown.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie><Tooltip/></PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {categoryBreakdown.map(cat=>{
                  const Icon=getCategoryIcon(cat.icon);
                  const pct=totalExpense>0?((cat.amount/totalExpense)*100).toFixed(1):0;
                  return(<div key={cat.name} className="flex items-center gap-3 py-1.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor:`${cat.color}20`}}><Icon size={14} style={{color:cat.color}}/></div>
                    <span className="text-sm text-surface-700 dark:text-surface-300 flex-1">{cat.name}</span>
                    <span className="text-xs text-surface-400 mr-2">{pct}%</span>
                    <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{formatCurrency(cat.amount)}</span>
                  </div>);
                })}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-surface-400 text-sm">Belum ada pengeluaran bulan ini</div>
          )}
        </div>
      </div>

      {/* Alokasi Sumber Dana */}
      <div className="card p-6 mt-6 overflow-hidden min-w-0">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-4">Alokasi per Sumber Dana</h3>
        {fundSourceStats && fundSourceStats.length > 0 ? (
          <div className="space-y-4">
            {fundSourceStats.map(source => {
              const Icon = FUND_TYPE_ICONS[source.type] || Wallet;
              const totalAmount = source.income + source.expense;
              const grandTotal = fundSourceStats.reduce((sum, s) => sum + s.income + s.expense, 0);
              const pct = grandTotal > 0 ? ((totalAmount / grandTotal) * 100).toFixed(1) : 0;
              return (
                <div key={source.id || 'none'} className="flex flex-col sm:flex-row sm:items-center gap-3 py-2 border-b border-surface-100 dark:border-surface-700/50 last:border-0">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${source.color}20` }}>
                      <Icon size={18} style={{ color: source.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{source.name}</p>
                      {source.bankName && <p className="text-[11px] text-surface-400">{source.bankName}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:w-[50%] justify-between sm:justify-end">
                    <div className="flex gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-surface-400 uppercase tracking-wider mb-0.5">Masuk</p>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+{formatCompactCurrency(source.income)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-surface-400 uppercase tracking-wider mb-0.5">Keluar</p>
                        <p className="text-xs font-semibold text-red-500 dark:text-red-400">-{formatCompactCurrency(source.expense)}</p>
                      </div>
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-sm font-bold text-surface-700 dark:text-surface-300">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[100px] flex items-center justify-center text-surface-400 text-sm">Belum ada transaksi bulan ini</div>
        )}
      </div>
    </div>
  );
}
