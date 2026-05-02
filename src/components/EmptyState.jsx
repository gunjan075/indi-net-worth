import { Plus } from 'lucide-react';

export function EmptyState({ onAdd }) {
  return (
    <div className="panel flex min-h-56 flex-col items-center justify-center p-8 text-center">
      <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
        <Plus size={24} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">Start with an investment</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Add EPF, PPF, SIPs, FDs, stocks, or gratuity to build a year-wise net worth projection.
      </p>
      <button type="button" onClick={onAdd} className="btn-primary mt-5">
        <Plus size={16} />
        Add instrument
      </button>
    </div>
  );
}
