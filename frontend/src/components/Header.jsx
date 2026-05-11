import { useState, useEffect } from 'react';

export default function Header({ isConnected, refreshCountdown, lastUpdated, onRefreshNow }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Data is "fresh" if lastUpdated exists (meaning we got data within the refresh cycle)
  const isFresh = isConnected && !!lastUpdated;

  return (
    <header className="border-b border-terminal-border bg-terminal-surface/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Logo + LIVE dot */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 border border-accent/50 flex items-center justify-center">
            <span className="text-accent font-mono font-bold text-sm">N</span>
            {/* Pulsing LIVE dot when data is fresh */}
            {isFresh && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
            )}
          </div>
          <div>
            <h1 className="font-mono font-bold text-lg tracking-wider text-white leading-none">
              NARRATIVE <span className="text-accent">OS</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-terminal-muted font-mono">
              AI-Powered Crypto Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Center: Clock */}
      <div className="hidden md:flex items-center gap-3 text-terminal-muted font-mono text-xs">
        <span>{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        <span className="text-accent/50">│</span>
        <span className="tabular-nums">{time.toLocaleTimeString('en-US', { hour12: false })}</span>
        <span className="text-accent/50">│</span>
        <span>UTC{time.getTimezoneOffset() <= 0 ? '+' : '-'}{Math.abs(Math.floor(time.getTimezoneOffset() / 60))}</span>
      </div>

      {/* Right: Refresh + Countdown + Status */}
      <div className="flex items-center gap-3">
        {/* Refresh Now button */}
        <button
          onClick={onRefreshNow}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-terminal-border text-[10px] font-mono text-terminal-muted hover:text-accent hover:border-accent/40 transition-colors active:scale-95"
          title="Refresh now"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          Refresh
        </button>

        {/* Countdown */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-terminal-muted">
          <svg className="w-3 h-3 animate-spin text-accent/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M6.34 6.34L3.51 3.51" />
          </svg>
          <span className="tabular-nums">{refreshCountdown}s</span>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent animate-pulse-glow' : 'bg-bearish animate-pulse'}`} />
          <span className={`text-xs font-mono ${isConnected ? 'text-accent/70' : 'text-bearish/70'}`}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
          {lastUpdated && (
            <span className="text-[10px] font-mono text-terminal-muted ml-1 hidden sm:inline">
              · {lastUpdated}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
