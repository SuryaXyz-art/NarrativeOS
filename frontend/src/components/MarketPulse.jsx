export default function MarketPulse({ pulse }) {
  const { advancers = 0, decliners = 0, avg_change = 0, sentiment = 'NEUTRAL' } = pulse || {};
  const total = advancers + decliners;
  const bullPct = total ? (advancers / total) * 100 : 50;

  const cfg = {
    BULLISH: { color: 'text-accent', dot: 'bg-accent' },
    BEARISH: { color: 'text-bearish', dot: 'bg-bearish' },
    NEUTRAL: { color: 'text-warning', dot: 'bg-warning' },
  }[sentiment] || { color: 'text-warning', dot: 'bg-warning' };

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">💓</span>
          <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
            Market Pulse
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
          <span className={`font-mono text-[11px] font-bold tracking-wider ${cfg.color}`}>{sentiment}</span>
        </div>
      </div>

      {/* Breadth bar */}
      <div className="h-2 bg-bearish/40 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-accent transition-all duration-1000 ease-out" style={{ width: `${bullPct}%` }} />
      </div>

      <div className="flex items-center justify-between font-mono text-[11px]">
        <span className="text-accent tabular-nums">▲ {advancers}</span>
        <span className={`tabular-nums ${avg_change >= 0 ? 'text-accent' : 'text-bearish'}`}>
          avg {avg_change >= 0 ? '+' : ''}{avg_change}%
        </span>
        <span className="text-bearish tabular-nums">{decliners} ▼</span>
      </div>
    </div>
  );
}
