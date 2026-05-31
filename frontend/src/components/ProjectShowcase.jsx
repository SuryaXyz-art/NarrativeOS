// Professional scrollable project showcase / landing for NarrativeOS.
// Documents the full project: value prop, flow, features, data sources,
// genuine SoSoValue integration, hackathon alignment, tech stack, resources.

const FLOW = [
  { n: '01', t: 'Ingest', d: 'Live tickers & klines from SoDEX, plus hot news, macro events and ETF flows from SoSoValue.' },
  { n: '02', t: 'Analyze', d: 'Nous Hermes-4-70B reads the combined market + macro context and detects the dominant narratives.' },
  { n: '03', t: 'Signal', d: 'Per-asset BUY / WATCH / EXIT / HIGH_RISK calls with a confidence score and a one-line rationale.' },
  { n: '04', t: 'Act', d: 'Risk-managed trade plans (entry, stop, target, position size) behind a confirmation gate, plus copy-ready tweet threads and explanations.' },
];

const FEATURES = [
  { i: '🧠', t: 'Narrative Detection', d: 'AI surfaces the stories driving the market, not just prices.' },
  { i: '◆', t: 'Trading Signals', d: 'Confidence-scored signals with transparent reasoning.' },
  { i: '🎯', t: 'Trade Plans', d: 'Risk-sized entry/stop/target with a confirmation gate — non-custodial.' },
  { i: '💓', t: 'Market Pulse', d: 'Real-time breadth gauge: advancers vs decliners, sentiment.' },
  { i: '📰', t: 'Market Intel', d: 'SoSoValue hot news & macro events in one feed.' },
  { i: '🏦', t: 'ETF Net Flows', d: 'Daily BTC & ETH spot-ETF inflows from SoSoValue.' },
  { i: '✦', t: 'Tweet Threads', d: 'Auto-generated, copy-ready market commentary.' },
  { i: '💡', t: 'Explain Mode', d: '"Explain like I\'m dumb" for any crypto concept.' },
  { i: '⚡', t: 'Top Movers', d: 'Click any mover to pull an instant AI signal.' },
];

const SOURCES = [
  { t: 'SoSoValue API', d: 'Hot news, macroeconomic events, and spot-ETF flow data — the macro context layer.', tag: 'Macro & News' },
  { t: 'SoDEX API', d: 'Real-time spot/perp tickers, top movers, and candlestick klines.', tag: 'Market Data' },
  { t: 'Nous Hermes-4-70B', d: 'The reasoning engine that turns raw data into narratives and signals.', tag: 'AI Engine' },
];

const SOSO_ENDPOINTS = [
  { m: 'GET', p: '/news/hot', d: 'Hot crypto news feed' },
  { m: 'GET', p: '/macro/events', d: 'Macroeconomic event calendar' },
  { m: 'GET', p: '/etfs/summary-history', d: 'BTC / ETH spot-ETF net flows' },
];

const CRITERIA = [
  'Genuinely integrates the SoSoValue API (news, macro, ETF endpoints)',
  'Clear use case: a one-person financial news + signal desk',
  'Complete flow from data input to actionable output',
  'AI-enhanced opportunity discovery, signals & market explanation',
  'SoDEX integration for live market data (bonus)',
  'Risk awareness: confidence scores, HIGH_RISK flags, disclaimers',
];

const STACK = ['React 19', 'Vite', 'Tailwind CSS', 'FastAPI', 'Python', 'Nous Hermes-4-70B', 'SoSoValue', 'SoDEX'];

const RESOURCES = [
  { t: 'SoSoValue API Docs', u: 'https://sosovalue-1.gitbook.io/sosovalue-api-doc' },
  { t: 'SoDEX API Docs', u: 'https://sodex.com/documentation/api/api' },
  { t: 'Common Free-Tier APIs', u: 'https://www.notion.so/Common-APIs-167b57bd102a4c03b8f2421108fc66eb' },
  { t: 'GitHub Repository', u: 'https://github.com/SuryaXyz-art/NarrativeOS' },
];

function SectionTitle({ kicker, title }) {
  return (
    <div className="mb-8 text-center">
      <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-accent/70">{kicker}</p>
      <h2 className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h2>
    </div>
  );
}

