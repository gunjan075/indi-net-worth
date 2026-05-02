import { Dialog, DialogPanel, DialogTitle, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { instrumentTemplates } from './instrumentConfig';

const templates = Object.values(instrumentTemplates);

export function AddInstrumentDialog({ open, onClose, onAdd }) {
  const [selected, setSelected] = useState(templates[0]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-950/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-5 shadow-2xl dark:bg-slate-950">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-bold text-slate-950 dark:text-white">Add instrument</DialogTitle>
            <button type="button" onClick={onClose} className="btn-secondary h-9 w-9 p-0" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="mt-5">
            <label className="label">Template</label>
            <Listbox value={selected} onChange={setSelected}>
              <div className="relative mt-2">
                <ListboxButton className="input flex items-center justify-between text-left">
                  <span>{selected.name}</span>
                  <ChevronDown size={16} />
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-md border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  {templates.map((template) => (
                    <ListboxOption
                      key={template.type}
                      value={template}
                      className="flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm text-slate-700 data-[focus]:bg-emerald-50 dark:text-slate-100 dark:data-[focus]:bg-slate-800"
                    >
                      {template.name}
                      {selected.type === template.type ? <Check size={16} className="text-emerald-600" /> : null}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
          </div>

          <div className="mt-5 rounded-md bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            {selected.category} template with {selected.expectedReturn}% expected annual return.
          </div>

          <button
            type="button"
            onClick={() => {
              onAdd(selected.type);
              onClose();
            }}
            className="btn-primary mt-5 w-full"
          >
            <Plus size={16} />
            Add {selected.name}
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
