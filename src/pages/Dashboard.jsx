import { motion } from 'framer-motion';
import { Download, Moon, RefreshCcw, Sun, TrendingUp, WalletCards } from 'lucide-react';
import { useEffect } from 'react';
import { EmptyState } from '../components/EmptyState';
import { MetricCard } from '../components/MetricCard';
import { SegmentedControl } from '../components/SegmentedControl';
import { Toggle } from '../components/Toggle';
import { InvestmentPanel } from '../features/investments/InvestmentPanel';
import { scenarioPresets } from '../features/investments/instrumentConfig';
import { ProjectionCharts } from '../features/projections/ProjectionCharts';
import { ProjectionTable } from '../features/projections/ProjectionTable';
import { ScenarioComparison } from '../features/projections/ScenarioComparison';
import { useProjection } from '../hooks/useProjection';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { exportProjectionCsv } from '../utils/exportCsv';
import { formatINR } from '../utils/formatters';

const scenarioOptions = Object.entries(scenarioPresets).map(([id, item]) => ({ id, label: item.label }));
const horizons = [5, 10, 20, 30];

export function Dashboard() {
  const store = usePortfolioStore();
  const { projection, comparisons } = useProjection(store.investments, store.horizonYears, store.inflationAdjusted, store.inflationRate);
  const growthMultiple = projection.currentTotal > 0 ? projection.projectedTotal / projection.currentTotal : 0;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', store.darkMode);
  }, [store.darkMode]);

  return (
    <main className="min-h-screen bg-[#f7faf7] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="label">India focused planning</p>
              <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Net Worth Projection</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => exportProjectionCsv(projection.years)} className="btn-secondary">
                <Download size={16} />
                CSV
              </button>
              <button type="button" onClick={store.reset} className="btn-secondary">
                <RefreshCcw size={16} />
                Reset
              </button>
              <button type="button" onClick={() => store.setDarkMode(!store.darkMode)} className="btn-secondary h-10 w-10 p-0" aria-label="Toggle dark mode">
                {store.darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <p className="label mb-2">Scenario</p>
              <SegmentedControl value={store.scenario} options={scenarioOptions} onChange={store.applyScenario} />
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <p className="label mb-2">Time horizon</p>
              <div className="grid grid-cols-4 gap-1">
                {horizons.map((year) => (
                  <button
                    type="button"
                    key={year}
                    onClick={() => store.setHorizonYears(year)}
                    className={store.horizonYears === year ? 'btn-primary px-2' : 'btn-secondary px-2'}
                  >
                    {year}y
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
              <Toggle checked={store.inflationAdjusted} onChange={store.setInflationAdjusted} label="Inflation adjusted" />
              <div className="mt-3 flex items-center gap-3">
                <input type="range" min="0" max="12" step="0.5" value={store.inflationRate} onChange={(event) => store.setInflationRate(Number(event.target.value))} className="w-full accent-emerald-600" />
                <span className="w-12 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">{store.inflationRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-3">
          <MetricCard icon={WalletCards} label="Current net worth" value={formatINR(projection.currentTotal)} hint="Across saved instruments" />
          <MetricCard icon={TrendingUp} label={`${store.horizonYears} year projection`} value={formatINR(projection.projectedTotal)} hint={store.inflationAdjusted ? 'Shown in today value' : 'Nominal value'} />
          <MetricCard label="Growth multiple" value={`${growthMultiple.toFixed(1)}x`} hint="Projected divided by current" />
        </motion.section>

        {store.investments.length ? (
          <>
            <ProjectionCharts projection={projection} investments={store.investments} />
            <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
              <ProjectionTable rows={projection.years} />
              <ScenarioComparison comparisons={comparisons} />
            </div>
            <InvestmentPanel investments={store.investments} onAdd={store.addInvestment} onUpdate={store.updateInvestment} onRemove={store.removeInvestment} />
          </>
        ) : (
          <EmptyState onAdd={() => store.addInvestment('mutual_fund')} />
        )}
      </div>
    </main>
  );
}
