import { useLiveQuery } from 'dexie-react-hooks';
import db from './db';

/**
 * Hook: Get app settings (reactive)
 */
export function useSettings() {
  return useLiveQuery(async () => {
    const settings = await db.settings.get(1);
    if (!settings) {
      // Return defaults if not yet seeded
      return {
        id: 1,
        dailyLimit: 50000,
        isBudgetEnabled: true,
        budgetMode: 'otomatis',
        targetDate: null,
        currencySymbol: 'Rp',
        theme: 'dark',
        createdAt: new Date()
      };
    }
    return settings;
  });
}

/**
 * Hook: Get all categories
 */
export function useCategories(type = null) {
  return useLiveQuery(async () => {
    if (type) {
      return await db.categories.where('type').equals(type).toArray();
    }
    return await db.categories.toArray();
  }, [type]);
}

/**
 * Update settings (partial update)
 */
export async function updateSettings(partial) {
  const exists = await db.settings.get(1);
  if (exists) {
    return await db.settings.update(1, partial);
  } else {
    return await db.settings.add({ id: 1, ...partial });
  }
}

/**
 * Add a custom category
 */
export async function addCategory(data) {
  return await db.categories.add({
    name: data.name,
    icon: data.icon || 'Tag',
    color: data.color || '#64748b',
    type: data.type
  });
}

/**
 * Delete a custom category
 */
export async function deleteCategory(id) {
  return await db.categories.delete(id);
}
