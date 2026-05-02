import clsx from 'clsx';

export function SegmentedControl({ value, options, onChange }) {
  return (
    <div className="grid grid-cols-3 rounded-md bg-slate-100 p-1 dark:bg-slate-900">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={clsx(
            'rounded px-3 py-2 text-sm font-semibold transition',
            value === option.id
              ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