export default function ProjectShowcase() {
  return (
    <div className="bg-terminal-bg text-white">
      {/* ── Hero ── */}
      <section className="relative px-6 pt-20 pb-16 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-accent/30 bg-accent/5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[11px] tracking-wider text-accent/80">SoSoValue Agentic Finance Hackathon</span>
          </div>
          <h1 className="font-mono text-4xl sm:text-6xl font-bold tracking-tight">
            NARRATIVE <span className="text-accent">OS</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            An agentic crypto intelligence desk. It reads the market and the macro, detects the
            narratives driving price, and turns them into signals, content, and explanations —
            the work of a whole research team, run by one agent.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <a href="#dashboard" className="px-5 py-2.5 rounded bg-accent text-terminal-bg font-mono text-sm font-bold hover:bg-accent/90 transition-colors">
              Launch Live Terminal ↓
            </a>
            <a href="https://github.com/SuryaXyz-art/NarrativeOS" target="_blank" rel="noopener noreferrer"
               className="px-5 py-2.5 rounded border border-terminal-border font-mono text-sm text-white/80 hover:border-accent/40 hover:text-accent transition-colors">
              View Source
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {['SoSoValue', 'SoDEX', 'Nous Hermes AI'].map((b) => (
              <span key={b} className="font-mono text-[11px] text-terminal-muted border border-terminal-border rounded px-2.5 py-1">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem / Solution ── */}
      <section className="px-6 py-16 border-t border-terminal-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
            <h3 className="font-mono text-sm uppercase tracking-wider text-bearish/80 font-semibold mb-3">The Problem</h3>
            <p className="text-white/70 leading-relaxed text-sm">
              Crypto moves on narratives — DeFi summer, L2 season, AI tokens, RWA, ETF flows.
              Catching them early means watching hundreds of tickers, reading endless news, and
              connecting macro dots in real time. No individual can do that manually.
            </p>
          </div>
          <div className="bg-terminal-surface border border-accent/20 rounded-lg p-6">
            <h3 className="font-mono text-sm uppercase tracking-wider text-accent/80 font-semibold mb-3">The Solution</h3>
            <p className="text-white/70 leading-relaxed text-sm">
              NarrativeOS automates the full loop. It fuses SoDEX market data with SoSoValue news,
              macro and ETF flows, runs it through an AI reasoning engine, and outputs the narratives,
              signals, and content a trader actually needs — continuously and on-chain-ready.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-16 border-t border-terminal-border">
        <SectionTitle kicker="Pipeline" title="From Data to Action" />
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FLOW.map((s) => (
            <div key={s.n} className="bg-terminal-surface border border-terminal-border rounded-lg p-5">
              <span className="font-mono text-2xl font-bold text-accent/30">{s.n}</span>
              <h3 className="mt-2 font-mono text-base font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-[13px] text-white/60 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-16 border-t border-terminal-border">
        <SectionTitle kicker="Capabilities" title="What It Does" />
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.t} className="bg-terminal-surface border border-terminal-border rounded-lg p-5 hover:border-accent/30 transition-colors">
              <span className="text-xl">{f.i}</span>
              <h3 className="mt-2 font-mono text-sm font-semibold text-white">{f.t}</h3>
              <p className="mt-1.5 text-[12px] text-white/55 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Data sources / architecture ── */}
      <section className="px-6 py-16 border-t border-terminal-border">
        <SectionTitle kicker="Architecture" title="Three Sources, One Agent" />
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {SOURCES.map((s) => (
            <div key={s.t} className="bg-terminal-surface border border-terminal-border rounded-lg p-5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent/60">{s.tag}</span>
              <h3 className="mt-1 font-mono text-base font-semibold text-white">{s.t}</h3>
              <p className="mt-2 text-[13px] text-white/60 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="max-w-3xl mx-auto mt-6 text-center font-mono text-xs text-terminal-muted leading-relaxed">
          NarrativeAgent (FastAPI) orchestrates all three into a single cached pipeline,
          with graceful fallbacks so the terminal never goes dark.
        </p>
      </section>

      {/* ── SoSoValue integration (genuine) ── */}
      <section className="px-6 py-16 border-t border-terminal-border">
        <SectionTitle kicker="Required Integration" title="Powered by SoSoValue" />
        <div className="max-w-3xl mx-auto bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50 font-mono text-[11px] text-accent/70">
            openapi.sosovalue.com/openapi/v1
          </div>
          <div className="divide-y divide-terminal-border/40">
            {SOSO_ENDPOINTS.map((e) => (
              <div key={e.p} className="flex items-center gap-3 px-4 py-3">
                <span className="font-mono text-[10px] font-bold text-accent border border-accent/30 rounded px-1.5 py-0.5">{e.m}</span>
                <span className="font-mono text-xs text-white/85">{e.p}</span>
                <span className="ml-auto text-[11px] text-white/45">{e.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hackathon alignment ── */}
      <section className="px-6 py-16 border-t border-terminal-border">
        <SectionTitle kicker="Submission" title="How It Meets the Brief" />
        <div className="max-w-3xl mx-auto space-y-2.5">
          {CRITERIA.map((c) => (
            <div key={c} className="flex items-start gap-3 bg-terminal-surface border border-terminal-border rounded-lg px-4 py-3">
              <span className="text-accent text-sm mt-0.5">✓</span>
              <span className="text-sm text-white/75">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="px-6 py-16 border-t border-terminal-border">
        <SectionTitle kicker="Built With" title="Tech Stack" />
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2.5">
          {STACK.map((t) => (
            <span key={t} className="font-mono text-xs text-white/75 bg-terminal-surface border border-terminal-border rounded-full px-4 py-1.5">{t}</span>
          ))}
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="px-6 py-16 border-t border-terminal-border">
        <SectionTitle kicker="Reference" title="Resources & Docs" />
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-3">
          {RESOURCES.map((r) => (
            <a key={r.u} href={r.u} target="_blank" rel="noopener noreferrer"
               className="flex items-center justify-between bg-terminal-surface border border-terminal-border rounded-lg px-4 py-3 hover:border-accent/40 transition-colors group">
              <span className="font-mono text-sm text-white/80 group-hover:text-accent transition-colors">{r.t}</span>
              <span className="text-terminal-muted group-hover:text-accent transition-colors">↗</span>
            </a>
          ))}
        </div>
        <p className="max-w-2xl mx-auto mt-8 text-center text-[11px] text-terminal-muted/70 leading-relaxed">
          NarrativeOS is an analytics tool, not financial advice. Signals are AI-generated and may be
          wrong — always do your own research and manage risk.
        </p>
      </section>

      {/* ── Divider into live app ── */}
      <div className="px-6 py-10 border-t border-terminal-border text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-accent/60">Live Terminal Below</p>
        <p className="mt-2 text-terminal-muted text-2xl">↓</p>
      </div>
    </div>
  );
}
