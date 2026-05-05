import { useCategories } from '../../db/useSettings';
import { getCategoryIcon } from '../../utils/categories';

export default function CategoryPicker({ type, value, onChange }) {
  const categories = useCategories(type);

  if (!categories) return <div className="text-sm text-surface-400">Memuat...</div>;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
      {categories.map((cat) => {
        const Icon = getCategoryIcon(cat.icon);
        const isSelected = value === cat.name;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.name)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200
              ${isSelected
                ? 'bg-primary-500/10 dark:bg-primary-500/15 ring-2 ring-primary-500 scale-105'
                : 'hover:bg-surface-100 dark:hover:bg-surface-700/50'
              }`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform"
              style={{ backgroundColor: `${cat.color}20` }}
            >
              <Icon size={18} style={{ color: cat.color }} />
            </div>
            <span className={`text-[11px] font-medium truncate w-full text-center
              ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-surface-600 dark:text-surface-400'}`}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
