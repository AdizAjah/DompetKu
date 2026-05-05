import db from '../db/db';

const APP_VERSION = '1.0.0';

/**
 * Export all data as a JSON file download
 */
export async function exportData() {
  try {
    const [transactions, debts, debtPayments, settings, categories, savings, savingsDeposits] = await Promise.all([
      db.transactions.toArray(),
      db.debts.toArray(),
      db.debtPayments.toArray(),
      db.settings.toArray(),
      db.categories.toArray(),
      db.savings.toArray(),
      db.savingsDeposits.toArray()
    ]);

    const data = {
      _meta: {
        app: 'DompetKu',
        version: APP_VERSION,
        exportDate: new Date().toISOString(),
        totalTransactions: transactions.length,
        totalDebts: debts.length,
        totalSavings: savings.length
      },
      transactions,
      debts,
      debtPayments,
      settings,
      categories,
      savings,
      savingsDeposits
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const dateStr = new Date().toISOString().split('T')[0];
    const defaultFilename = `dompetku-backup-${dateStr}.json`;

    if (window.showSaveFilePicker) {
      try {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: defaultFilename,
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return { success: true, message: 'Data berhasil disimpan!' };
      } catch (err) {
        if (err.name === 'AbortError') {
          return { success: false, message: 'Penyimpanan dibatalkan.' };
        }
        throw err;
      }
    } else {
      // Fallback for browsers that don't support showSaveFilePicker
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = defaultFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, message: 'Data berhasil diekspor!' };
    }
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, message: 'Gagal mengekspor data: ' + error.message };
  }
}

/**
 * Import data from a JSON file
 * @param {File} file - The JSON file to import
 */
export async function importData(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Validate structure
    if (!data._meta || data._meta.app !== 'DompetKu') {
      return { success: false, message: 'File tidak valid. Pastikan file berasal dari DompetKu.' };
    }

    // Clear existing data and import
    await db.transaction('rw', db.transactions, db.debts, db.debtPayments, db.settings, db.categories, db.savings, db.savingsDeposits, async () => {
      // Clear all tables
      await db.transactions.clear();
      await db.debts.clear();
      await db.debtPayments.clear();
      await db.settings.clear();
      await db.categories.clear();
      await db.savings.clear();
      await db.savingsDeposits.clear();

      // Import data
      if (data.transactions?.length) {
        await db.transactions.bulkAdd(data.transactions.map(t => {
          const { id, ...rest } = t;
          return rest;
        }));
      }
      if (data.debts?.length) {
        await db.debts.bulkAdd(data.debts.map(d => {
          const { id, ...rest } = d;
          return rest;
        }));
      }
      if (data.debtPayments?.length) {
        await db.debtPayments.bulkAdd(data.debtPayments.map(p => {
          const { id, ...rest } = p;
          return rest;
        }));
      }
      if (data.settings?.length) {
        await db.settings.bulkAdd(data.settings);
      }
      if (data.categories?.length) {
        await db.categories.bulkAdd(data.categories.map(c => {
          const { id, ...rest } = c;
          return rest;
        }));
      }
      if (data.savings?.length) {
        await db.savings.bulkAdd(data.savings.map(s => {
          const { id, ...rest } = s;
          return rest;
        }));
      }
      if (data.savingsDeposits?.length) {
        await db.savingsDeposits.bulkAdd(data.savingsDeposits.map(d => {
          const { id, ...rest } = d;
          return rest;
        }));
      }
    });

    return { 
      success: true, 
      message: `Data berhasil diimpor! ${data._meta.totalTransactions || 0} transaksi, ${data._meta.totalDebts || 0} hutang.` 
    };
  } catch (error) {
    console.error('Import failed:', error);
    if (error instanceof SyntaxError) {
      return { success: false, message: 'Format file tidak valid. Pastikan file JSON yang benar.' };
    }
    return { success: false, message: 'Gagal mengimpor data: ' + error.message };
  }
}

/**
 * Clear all data from the database
 */
export async function clearAllData() {
  try {
    await db.transaction('rw', db.transactions, db.debts, db.debtPayments, db.savings, db.savingsDeposits, async () => {
      await db.transactions.clear();
      await db.debts.clear();
      await db.debtPayments.clear();
      await db.savings.clear();
      await db.savingsDeposits.clear();
    });
    return { success: true, message: 'Semua data berhasil dihapus.' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus data: ' + error.message };
  }
}
