import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fmt = (v) => {
  const n = Number(v);
  if (!isFinite(n) || n === 0) return null;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '+';
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
};

const getFlow = (item) => {
  if (!item || typeof item !== 'object') return null;
  // SoSoValue /etfs/summary-history fields (snake_case), latest record first
  const keys = ['total_net_inflow', 'cum_net_inflow', 'totalNetInflow', 'netInflow', 'value'];
  for (const k of keys) {
    const n = parseFloat(item[k]);
    if (item[k] != null && !isNaN(n)) return n;
  }
  return null;
};

export default function ETFPanel() {
  const [data, setData] = useState({});

  useEffect(() => {
    let active = true;
    const load = async () => {
      const out = {};
      for (const t of ['btc', 'eth']) {
        try {
          const res = await fetch(`${API_BASE}/api/etf/${t}`);
          const json = await res.json();
          const arr = Array.isArray(json) ? json : [];
          out[t.toUpperCase()] = arr.length ? getFlow(arr[0]) : null;
        } catch {
          out[t.toUpperCase()] = null;
        }
      }
      if (active) setData(out);
    };
    load();
    const id = setInterval(load, 300000);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-accent text-sm">🏦</span>
        <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
          ETF Net Flows
        </h2>
      </div>
      <div className="space-y-2">
        {[['BTC', '₿'], ['ETH', 'Ξ']].map(([sym, icon]) => {
          const flow = data[sym];
          const txt = fmt(flow);
          const positive = (flow ?? 0) >= 0;
          return (
            <div key={sym} className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-terminal-muted">{icon} {sym} Net Flow</span>
              <span className={`font-mono text-sm font-semibold tabular-nums ${txt == null ? 'text-white/40' : positive ? 'text-accent' : 'text-bearish'}`}>
                {txt ?? '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
