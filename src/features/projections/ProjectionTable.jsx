import { formatINR } from '../../utils/formatters';

export function ProjectionTable({ rows }) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <p className="label">Timeline</p>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Year-wise projection</h2>
      </div>
      <div className="max-h-96 overflow-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Projected net worth</th>
              <th className="px-4 py-3">Nominal value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row) => (
              <tr key={row.label} className="text-slate-700 dark:text-slate-200">
                <td className="px-4 py-3 font-semibold">{row.label}</td>
                <td className="px-4 py-3">{formatINR(row.total)}</td>
                <td className="px-4 py-3">{formatINR(row.nominalTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
