import { useState } from 'react';

const API_BASE = 'http://localhost:8000/api';

export default function TopMovers({ gainers, losers, onSignalFetch }) {
  const [loadingSymbol, setLoadingSymbol] = useState(null);

  const fetchSignal = async (symbol) => {
    if (!symbol) return;
    setLoadingSymbol(symbol);
    try {
      const res = await fetch(`${API_BASE}/signal/${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (onSignalFetch) onSignalFetch(data);
    } catch (err) {
      console.error('Signal fetch error:', err);
    } finally {
      setLoadingSymbol(null);
    }
  };

  const getSymbol = (item) => item.symbol || item.pair || '???';
  const getChange = (item) => {
    const val = parseFloat(item.priceChangePercent || item.changePercent || item.change || 0);
    return isNaN(val) ? 0 : val;
  };
  const getPrice = (item) => item.lastPrice || item.price || item.last || '—';
  const getVolume = (item) => {
    const v = parseFloat(item.volume || item.quoteVolume || 0);
    if (isNaN(v) || v === 0) return '—';
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return v.toFixed(0);
  };

  const renderRow = (item, idx, type) => {
    const symbol = getSymbol(item);
    const change = getChange(item);
    const isGainer = type === 'gainer';
    const isLoading = loadingSymbol === symbol;

    return (
      <button
        key={`${type}-${idx}`}
        onClick={() => fetchSignal(symbol)}
        disabled={isLoading}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.03] transition-colors group border-b border-terminal-border/20 last:border-0"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-terminal-muted text-[10px] font-mono w-4 text-right">{idx + 1}</span>
          <span className={`font-mono text-xs font-semibold truncate ${isLoading ? 'animate-pulse text-accent' : 'text-white/90 group-hover:text-white'}`}>
            {symbol}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-white/50 tabular-nums hidden sm:inline">
            {getPrice(item)}
          </span>
          <span className="font-mono text-[11px] text-white/40 tabular-nums hidden lg:inline">
            Vol {getVolume(item)}
          </span>
          <span className={`font-mono text-xs font-semibold tabular-nums ${isGainer ? 'text-accent' : 'text-bearish'}`}>
            {isGainer ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">⚡</span>
          <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
            Top Movers
          </h2>
        </div>
        <span className="text-[10px] font-mono text-terminal-muted">Click for signal</span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-terminal-border/30">
        {/* Gainers */}
        <div>
          <div className="px-3 py-1.5 bg-accent/5 border-b border-terminal-border/30">
            <span className="font-mono text-[10px] uppercase tracking-wider text-accent/60 font-medium">
              Gainers
            </span>
          </div>
          <div>
            {(!gainers || gainers.length === 0) ? (
              <div className="px-3 py-4 text-terminal-muted font-mono text-xs text-center">No data</div>
            ) : (
              gainers.map((g, i) => renderRow(g, i, 'gainer'))
            )}
          </div>
        </div>

        {/* Losers */}
        <div>
          <div className="px-3 py-1.5 bg-bearish/5 border-b border-terminal-border/30">
            <span className="font-mono text-[10px] uppercase tracking-wider text-bearish/60 font-medium">
              Losers
            </span>
          </div>
          <div>
            {(!losers || losers.length === 0) ? (
              <div className="px-3 py-4 text-terminal-muted font-mono text-xs text-center">No data</div>
            ) : (
              losers.map((l, i) => renderRow(l, i, 'loser'))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
