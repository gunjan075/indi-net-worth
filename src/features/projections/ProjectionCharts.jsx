import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatINR } from '../../utils/formatters';

const colors = ['#059669', '#2563eb', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#65a30d', '#c026d3', '#475569', '#ea580c'];

const tooltipFormatter = (value) => formatINR(value, { compact: true });

export function ProjectionCharts({ projection, investments }) {
  const chartInvestments = investments.slice(0, 8);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
      <section className="panel p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="label">Projection</p>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Net worth over time</h2>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={projection.years}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tickFormatter={(value) => formatINR(value, { compact: true })} tick={{ fontSize: 12 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Line type="monotone" dataKey="total" name="Net worth" stroke="#059669" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel p-4">
        <p className="label">Distribution</p>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Final year mix</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={projection.breakdown} dataKey="value" nameKey="name" innerRadius={60} outerRadius={105} paddingAngle={2}>
                {projection.breakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={tooltipFormatter} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel p-4 xl:col-span-2">
        <p className="label">Allocation</p>
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Instrument growth stack</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer>
            <AreaChart data={projection.years}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tickFormatter={(value) => formatINR(value, { compact: true })} tick={{ fontSize: 12 }} />
              <Tooltip formatter={tooltipFormatter} />
              {chartInvestments.map((item, index) => (
                <Area key={item.id} type="monotone" dataKey={item.name} stackId="1" stroke={colors[index % colors.length]} fill={colors[index % colors.length]} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
