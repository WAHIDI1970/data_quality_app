import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, Sparkles, Table2 } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiFetch } from '../lib/api';

type KriResultRow = Record<string, string | number | boolean | null>;

type KriCalculationResponse = {
  status: string;
  inserted_rows: number;
  kri_id: number;
  kri_group: string;
  data: KriResultRow[];
};

type CalculationPoint = {
  snapshot_date: string;
  ggi: number;
  kri_name: string;
  kri_group: string;
};

function formatToday() {
  return new Date().toISOString().slice(0, 10);
}

function formatCellValue(value: unknown) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string' && value.trim().length === 0) return '—';
  return String(value);
}

export default function KRICalculator() {
  const [kriName, setKriName] = useState('');
  const [ggi, setGgi] = useState('100002');
  const [snapshotDate, setSnapshotDate] = useState(formatToday());
  const [resultRows, setResultRows] = useState<KriResultRow[]>([]);
  const [calculatedKriId, setCalculatedKriId] = useState<number | null>(null);
  const [calculatedGroup, setCalculatedGroup] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resultColumns = useMemo(() => {
    const preferred = ['kri', 'ggi', 'common_name', 'employee_region', 'trading_or_sales_desk', 'snapshot_date', 'kri_id', 'kri_group'];
    const dynamic = Array.from(new Set(resultRows.flatMap((row) => Object.keys(row))));
    return [...preferred.filter((column) => dynamic.includes(column)), ...dynamic.filter((column) => !preferred.includes(column))];
  }, [resultRows]);

  async function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');
    setSuccessMessage('');

    const parsedGgi = Number(ggi);
    if (!Number.isFinite(parsedGgi) || parsedGgi <= 0) {
      setError('Enter a valid GGI value.');
      return;
    }

    if (!kriName.trim()) {
      setError('Enter a KRI name.');
      return;
    }

    if (!snapshotDate) {
      setError('Select a snapshot date.');
      return;
    }

    try {
      setCalculating(true);
      const response = await apiFetch<KriCalculationResponse>('/kri/calculate', {
        method: 'POST',
        body: JSON.stringify({
          ggi: parsedGgi,
          kri_name: kriName.trim(),
          snapshot_date: snapshotDate,
        }),
      });

      const rows = response.data ?? [];
      setResultRows(rows);
      setCalculatedKriId(response.kri_id ?? null);
      setCalculatedGroup(response.kri_group ?? '');
      setSuccessMessage(`Calculation completed. ${response.inserted_rows} row(s) returned.`);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to run KRI calculation.');
      setResultRows([]);
      setCalculatedKriId(null);
      setCalculatedGroup('');
    } finally {
      setCalculating(false);
    }
  }

  function resetForm() {
    setError('');
    setSuccessMessage('');
    setKriName('');
    setGgi('100002');
    setSnapshotDate(formatToday());
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        <section className="relative overflow-hidden rounded-[30px] border border-white/5 bg-card p-6 shadow-sm lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.20),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.10),transparent_24%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                KRI calculation
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">KRI calculator</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 lg:text-base">
                  Enter a KRI name, GGI, and snapshot date, then run the calculation and review the returned rows and chart.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[26rem]">
              <MetricCard label="Latest KRI ID" value={calculatedKriId === null ? '—' : String(calculatedKriId)} />
              <MetricCard label="KRI group" value={calculatedGroup || '—'} />
              <MetricCard label="Rows returned" value={String(resultRows.length)} />
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            <AlertCircle className="mr-2 inline h-4 w-4" />
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <CheckCircle2 className="mr-2 inline h-4 w-4" />
            {successMessage}
          </div>
        ) : null}

        <section className="rounded-[28px] border border-white/5 bg-slate-900/40 p-6 shadow-sm backdrop-blur-xl lg:p-8">
          <div className="flex flex-col gap-4 border-b border-white/5 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Calculation form</h2>
              <p className="mt-1 text-sm text-slate-400">Only the three required inputs are shown here.</p>
            </div>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-3" onSubmit={handleCalculate}>
            <Field label="KRI name">
              <input
                value={kriName}
                onChange={(event) => setKriName(event.target.value)}
                type="text"
                placeholder="Enter KRI name"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/50"
              />
            </Field>

            <Field label="GGI">
              <input
                value={ggi}
                onChange={(event) => setGgi(event.target.value)}
                type="number"
                min="0"
                step="1"
                placeholder="100002"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/50"
              />
            </Field>

            <Field label="Snapshot date">
              <input
                value={snapshotDate}
                onChange={(event) => setSnapshotDate(event.target.value)}
                type="date"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/50"
              />
            </Field>

            <div className="flex items-end gap-3 md:col-span-3">
              <button
                type="submit"
                disabled={calculating}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(244,63,94,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {calculating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Run calculation
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[28px] border border-white/5 bg-slate-900/40 p-6 shadow-sm backdrop-blur-xl lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Calculated KRI rows</h2>
                <p className="mt-1 text-sm text-slate-400">Backend output from the most recent calculation.</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-white/5 bg-black/20">
              {resultRows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/5 text-left text-sm">
                    <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <tr>
                        {resultColumns.map((column) => (
                          <th key={column} className="px-4 py-3 font-medium">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {resultRows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="transition hover:bg-white/5">
                          {resultColumns.map((column) => (
                            <td key={column} className="whitespace-nowrap px-4 py-3 text-slate-300">
                              {formatCellValue(row[column])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-10 text-center text-slate-400">
                  <Table2 className="mb-3 h-9 w-9 text-slate-600" />
                  <p className="text-sm font-medium text-slate-300">No calculated rows yet.</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Run the calculation to preview the returned KRI rows.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/5 bg-slate-900/40 p-6 shadow-sm backdrop-blur-xl lg:p-8">
            <div>
              <h2 className="text-xl font-semibold text-white">Data plotting</h2>
              <p className="mt-1 text-sm text-slate-400">Reserved space for future plotting of the calculated data.</p>
            </div>

            <div className="mt-5 flex h-[360px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-slate-500">
              Data plot area
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}
