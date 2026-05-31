import { useState } from 'react';
import Sparkline from './Sparkline';
import TradePlanModal from './TradePlanModal';
import { prettySymbol } from '../utils/format';

const closesFromKlines = (klines) => {
  if (!Array.isArray(klines)) return [];
  return klines
    .map((k) => {
      if (Array.isArray(k)) return parseFloat(k[4]); // OHLCV close
      if (k && typeof k === 'object') return parseFloat(k.close ?? k.c ?? k.closePrice);
      return parseFloat(k);
    })
    .filter((n) => isFinite(n));
};

export default function SignalCard({ signal, klines }) {
  const [showPlan, setShowPlan] = useState(false);

  // Loading skeleton
  if (!signal || !signal.signal) {
    return (
      <div className="bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50">
          <div className="flex items-center gap-2">
            <span className="text-accent text-sm">◆</span>
            <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
              Featured Signal
            </h2>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-28 bg-terminal-muted/20 rounded animate-pulse" />
            <div className="h-8 w-20 bg-terminal-muted/20 rounded animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-24 bg-terminal-muted/20 rounded animate-pulse" />
            <div className="h-2 w-full bg-terminal-muted/20 rounded-full animate-pulse" />
          </div>
          <div className="h-12 w-full bg-terminal-muted/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const { signal: signalType, confidence, reasoning, timeframe, symbol } = signal;
  const closes = closesFromKlines(klines);

  const signalConfig = {
    BUY: {
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/30',
      glow: 'glow-green',
      icon: '↑',
      label: 'BUY',
      bgStyle: { boxShadow: '0 0 20px rgba(0,255,136,0.15), inset 0 1px 0 rgba(0,255,136,0.05)' },
    },
    WATCH: {
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      glow: 'glow-amber',
      icon: '◉',
      label: 'WATCH',
      bgStyle: { boxShadow: '0 0 20px rgba(245,158,11,0.15), inset 0 1px 0 rgba(245,158,11,0.05)' },
    },
    EXIT: {
      color: 'text-bearish',
      bg: 'bg-bearish/10',
      border: 'border-bearish/30',
      glow: 'glow-red',
      icon: '↓',
      label: 'EXIT',
      bgStyle: { boxShadow: '0 0 20px rgba(239,68,68,0.15), inset 0 1px 0 rgba(239,68,68,0.05)' },
    },
    HIGH_RISK: {
      color: 'text-bearish',
      bg: 'bg-bearish/10',
      border: 'border-bearish/30',
      glow: 'glow-red',
      icon: '⚠',
      label: 'HIGH RISK',
      bgStyle: { boxShadow: '0 0 25px rgba(239,68,68,0.2), inset 0 1px 0 rgba(239,68,68,0.08)' },
    },
  };

  const cfg = signalConfig[signalType] || signalConfig.WATCH;

  const timeframeBadge = {
    short: { label: 'SHORT', color: 'text-warning/80 border-warning/30' },
    medium: { label: 'MEDIUM', color: 'text-accent/80 border-accent/30' },
    long: { label: 'LONG', color: 'text-blue-400/80 border-blue-400/30' },
  };
  const tfCfg = timeframeBadge[timeframe] || timeframeBadge.short;

  const confidenceColor =
    confidence >= 70 ? 'bg-accent' : confidence >= 40 ? 'bg-warning' : 'bg-bearish';

  return (
    <div
      className={`bg-terminal-surface border ${cfg.border} rounded-lg overflow-hidden animate-fade-in`}
      style={cfg.bgStyle}
    >
      {/* HIGH_RISK warning banner */}
      {signalType === 'HIGH_RISK' && (
        <div className="bg-bearish/15 border-b border-bearish/30 px-4 py-1.5 flex items-center gap-2">
          <span className="text-sm">⚠️</span>
          <span className="font-mono text-[11px] text-bearish font-semibold uppercase tracking-wider animate-pulse">
            High Risk — Proceed With Caution
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">◆</span>
          <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
            Featured Signal
          </h2>
        </div>
        <div className={`px-2 py-0.5 border rounded text-[10px] font-mono ${tfCfg.color}`}>
          {tfCfg.label}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Symbol + Signal badge */}
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xl font-bold text-white tracking-wider">
            {symbol ? prettySymbol(symbol) : '—'}
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded ${cfg.bg} border ${cfg.border}`}>
            <span className={`text-lg ${cfg.color}`}>{cfg.icon}</span>
            <span className={`font-mono font-bold text-sm tracking-wider ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-terminal-muted">
              Confidence
            </span>
            <span className="font-mono text-xs text-white/80 tabular-nums font-semibold">
              {confidence ?? 0}%
            </span>
          </div>
          <div className="h-2 bg-terminal-bg rounded-full overflow-hidden border border-terminal-border">
            <div
              className={`h-full ${confidenceColor} rounded-full relative transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, confidence ?? 0))}%` }}
            >
              <div className="absolute inset-0 confidence-bar-shimmer rounded-full" />
            </div>
          </div>
        </div>

        {/* 24h price trend */}
        {closes.length >= 2 && (
          <div className="bg-terminal-bg/40 border border-terminal-border/50 rounded p-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-terminal-muted">24h Trend</span>
            <Sparkline data={closes} />
          </div>
        )}

        {/* Reasoning */}
        {reasoning && (
          <div className="bg-terminal-bg/60 border border-terminal-border/50 rounded p-3">
            <p className="font-mono text-xs text-white/70 leading-relaxed">
              <span className="text-terminal-muted select-none">// </span>
              {reasoning}
            </p>
          </div>
        )}

        {/* Insight → action */}
        {(signalType === 'BUY' || signalType === 'EXIT') && (
          <button onClick={() => setShowPlan(true)}
            className="w-full py-2 rounded border border-accent/30 bg-accent/10 font-mono text-xs text-accent hover:bg-accent/20 transition-colors">
            ⚡ Prepare Trade
          </button>
        )}
      </div>

      {showPlan && <TradePlanModal signal={signal} closes={closes} onClose={() => setShowPlan(false)} />}
    </div>
  );
}
