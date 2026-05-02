import { Switch } from '@headlessui/react';
import clsx from 'clsx';

export function Toggle({ checked, onChange, label }) {
  return (
    <Switch.Group as="div" className="flex items-center justify-between gap-3">
      <Switch.Label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</Switch.Label>
      <Switch
        checked={checked}
        onChange={onChange}
        className={clsx(
          'relative inline-flex h-6 w-11 items-center rounded-full transition',
          checked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700',
        )}
      >
        <span
          className={clsx(
            'inline-block h-5 w-5 rounded-full bg-white transition',
            checked ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </Switch>
    </Switch.Group>
  );
}
