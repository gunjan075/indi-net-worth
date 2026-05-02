import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

  const showSalaryFields = ['epf', 'gratuity'].includes(investment.type);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-[1.2fr_0.8fr]">
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
        <button type="button" onClick={() => onRemove(investment.id)} className="btn-secondary h-10 sm:mt-5" aria-label={`Remove ${investment.name}`}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

      {showSalaryFields ? (
        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-3">
          <div>
            <label className="label">Salary annual</label>
            <input type="number" min="0" className="input mt-1" {...register('salaryAnnual')} />
          </div>
          <div>
            <label className="label">Salary growth %</label>
            <input type="number" min="0" max="30" step="0.1" className="input mt-1" {...register('salaryGrowth')} />
          </div>
          {investment.type === 'gratuity' ? (
            <div>
              <label className="label">Years of service</label>
              <input type="number" min="0" max="60" className="input mt-1" {...register('yearsOfService')} />
            </div>
          ) : (
            <div>
              <label className="label">Employer rate %</label>
              <input type="number" min="0" max="12" step="0.1" className="input mt-1" {...register('employerContributionRate')} />
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}
