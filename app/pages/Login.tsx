import { type FormEvent, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck2,
  Layers3,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const appHighlights: Array<{
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    title: 'KRI calculation',
    description: 'One front door for entering operational data and running the calculator.',
    icon: Layers3,
  },
  {
    title: 'Technical validation',
    description: 'Built-in checks keep records, dates, and values aligned before review.',
    icon: FileCheck2,
  },
  {
    title: 'Analytics ready',
    description: 'Results are structured for dashboards, trend analysis, and follow-up actions.',
    icon: BarChart3,
  },
];

const ringLayers = [
  {
    width: 132,
    height: 182,
    offsetX: -76,
    offsetY: -90,
    rotation: -12,
    accentStart: '#eff5ff',
    accentEnd: '#a6c6ff',
  },
  {
    width: 132,
    height: 186,
    offsetX: -20,
    offsetY: -72,
    rotation: -7,
    accentStart: '#f7fbff',
    accentEnd: '#7eb1ff',
  },
  {
    width: 138,
    height: 188,
    offsetX: 28,
    offsetY: -40,
    rotation: 6,
    accentStart: '#edf3ff',
    accentEnd: '#4f8ff4',
  },
  {
    width: 146,
    height: 176,
    offsetX: 56,
    offsetY: -6,
    rotation: 10,
    accentStart: '#e0eaff',
    accentEnd: '#2f78ea',
  },
  {
    width: 156,
    height: 172,
    offsetX: 44,
    offsetY: 36,
    rotation: 8,
    accentStart: '#d9e7ff',
    accentEnd: '#145ec7',
  },
  {
    width: 170,
    height: 168,
    offsetX: 20,
    offsetY: 76,
    rotation: 4,
    accentStart: '#cfdfff',
    accentEnd: '#0f4ea8',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Enter an email and password to continue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    navigate('/kri-calculation', { replace: true });
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,232,200,0.95),transparent_28%),radial-gradient(circle_at_top_right,rgba(214,232,255,0.92),transparent_24%),linear-gradient(180deg,#fffdf8_0%,#fff9f2_46%,#fff1df_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8 lg:py-6">
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] flex-col overflow-hidden rounded-[34px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,248,236,0.76))] shadow-[0_30px_100px_rgba(96,74,36,0.14)] backdrop-blur-3xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(255,212,130,0.18),transparent_22%),radial-gradient(circle_at_78%_84%,rgba(64,125,255,0.08),transparent_20%)]" />
        <div className="pointer-events-none absolute -left-10 top-1/2 h-60 w-60 -translate-y-1/2 rounded-full border-[10px] border-amber-300/40 blur-[0.5px]" />
        <div className="pointer-events-none absolute -right-20 top-[-4rem] h-56 w-56 rounded-full border-[10px] border-amber-300/45" />

        <header className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1b63f0] text-white shadow-[0_12px_26px_rgba(27,99,240,0.28)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-semibold tracking-[-0.05em] text-[#1c57ea]">KRI Factory</div>
              <div className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">Data Quality Workspace</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-500 shadow-sm lg:flex">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Login experience tuned for data quality teams
          </div>
        </header>

        <main className="relative z-10 grid flex-1 gap-10 px-6 pb-8 pt-4 lg:grid-cols-[1.06fr_0.94fr] lg:gap-8 lg:px-10 lg:pb-10 xl:px-12">
          <section className="flex flex-col justify-center gap-8 py-6 lg:py-10">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#1b63f0]" />
                Data quality metrics to track
              </div>

              <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.07em] text-slate-900 sm:text-6xl xl:text-7xl">
                Built for precise KRI work,
                <span className="block text-[#1b63f0]">designed to feel effortless.</span>
              </h1>

              <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Sign in to reach the KRI calculator, technical data quality checks, and analytics views from a single workspace.
                The interface is shaped to make the workflow feel clear, premium, and calm from the first click.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {appHighlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <div
                    key={highlight.title}
                    className="group rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-[0_18px_40px_rgba(79,61,29,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(79,61,29,0.12)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1b63f0]/10 text-[#1b63f0] ring-1 ring-[#1b63f0]/10 transition-transform group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-sm font-semibold text-slate-900">{highlight.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{highlight.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="relative flex flex-col justify-center gap-6 lg:min-h-[760px] lg:block">
            <div className="relative h-[580px] overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.74),rgba(246,238,225,0.56))] p-5 shadow-[0_28px_70px_rgba(84,63,31,0.12)] lg:h-full lg:p-8">
              <div className="absolute inset-x-8 bottom-7 h-10 rounded-full bg-slate-950/10 blur-2xl" />
              <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),rgba(255,255,255,0.18)_58%,transparent_72%)] blur-[2px]" />
              <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(27,99,240,0.12),transparent_70%)]" />
              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1b63f0] shadow-[0_0_0_12px_rgba(27,99,240,0.12)]" />

              {ringLayers.map((ring) => (
                <div
                  key={`${ring.width}-${ring.height}-${ring.offsetX}`}
                  className="absolute left-1/2 top-1/2 rounded-[44%] bg-[linear-gradient(180deg,#ffffff,#d7d7d7)] p-[10px] shadow-[0_20px_35px_rgba(15,23,42,0.16)]"
                  style={{
                    width: ring.width,
                    height: ring.height,
                    transform: `translate(-50%, -50%) translate(${ring.offsetX}px, ${ring.offsetY}px) rotate(${ring.rotation}deg)`,
                  }}
                >
                  <div
                    className="relative h-full w-full overflow-hidden rounded-[44%]"
                    style={{ background: `linear-gradient(135deg, ${ring.accentStart} 0%, ${ring.accentEnd} 100%)` }}
                  >
                    <div className="absolute inset-[10%] rounded-[44%] bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.34),transparent_52%)]" />
                  </div>
                </div>
              ))}

              <div className="absolute left-[8%] top-[8%] hidden flex-col items-center text-center text-slate-800 md:flex">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-[#e7efff] text-2xl font-semibold text-[#1b63f0] shadow-[0_14px_30px_rgba(27,99,240,0.12)]">
                  1
                </div>
                <div className="mt-2 text-xl font-medium">Accuracy</div>
                <div className="mt-3 h-24 border-l-2 border-dashed border-slate-300/90" />
              </div>

              <div className="absolute left-[39%] top-[14%] hidden flex-col items-center text-center text-slate-800 md:flex">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-[#e7efff] text-2xl font-semibold text-[#1b63f0] shadow-[0_14px_30px_rgba(27,99,240,0.12)]">
                  2
                </div>
                <div className="mt-2 text-xl font-medium">Completeness</div>
                <div className="mt-3 h-20 border-l-2 border-dashed border-slate-300/90" />
              </div>

              <div className="absolute right-[14%] top-[22%] hidden flex-col items-center text-center text-slate-800 md:flex">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-[#e7efff] text-2xl font-semibold text-[#1b63f0] shadow-[0_14px_30px_rgba(27,99,240,0.12)]">
                  3
                </div>
                <div className="mt-2 text-xl font-medium">Consistency</div>
                <div className="mt-3 h-20 border-l-2 border-dashed border-slate-300/90" />
              </div>

              <div className="absolute right-[7%] top-[46%] hidden items-center gap-4 text-slate-800 md:flex">
                <div className="h-px w-20 border-t-2 border-dashed border-slate-300/90" />
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-[#e7efff] text-2xl font-semibold text-[#1b63f0] shadow-[0_14px_30px_rgba(27,99,240,0.12)]">
                    4
                  </div>
                  <div className="mt-2 text-xl font-medium">Timeliness</div>
                </div>
              </div>

              <div className="absolute right-[11%] bottom-[21%] hidden items-center gap-4 text-slate-800 md:flex">
                <div className="h-px w-20 border-t-2 border-dashed border-slate-300/90" />
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-[#e7efff] text-2xl font-semibold text-[#1b63f0] shadow-[0_14px_30px_rgba(27,99,240,0.12)]">
                    5
                  </div>
                  <div className="mt-2 text-xl font-medium">Validity</div>
                </div>
              </div>

              <div className="absolute right-[12%] bottom-[2%] hidden items-center gap-4 text-slate-800 md:flex">
                <div className="h-px w-20 border-t-2 border-dashed border-slate-300/90" />
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-[#e7efff] text-2xl font-semibold text-[#1b63f0] shadow-[0_14px_30px_rgba(27,99,240,0.12)]">
                    6
                  </div>
                  <div className="mt-2 text-xl font-medium">Integrity</div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative z-20 mt-4 rounded-[32px] border border-white/90 bg-white/90 p-6 shadow-[0_28px_70px_rgba(72,51,24,0.16)] backdrop-blur-2xl md:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:w-[420px] lg:-translate-y-1/2 lg:p-7"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-[#1b63f0]/10 bg-[#1b63f0]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b63f0]">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Workspace access
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.05em] text-slate-900">Sign in to the data workspace</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Use your credentials to reach the KRI calculator, the technical quality views, and the analytics dashboard.
                </p>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Email</span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="analyst@company.com"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/90 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#1b63f0] focus:bg-white focus:ring-4 focus:ring-[#1b63f0]/10"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Password</span>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/90 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#1b63f0] focus:bg-white focus:ring-4 focus:ring-[#1b63f0]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((currentValue) => !currentValue)}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>

                  <div className="flex items-center justify-between gap-4">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-[#1b63f0] focus:ring-[#1b63f0]"
                        defaultChecked
                      />
                      Keep me signed in
                    </label>
                    <span className="text-sm font-medium text-slate-500">Need help from your admin?</span>
                  </div>

                  {errorMessage ? (
                    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1b63f0] px-5 py-4 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(27,99,240,0.3)] transition hover:-translate-y-0.5 hover:bg-[#1756d4] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in to dashboard'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/kri-calculation', { replace: true })}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Open demo workspace
                    <CheckCircle2 className="h-4 w-4 text-[#1b63f0]" />
                  </button>

                  <div className="rounded-[24px] bg-[linear-gradient(135deg,rgba(27,99,240,0.08),rgba(27,99,240,0.02))] p-4 text-sm leading-7 text-slate-600">
                    Designed for fast KRI entry, transparent processing, and practical data review.
                  </div>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
