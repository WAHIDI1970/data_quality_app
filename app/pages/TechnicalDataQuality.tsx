import { useEffect, useMemo, useState } from 'react';
import { Database, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { apiFetch } from '../lib/api';

// --- Types ---
type LoadingRecord = Record<string, string | number | boolean | null>;

type ValidationFailure = {
  column: string | null;
  check: string | null;
  failure_case: string | number | boolean | null;
  index: number | null;
};

type ValidationResult = {
  status: 'success' | 'failed';
  total_rows: number;
  report: ValidationFailure[];
};

// --- Helpers ---
function formatCellValue(value: any) {
  if (value === null || value === undefined) return '—';
  return String(value).trim() || '—';
}

function normalizeIndex(value: any): number | null {
  const idx = Number(value);
  return Number.isFinite(idx) ? idx : null;
}

export default function TechnicalDataQuality() {
  const [rawData, setRawData] = useState<LoadingRecord[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // États pour la navigation (Drill-down)
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [selectedCheck, setSelectedCheck] = useState<string>('ALL');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [openColumns, setOpenColumns] = useState<Record<string, boolean>>({});
  const [openChecks, setOpenChecks] = useState<Record<string, boolean>>({});

  // 1. Chargement des données
  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        // On récupère les données brutes (Array) et la validation (Object)
        const [dataRes, validRes] = await Promise.all([
          apiFetch<LoadingRecord[]>('/loading'),
          apiFetch<ValidationResult>('/validation')
        ]);

        if (!active) return;

        setRawData(Array.isArray(dataRes) ? dataRes : []);
        setValidation(validRes);
        
        // Ouvrir la première colonne par défaut s'il y a des erreurs
        if (validRes.report.length > 0) {
          const firstCol = validRes.report[0].column || '';
          setSelectedColumn(firstCol);
          setOpenColumns({ [firstCol]: true });
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Erreur de connexion');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, []);

  // 2. Logique de regroupement des erreurs (Mémoïsée)
  const groupedReport = useMemo(() => {
    const report = validation?.report || [];
    return report.reduce((acc: any, entry) => {
      const col = entry.column || 'Unknown';
      const chk = entry.check || 'Unknown';
      if (!acc[col]) acc[col] = { column: col, entries: [], checks: {} };
      if (!acc[col].checks[chk]) acc[col].checks[chk] = { check: chk, entries: [] };
      acc[col].entries.push(entry);
      acc[col].checks[chk].entries.push(entry);
      return acc;
    }, {});
  }, [validation]);

  const reportColumns = useMemo(() => Object.values(groupedReport) as any[], [groupedReport]);

  // 3. Sélection de la ligne liée (Linked Row)
  const selectedRow = useMemo(() => {
    if (selectedIndex === null || !rawData[selectedIndex]) return null;
    return rawData[selectedIndex];
  }, [selectedIndex, rawData]);

  // --- Handlers ---
  const toggleColumn = (col: string) => {
    setOpenColumns(prev => ({ ...prev, [col]: !prev[col] }));
    setSelectedColumn(col);
  };

  const toggleCheck = (col: string, chk: string) => {
    setOpenChecks(prev => ({ ...prev, [`${col}::${chk}`]: !prev[chk] }));
    setSelectedCheck(chk);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-white">Technical Validation</h1>
            <p className="text-slate-400 text-sm">Analyse détaillée des erreurs par ligne.</p>
          </div>
          <div className="bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-xs font-mono">
            {rawData.length} ROWS LOADED
          </div>
        </div>

        {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-6">
          
          {/* ASIDE: Arborescence des erreurs */}
          <aside className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Issue Tree
            </div>
            <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {reportColumns.map((colGroup) => (
                <div key={colGroup.column} className="space-y-1">
                  <button 
                    onClick={() => toggleColumn(colGroup.column)}
                    className={`w-full flex justify-between p-2 rounded-lg text-sm ${selectedColumn === colGroup.column ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                  >
                    <span>{colGroup.column}</span>
                    <span className="bg-slate-700 px-2 rounded text-xs">{colGroup.entries.length}</span>
                  </button>

                  {openColumns[colGroup.column] && (
                    <div className="pl-4 space-y-1">
                      {Object.values(colGroup.checks).map((chkGroup: any) => (
                        <div key={chkGroup.check}>
                          <button 
                            onClick={() => toggleCheck(colGroup.column, chkGroup.check)}
                            className="w-full text-left p-1 text-xs text-slate-500 hover:text-slate-300"
                          >
                            {chkGroup.check} ({chkGroup.entries.length})
                          </button>
                          {openChecks[`${colGroup.column}::${chkGroup.check}`] && (
                            <div className="grid grid-cols-1 gap-1 mt-1">
                              {chkGroup.entries.map((entry: any, i: number) => (
                                <button
                                  key={i}
                                  onClick={() => setSelectedIndex(normalizeIndex(entry.index))}
                                  className={`text-[10px] p-2 rounded border ${selectedIndex === entry.index ? 'border-cyan-500 bg-cyan-500/10 text-white' : 'border-slate-800 text-slate-500'}`}
                                >
                                  Row #{entry.index} → {String(entry.failure_case)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* MAIN: Détails de la ligne */}
          <main className="space-y-6">
            <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-cyan-400" /> Linked Row Detail
                </h2>
                {selectedIndex !== null && <span className="text-cyan-400 font-mono text-sm">INDEX: {selectedIndex}</span>}
              </div>

              {selectedRow ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(selectedRow).map(([key, val]) => (
                    <div key={key} className={`p-3 rounded-xl border ${key === selectedColumn ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800 bg-slate-950/50'}`}>
                      <p className="text-[10px] uppercase text-slate-500 font-bold">{key}</p>
                      <p className="text-sm text-slate-200 mt-1 truncate">{formatCellValue(val)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                  <Database className="w-8 h-8 mb-2 opacity-20" />
                  <p>Sélectionnez une erreur dans l'arbre pour voir la ligne source.</p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}