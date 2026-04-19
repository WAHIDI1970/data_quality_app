import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  ChevronDown,
  Check,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiFetch } from '../lib/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// =====================
// Types
// =====================
interface KriInsights {
  total: number;
  number_business: number;
  number_individual: number;
}

interface TopOffender {
  kri: string;
  count: number;
}

interface PivotRow {
  snapshot_date: string;
  [key: string]: string | number;
}

interface AnalyticsRes {
  table: PivotRow[];
  time: string[];
  kris: string[];
}

interface MetricCardProps {
  label: string;
  value: number;
}

interface KriMultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

// =====================
// Colors
// =====================
const COLORS = [
  '#22c55e',
  '#06b6d4',
  '#f97316',
  '#a855f7',
  '#ef4444',
  '#eab308',
  '#14b8a6',
  '#3b82f6',
  '#ec4899',
  '#8b5cf6',
];

// =====================
// Main Component
// =====================
export default function KRIAnalytics() {
  const [insights, setInsights] = useState<KriInsights | null>(null);
  const [topOffenders, setTopOffenders] = useState<TopOffender[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRes | null>(null);

  const [selectedKri, setSelectedKri] = useState<string>('');
  const [selectedKris, setSelectedKris] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);

        const [ins, top, aly] = await Promise.all([
          apiFetch<KriInsights>('/KriInsights'),
          apiFetch<TopOffender[]>('/kri/top-offenders'),
          apiFetch<AnalyticsRes>('/KriAnalytics'),
        ]);

        setInsights(ins);
        setTopOffenders(top);
        setAnalytics(aly);

        if (top.length > 0) {
          setSelectedKri(top[0].kri);
          setSelectedKris(top.slice(0, Math.min(3, top.length)).map((item) => item.kri));
        }
      } catch (e) {
        console.error('Fetch Error:', e);
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const filteredOffenders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return topOffenders;
    return topOffenders.filter((item) => item.kri.toLowerCase().includes(term));
  }, [topOffenders, searchTerm]);

  const stackedChartData = useMemo(() => {
    if (!analytics || selectedKris.length === 0) return [];

    return analytics.table
      .map((row) => {
        const entry: Record<string, string | number> = {
          date: row.snapshot_date,
        };

        selectedKris.forEach((kri) => {
          entry[kri] = Number(row[kri]) || 0;
        });

        return entry;
      })
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [analytics, selectedKris]);

  const selectAllKris = () => {
    if (!analytics) return;
    setSelectedKris(analytics.kris);
  };

  const clearAllKris = () => {
    setSelectedKris([]);
  };

  const toggleChartKri = (kri: string) => {
    setSelectedKris((prev) =>
      prev.includes(kri) ? prev.filter((item) => item !== kri) : [...prev, kri]
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-slate-300">
            Loading KRI Analytics...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="max-w-lg rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-center text-rose-200">
            <AlertCircle className="mx-auto mb-3 h-6 w-6" />
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Title */}
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            KRI Analytics
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Analyse des KRI les plus fréquents pour visualiser leur distribution dans le temps.
          </p>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <MetricCard label="Total Breaches" value={insights?.total ?? 0} />
          <MetricCard label="Business Breaches" value={insights?.number_business ?? 0} />
          <MetricCard label="Individual Breaches" value={insights?.number_individual ?? 0} />
        </section>

        {/* Most Frequent KRIs */}
        <section className="rounded-[28px] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Most Frequently KRIs</h2>
              <p className="mt-1 text-sm text-slate-400">
                Clique sur un KRI pour l’ajouter ou le retirer du graphique.
              </p>
            </div>

            <div className="relative w-full md:w-[26rem]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search KRI..."
                className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500/50"
              />
            </div>
          </div>

          {filteredOffenders.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredOffenders.slice(0, 8).map((item, index) => {
                const isSelected = selectedKris.includes(item.kri);

                return (
                  <button
                    key={item.kri}
                    type="button"
                    onClick={() => toggleChartKri(item.kri)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? 'border-cyan-500/40 bg-cyan-500/10'
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Rank #{index + 1}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.kri}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.count} incidents</p>
                    <p className="mt-3 text-xs font-medium text-cyan-300">
                      {isSelected ? 'Remove from chart' : 'Add to chart'}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 text-sm text-slate-400">
              No matching KRI found.
            </div>
          )}
        </section>

        {/* Trend Plotting */}
        <section className="rounded-[28px] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Trend Plotting</h2>
              <p className="mt-1 text-sm text-slate-400">
                Select one or more KRI to display a stacked chart by snapshot date.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={selectAllKris}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={clearAllKris}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mb-6">
            <KriMultiSelect
              options={analytics?.kris ?? []}
              selected={selectedKris}
              onChange={setSelectedKris}
            />
          </div>

          <div className="h-[520px] rounded-[28px] border border-white/5 bg-[#07111f] p-6">
            {selectedKris.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedChartData} barCategoryGap="18%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      paddingTop: '16px',
                      color: '#cbd5e1',
                    }}
                  />
                  {selectedKris.map((kri, index) => (
                    <Bar
                      key={kri}
                      dataKey={kri}
                      stackId="a"
                      fill={COLORS[index % COLORS.length]}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                Select at least one KRI.
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

// =====================
// Metric Card
// =====================
function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-[28px] border border-white/5 bg-slate-900/40 p-7 backdrop-blur-xl">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-4xl font-bold tracking-tight text-white">
        {value}
      </p>
    </div>
  );
}

// =====================
// Dropdown Multi Select
// =====================
function KriMultiSelect({ options, selected, onChange }: KriMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const label =
    selected.length === 0
      ? 'Select KRIs'
      : selected.length === 1
      ? selected[0]
      : `${selected.length} KRIs selected`;

  const toggleOption = (kri: string) => {
    if (selected.includes(kri)) {
      onChange(selected.filter((item) => item !== kri));
    } else {
      onChange([...selected, kri]);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white transition hover:border-cyan-500/40"
      >
        <span className={selected.length === 0 ? 'text-slate-500' : 'text-white'}>
          {label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
          <div className="absolute z-30 mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Available KRIs
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto pr-1">
            {options.length > 0 ? (
              options.map((kri) => {
                const active = selected.includes(kri);

                return (
                  <button
                    key={kri}
                    type="button"
                    onClick={() => toggleOption(kri)}
                    className={`mb-2 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                      active
                        ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                        : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{kri}</span>
                    {active && <Check className="h-4 w-4 text-cyan-400" />}
                  </button>
                );
              })
            ) : (
              <p className="px-2 py-4 text-sm text-slate-400">No KRI available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================
// Custom Tooltip
// =====================
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey?: string; name?: string; value?: number | string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 shadow-2xl">
      <p className="mb-2 text-sm font-semibold text-white">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={String(item.dataKey)} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-400">{String(item.name ?? item.dataKey)}</span>
            <span className="font-semibold text-white">{item.value as number}</span>
          </div>
        ))}
      </div>
    </div>
  );
}