import { useMemo } from 'react';

type DataPoint = { date: string; value: number };

export function TrendChart({ data, selectedKri }: { data: DataPoint[], selectedKri: string }) {
  const width = 1000;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 60, left: 80 };

  const { pathData, areaData, yTicks, xTicks } = useMemo(() => {
    if (!data || data.length < 2) return { pathData: '', areaData: '', yTicks: [], xTicks: [] };

    const values = data.map(d => d.value);
    const maxValue = Math.max(...values) * 1.1 || 10;
    const chartHeight = height - padding.top - padding.bottom;
    const chartWidth = width - padding.left - padding.right;
    const stepX = chartWidth / (data.length - 1);

    const points = data.map((d, i) => ({
      x: padding.left + i * stepX,
      y: padding.top + chartHeight - (d.value / maxValue) * chartHeight,
      date: d.date,
      value: d.value
    }));

    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
    const area = `${path} L ${points[points.length - 1].x} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

    const yTicks = Array.from({ length: 5 }).map((_, i) => {
      const val = (maxValue / 4) * i;
      return { y: padding.top + chartHeight - (val / maxValue) * chartHeight, label: val.toFixed(0) };
    }).reverse();

    const xFreq = Math.ceil(data.length / 8);
    const xTicks = points.filter((_, i) => i % xFreq === 0);

    return { pathData: path, areaData: area, yTicks, xTicks };
  }, [data]);

  if (!data || data.length < 2) return <div className="h-[400px] flex items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-3xl">Sélectionnez un KRI avec au moins 2 dates de snapshot.</div>;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-[#081021] rounded-3xl border border-white/5">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {yTicks.map((t, i) => (
        <g key={i}><line x1={padding.left} x2={width - padding.right} y1={t.y} y2={t.y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
        <text x={padding.left - 15} y={t.y + 4} textAnchor="end" className="fill-slate-500 text-[12px] font-mono">{t.label}</text></g>
      ))}
      <path d={areaData} fill="url(#lineGrad)" />
      <path d={pathData} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinejoin="round" className="drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]" />
      {xTicks.map((t, i) => (
        <text key={i} x={t.x} y={height - 20} textAnchor="middle" className="fill-slate-400 text-[10px] font-mono" transform={`rotate(-25 ${t.x} ${height - 20})`}>{t.date}</text>
      ))}
    </svg>
  );
}