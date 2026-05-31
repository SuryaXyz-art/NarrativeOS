import { useState } from 'react';
import { prettySymbol } from '../utils/format';

const fmt = (n) => {
  const v = Number(n);
  if (!isFinite(v)) return '—';
  if (v >= 1000) return v.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (v >= 1) return v.toFixed(2);
  return v.toPrecision(4);
};

// Derives a risk-managed trade plan from a signal + recent closes. No execution.
export default function TradePlanModal({ signal, closes = [], onClose }) {
  const [account, setAccount] = useState(1000);
  const [riskPct, setRiskPct] = useState(1);
  const [ack, setAck] = useState(false);
  const [staged, setStaged] = useState(false);

  const entry = closes.length ? closes[closes.length - 1] : null;
  const isLong = signal?.signal === 'BUY';
  const stop = entry ? entry * (isLong ? 0.95 : 1.05) : null;       // 5% protective stop
  const target = entry ? entry * (isLong ? 1.10 : 0.90) : null;     // 2:1 reward/risk
  const perUnitRisk = entry && stop ? Math.abs(entry - stop) : 0;
  const riskAmount = (Number(account) * Number(riskPct)) / 100;
  const size = perUnitRisk ? riskAmount / perUnitRisk : 0;
  const positionValue = size * (entry || 0);

  const row = (label, value, cls = 'text-white') => (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[11px] text-terminal-muted">{label}</span>
      <span className={`font-mono text-xs font-semibold tabular-nums ${cls}`}>{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-terminal-bg/50">
          <h2 className="font-mono text-xs uppercase tracking-wider text-accent/80 font-semibold">
            Trade Plan · {prettySymbol(signal?.symbol)}
          </h2>
          <button onClick={onClose} className="text-terminal-muted hover:text-white text-sm">✕</button>
        </div>

        {staged ? (
          <div className="p-5 text-center space-y-2">
            <p className="text-accent font-mono text-sm">✓ Plan staged locally</p>
            <p className="text-white/60 text-xs leading-relaxed">
              No order was placed. Connect a SoDEX account to execute. This is not financial advice.
            </p>
            <button onClick={onClose} className="mt-2 px-4 py-2 rounded border border-terminal-border font-mono text-xs text-white/80 hover:border-accent/40 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-mono text-sm font-bold ${isLong ? 'text-accent' : 'text-bearish'}`}>
                {isLong ? 'LONG' : 'SHORT'}
              </span>
              <span className="font-mono text-[10px] text-terminal-muted">R:R 2.0 · {signal?.confidence ?? 0}% conf</span>
            </div>

            <div className="space-y-1.5 bg-terminal-bg/50 border border-terminal-border/50 rounded p-3">
              {row('Entry', fmt(entry))}
              {row('Stop Loss', fmt(stop), 'text-bearish')}
              {row('Take Profit', fmt(target), 'text-accent')}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="font-mono text-[10px] text-terminal-muted">Account ($)</span>
                <input type="number" value={account} onChange={(e) => setAccount(e.target.value)}
                  className="w-full mt-1 bg-terminal-bg border border-terminal-border rounded px-2 py-1 text-xs font-mono text-white/90 focus:outline-none focus:border-accent/40" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] text-terminal-muted">Risk (%)</span>
                <input type="number" value={riskPct} onChange={(e) => setRiskPct(e.target.value)}
                  className="w-full mt-1 bg-terminal-bg border border-terminal-border rounded px-2 py-1 text-xs font-mono text-white/90 focus:outline-none focus:border-accent/40" />
              </label>
            </div>

            <div className="space-y-1.5 bg-terminal-bg/50 border border-terminal-border/50 rounded p-3">
              {row('Risk Amount', `$${fmt(riskAmount)}`, 'text-warning')}
              {row('Position Size', `${fmt(size)} units`)}
              {row('Position Value', `$${fmt(positionValue)}`)}
            </div>

            {signal?.signal === 'HIGH_RISK' && (
              <p className="font-mono text-[11px] text-bearish">⚠ HIGH RISK signal — size down or skip.</p>
            )}

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 accent-[#00ff88]" />
              <span className="text-[11px] text-white/60 leading-snug">
                I understand this is an AI-generated plan, not financial advice, and I accept the risk.
              </span>
            </label>

            <button disabled={!ack || !entry} onClick={() => setStaged(true)}
              className="w-full py-2 rounded bg-accent text-terminal-bg font-mono text-sm font-bold hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {entry ? 'Confirm Plan' : 'No price data'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
