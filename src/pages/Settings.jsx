import { useState, useRef } from 'react';
import Header from '../components/layout/Header';
import CurrencyInput from '../components/common/CurrencyInput';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useResetWalkthrough } from '../components/common/Walkthrough';
import { useSettings, useCategories, updateSettings, addCategory, deleteCategory } from '../db/useSettings';
import { useTheme } from '../hooks/useTheme';
import { exportData, importData, clearAllData } from '../utils/backup';
import { formatCurrency } from '../utils/formatCurrency';
import { getCategoryIcon, availableIcons, availableColors } from '../utils/categories';
import { Download, Upload, Trash2, Moon, Sun, Monitor, Plus, X, Palette, Tag, Wallet, SwatchBook, HardDrive, ShieldAlert, Lock, Info, RotateCcw, BookOpen } from 'lucide-react';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const Section = ({ icon: Icon, title, children }) => (
  <div className="card p-6 space-y-4">
    <h2 className="flex items-center gap-2.5 text-base font-semibold text-surface-800 dark:text-surface-200">
      {Icon && <Icon size={20} className="text-primary-500" />}
      {title}
    </h2>
    {children}
  </div>
);

export default function Settings() {
  const settings = useSettings();
  const { theme, setTheme, isDark } = useTheme();
  const expenseCategories = useCategories('expense');
  const incomeCategories = useCategories('income');
  const fileInputRef = useRef(null);
  const resetWalkthrough = useResetWalkthrough();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showCatForm, setShowCatForm] = useState(false);
  const [newCatType, setNewCatType] = useState('expense');
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Tag');
  const [newCatColor, setNewCatColor] = useState('#10b981');

  const handleDailyLimitChange = async (value) => {
    await updateSettings({ dailyLimit: value });
  };

  const handleExport = async () => {
    const result = await exportData();
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await importData(file);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    e.target.value = '';
  };

  const handleClearAll = async () => {
    const result = await clearAllData();
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setShowClearConfirm(false);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) { toast.error('Masukkan nama kategori'); return; }
    await addCategory({ name: newCatName.trim(), icon: newCatIcon, color: newCatColor, type: newCatType });
    toast.success('Kategori ditambahkan!');
    setNewCatName(''); setShowCatForm(false);
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    toast.success('Kategori dihapus');
  };

  // (Moved Section outside)

  return (
    <div>
      <Header title="Pengaturan" subtitle="Kustomisasi aplikasimu" />
      <div className="space-y-6 max-w-2xl">
        {/* Daily Limit */}
        <Section icon={Wallet} title="Anggaran Harian">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Aktifkan Anggaran Harian</p>
            <button 
              type="button"
              onClick={() => updateSettings({ isBudgetEnabled: !(settings?.isBudgetEnabled ?? true) })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-900 ${
                (settings?.isBudgetEnabled ?? true) ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'
              }`}
            >
              <span className="sr-only">Toggle Budget</span>
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                (settings?.isBudgetEnabled ?? true) ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          {(settings?.isBudgetEnabled ?? true) && (
            <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">Batas maksimal pengeluaran per hari</p>
              <CurrencyInput value={settings?.dailyLimit || 50000} onChange={handleDailyLimitChange} />
              <p className="text-xs text-surface-400 mt-2">Saat ini: {formatCurrency(settings?.dailyLimit || 50000)}/hari</p>
            </div>
          )}
        </Section>

        {/* Theme */}
        <Section icon={Palette} title="Tampilan">
          <div className="grid grid-cols-3 gap-3">
            {[{v:'light',l:'Terang',I:Sun},{v:'dark',l:'Gelap',I:Moon},{v:'system',l:'Sistem',I:Monitor}].map(({v,l,I})=>(
              <button key={v} onClick={()=>setTheme(v)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${theme===v?'bg-primary-500/10 ring-2 ring-primary-500':'hover:bg-surface-100 dark:hover:bg-surface-700/50'}`}>
                <I size={22} className={theme===v?'text-primary-500':'text-surface-400'}/>
                <span className={`text-sm font-medium ${theme===v?'text-primary-600 dark:text-primary-400':'text-surface-600 dark:text-surface-400'}`}>{l}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Categories */}
        <Section icon={SwatchBook} title="Kategori">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-surface-400 uppercase">Pengeluaran</p>
            <div className="flex flex-wrap gap-2">
              {expenseCategories?.map(cat=>{const Icon=getCategoryIcon(cat.icon);return(
                <div key={cat.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-900 group">
                  <Icon size={14} style={{color:cat.color}}/><span className="text-sm text-surface-700 dark:text-surface-300">{cat.name}</span>
                  <button onClick={()=>handleDeleteCategory(cat.id)} className="opacity-0 group-hover:opacity-100 text-surface-400 hover:text-red-500 transition-all"><X size={12}/></button>
                </div>
              );})}
            </div>
            <p className="text-xs font-semibold text-surface-400 uppercase mt-4">Pemasukan</p>
            <div className="flex flex-wrap gap-2">
              {incomeCategories?.map(cat=>{const Icon=getCategoryIcon(cat.icon);return(
                <div key={cat.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-900 group">
                  <Icon size={14} style={{color:cat.color}}/><span className="text-sm text-surface-700 dark:text-surface-300">{cat.name}</span>
                  <button onClick={()=>handleDeleteCategory(cat.id)} className="opacity-0 group-hover:opacity-100 text-surface-400 hover:text-red-500 transition-all"><X size={12}/></button>
                </div>
              );})}
            </div>
            <button onClick={()=>setShowCatForm(true)} className="btn btn-secondary text-sm mt-2"><Plus size={16}/>Tambah Kategori</button>
          </div>
        </Section>

        {/* Backup & Restore */}
        <Section icon={HardDrive} title="Backup & Restore">
          <p className="text-sm text-surface-500 dark:text-surface-400">Unduh data sebagai file JSON atau pulihkan dari backup</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleExport} className="btn btn-primary flex-1"><Download size={16}/>Ekspor Data</button>
            <button onClick={()=>fileInputRef.current?.click()} className="btn btn-secondary flex-1"><Upload size={16}/>Impor Data</button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden"/>
          </div>
        </Section>

        {/* Danger Zone */}
        <Section icon={ShieldAlert} title="Zona Bahaya">
          <p className="text-sm text-surface-500 dark:text-surface-400">Hapus semua transaksi dan hutang. Pengaturan dan kategori tetap tersimpan.</p>
          <button onClick={()=>setShowClearConfirm(true)} className="btn btn-danger"><Trash2 size={16}/>Hapus Semua Data</button>
        </Section>

        {/* Panduan / Walkthrough */}
        <Section icon={BookOpen} title="Panduan">
          <p className="text-sm text-surface-500 dark:text-surface-400">Tampilkan kembali panduan interaktif untuk mempelajari fitur-fitur utama DompetKu.</p>
          <button onClick={resetWalkthrough} className="btn btn-secondary">
            <RotateCcw size={16} />Reset Panduan
          </button>
        </Section>

        {/* About */}
        <div className="card p-6 text-center">
          <p className="text-lg font-bold text-surface-800 dark:text-surface-200">DompetKu</p>
          <p className="text-sm text-surface-400 mt-1">v1.0.0 · Manajemen Keuangan Pribadi</p>
          <p className="text-xs text-surface-400 mt-2 flex items-center justify-center gap-1.5">
            <Lock size={12} className="text-primary-500" />
            Data tersimpan 100% di perangkat Anda
          </p>
        </div>
      </div>

      {/* Category Form Modal */}
      <Modal isOpen={showCatForm} onClose={()=>setShowCatForm(false)} title="Tambah Kategori" size="sm">
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-surface-100 dark:bg-surface-700 rounded-xl">
            {['expense','income'].map(t=>(
              <button key={t} type="button" onClick={()=>setNewCatType(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${newCatType===t?'bg-white dark:bg-surface-600 shadow-sm text-surface-900 dark:text-white':'text-surface-500'}`}>
                {t==='expense'?'Pengeluaran':'Pemasukan'}
              </button>
            ))}
          </div>
          <input type="text" value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nama kategori" className="input-field"/>
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Ikon</p>
            <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
              {availableIcons.map(ic=>{const I=getCategoryIcon(ic.name);return(
                <button key={ic.name} type="button" onClick={()=>setNewCatIcon(ic.name)}
                  className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${newCatIcon===ic.name?'bg-primary-500/15 ring-2 ring-primary-500':'hover:bg-surface-100 dark:hover:bg-surface-700'}`}>
                  <I size={18} style={{color:newCatColor}}/><span className="text-[9px] text-surface-400">{ic.label}</span>
                </button>
              );})}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Warna</p>
            <div className="flex flex-wrap gap-2">
              {availableColors.map(c=>(
                <button key={c} type="button" onClick={()=>setNewCatColor(c)}
                  className={`w-8 h-8 rounded-full transition-all ${newCatColor===c?'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-surface-800 scale-110':''}`}
                  style={{backgroundColor:c}}/>
              ))}
            </div>
          </div>
          <button onClick={handleAddCategory} className="btn btn-primary w-full">Tambah</button>
        </div>
      </Modal>

      <ConfirmDialog isOpen={showClearConfirm} onConfirm={handleClearAll} onCancel={()=>setShowClearConfirm(false)}
        title="Hapus Semua Data?" message="Semua transaksi dan hutang akan dihapus permanen. Pastikan Anda sudah backup data." confirmText="Ya, Hapus Semua"/>
    </div>
  );
}
