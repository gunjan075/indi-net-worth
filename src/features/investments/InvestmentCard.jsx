import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { calculateEPSMonthlyContribution, calculateEPSMonthlyPension } from '../../utils/financial';
import { formatINR } from '../../utils/formatters';
import { contributionModes } from './instrumentConfig';
import { investmentSchema } from './investmentSchema';

const moneyFields = [
  ['currentValue', 'Current value'],
  ['contribution', 'Contribution'],
];

export function InvestmentCard({ investment, onUpdate, onRemove }) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(investmentSchema),
    mode: 'onChange',
    values: investment,
  });

  useEffect(() => {
    const subscription = watch((value) => onUpdate(investment.id, value));
    return () => subscription.unsubscribe();
  }, [investment.id, onUpdate, watch]);

  const showSalaryFields = investment.type === 'gratuity';
  const showRentFields = ['real_estate_flat', 'rent_income'].includes(investment.type);
  const isGratuity = investment.type === 'gratuity';
  const isEPF = investment.type === 'epf';
  const epsContribution = calculateEPSMonthlyContribution(investment);
  const epsPension = calculateEPSMonthlyPension(investment, Math.max(0, (investment.epsPensionAge ?? 58) - (investment.currentAge ?? 33)));

  return (
    <article className="flex min-h-[560px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="min-w-0">
          <p className="label">{investment.category}</p>
          <h3 className="mt-1 truncate text-lg font-bold text-slate-950 dark:text-white">{investment.name}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isGratuity ? 'Employer benefit' : `${formatINR(investment.currentValue)} current`}
          </p>
        </div>
        <button type="button" onClick={() => onRemove(investment.id)} className="btn-secondary h-9 w-9 shrink-0 p-0" aria-label={`Remove ${investment.name}`}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4 flex-1">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Name</label>
            <input className="input mt-1" {...register('name')} />
            {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input mt-1" {...register('category')} />
          </div>
        </div>

      {isGratuity ? (
        <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-100">
          Gratuity is paid by the employer. It is projected from Basic + DA and service years, with no employee contribution.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {moneyFields.map(([field, label]) => (
            <div key={field}>
              <label className="label">{label}</label>
              <input type="number" min="0" className="input mt-1" {...register(field)} />
            </div>
          ))}
          <div>
            <label className="label">Mode</label>
            <select className="input mt-1" {...register('contributionMode')}>
              {contributionModes.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Return %</label>
            <input type="number" min="0" max="40" step="0.1" className="input mt-1" {...register('expectedReturn')} />
            <input type="range" min="0" max="25" step="0.1" className="mt-2 w-full accent-emerald-600" {...register('expectedReturn')} />
          </div>
          <div>
            <label className="label">Lock-in years</label>
            <input type="number" min="0" max="60" className="input mt-1" {...register('lockInYears')} />
          </div>
        </div>
      )}

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2">
        <div>
          <label className="label">Current age</label>
          <input type="number" min="0" max="100" className="input mt-1" {...register('currentAge')} />
        </div>
        <div>
          <label className="label">Maturity age</label>
          <input type="number" min="0" max="100" className="input mt-1" {...register('maturityAge')} />
        </div>
        {!isGratuity ? (
          <div>
            <label className="label">Max invest years</label>
            <input type="number" min="0" max="80" className="input mt-1" {...register('maxContributionYears')} />
          </div>
        ) : null}
      </div>

      {showSalaryFields ? (
        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2">
          {isGratuity ? (
            <>
              <div>
                <label className="label">Basic + DA monthly</label>
                <input type="number" min="0" className="input mt-1" {...register('basicDaMonthly')} />
              </div>
              <div>
                <label className="label">Basic + DA growth %</label>
                <input type="number" min="0" max="30" step="0.1" className="input mt-1" {...register('basicDaGrowth')} />
              </div>
              <div>
                <label className="label">Years of service</label>
                <input type="number" min="0" max="60" step="0.1" className="input mt-1" {...register('yearsOfService')} />
              </div>
              <div>
                <label className="label">Formula divisor</label>
                <select className="input mt-1" {...register('gratuityDivisor')}>
                  <option value="26">26 - covered under Act</option>
                  <option value="30">30 - non-Act approximation</option>
                </select>
              </div>
              <div>
                <label className="label">Tax-free cap</label>
                <input type="number" min="0" className="input mt-1" {...register('gratuityTaxExemption')} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="label">Salary annual</label>
                <input type="number" min="0" className="input mt-1" {...register('salaryAnnual')} />
              </div>
              <div>
                <label className="label">Salary growth %</label>
                <input type="number" min="0" max="30" step="0.1" className="input mt-1" {...register('salaryGrowth')} />
              </div>
              {isEPF ? null : (
                <div>
                  <label className="label">Employer rate %</label>
                  <input type="number" min="0" max="12" step="0.1" className="input mt-1" {...register('employerContributionRate')} />
                </div>
              )}
            </>
          )}
        </div>
      ) : null}

      {isEPF ? (
        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="rounded-md bg-sky-50 p-3 text-sm text-sky-950 dark:bg-sky-500/10 dark:text-sky-100">
            EPS is not added to net worth as a corpus. It is shown as a future monthly pension estimate.
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">EPS monthly</label>
              <input type="number" min="0" max="1250" className="input mt-1" {...register('epsMonthlyContribution')} />
            </div>
            <div>
              <label className="label">EPS salary cap</label>
              <input type="number" min="0" className="input mt-1" {...register('epsSalaryCapMonthly')} />
            </div>
            <div>
              <label className="label">Pensionable salary</label>
              <input type="number" min="0" className="input mt-1" {...register('epsPensionableSalaryMonthly')} />
            </div>
            <div>
              <label className="label">EPS service years</label>
              <input type="number" min="0" max="60" step="0.1" className="input mt-1" {...register('epsYearsOfService')} />
            </div>
            <div>
              <label className="label">Full pension age</label>
              <input type="number" min="50" max="70" className="input mt-1" {...register('epsPensionAge')} />
            </div>
            <div>
              <label className="label">Minimum pension</label>
              <input type="number" min="0" className="input mt-1" {...register('epsMinimumPension')} />
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <p className="label">Capped EPS contribution</p>
              <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{formatINR(investment.epsMonthlyContribution || epsContribution)} / month</p>
            </div>
            <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <p className="label">Estimated EPS pension</p>
              <p className="mt-1 text-lg font-bold text-slate-950 dark:text-white">{formatINR(epsPension)} / month</p>
            </div>
          </div>
        </div>
      ) : null}

      {showRentFields ? (
        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-2">
          <div>
            <label className="label">Annual rent</label>
            <input type="number" min="0" className="input mt-1" {...register('rentAnnual')} />
          </div>
          <div>
            <label className="label">Rent growth %</label>
            <input type="number" min="0" max="30" step="0.1" className="input mt-1" {...register('rentGrowth')} />
          </div>
          <div>
            <label className="label">Rent reinvest %</label>
            <input type="number" min="0" max="30" step="0.1" className="input mt-1" {...register('rentalYieldReinvestRate')} />
          </div>
        </div>
      ) : null}
      </div>
    </article>
  );
}
