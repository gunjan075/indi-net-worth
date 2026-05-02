import { formatINR } from '../../utils/formatters';

export function ScenarioComparison({ comparisons }) {
  const max = Math.max(...comparisons.map((item) => item.value), 1);
  return (
    <section className="panel p-4">
      <p className="label">Scenarios</p>
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">Compare outcomes</h2>
      <div className="mt-5 space-y-4">
        {comparisons.map((item) => (
          <div key={item.id}>
            <div className="mb-1 flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
              <span className="text-slate-500 dark:text-slate-400">{formatINR(item.value, { compact: true })}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
