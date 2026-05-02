import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { AddInstrumentDialog } from './AddInstrumentDialog';
import { InvestmentCard } from './InvestmentCard';

export function InvestmentPanel({ investments, onAdd, onUpdate, onRemove }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const update = useCallback((id, value) => onUpdate(id, value), [onUpdate]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="label">Inputs</p>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">Investment instruments</h2>
        </div>
        <button type="button" onClick={() => setDialogOpen(true)} className="btn-primary">
          <Plus size={16} />
          Add instrument
        </button>
      </div>
      <div className="space-y-3">
        {investments.map((investment) => (
          <InvestmentCard key={investment.id} investment={investment} onUpdate={update} onRemove={onRemove} />
        ))}
      </div>
      <AddInstrumentDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAdd={onAdd} />
    </section>
  );
}
