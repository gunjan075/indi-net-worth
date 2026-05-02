import { motion } from 'framer-motion';

export function MetricCard({ icon: Icon, label, value, hint }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
          {hint ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-md bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Icon size={20} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
