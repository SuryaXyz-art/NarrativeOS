import { useRef } from 'react';
import { prettySymbol } from '../utils/format';

export default function MarketTicker({ tickers = [] }) {
  const trackRef = useRef(null);

  const getPrice = (t) => t.lastPx || t.lastPrice || t.price || t.last || '—';
  const getChange = (t) => {
    const val = parseFloat(t.changePct ?? t.priceChangePercent ?? t.changePercent ?? 0);
    return isNaN(val) ? 0 : val;
  };
  const getSymbol = (t) => t.symbol || t.pair || '???';

  if (tickers.length === 0) {
    return (
      <div className="bg-terminal-surface border-b border-terminal-border h-8 flex items-center px-4">
        <span className="text-terminal-muted font-mono text-xs animate-pulse">Loading market data...</span>
      </div>
    );
  }

  // Duplicate data for seamless infinite scroll
  const displayTickers = [...tickers, ...tickers];

  return (
    <div className="bg-terminal-surface/60 border-b border-terminal-border h-8 overflow-hidden relative">
      <div ref={trackRef} className="ticker-track animate-ticker-scroll h-full items-center">
        {displayTickers.map((t, i) => {
          const change = getChange(t);
          const isPositive = change >= 0;
          const isHot = change > 10;
          return (
            <div key={i} className="flex items-center gap-1.5 px-4 h-full shrink-0 border-r border-terminal-border/30">
              {isHot && <span className="text-xs">🔥</span>}
              <span className="font-mono text-xs text-white/60 font-medium">{prettySymbol(getSymbol(t))}</span>
              <span className="font-mono text-xs text-white/80 tabular-nums">{getPrice(t)}</span>
              <span className={`font-mono text-[11px] tabular-nums font-medium ${isPositive ? 'text-accent' : 'text-bearish'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
