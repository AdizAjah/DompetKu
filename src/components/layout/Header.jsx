import { formatDate } from '../../utils/dateHelpers';

export default function Header({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{subtitle}</p>
        ) : (
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            {formatDate(new Date(), 'EEEE, d MMMM yyyy')}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
