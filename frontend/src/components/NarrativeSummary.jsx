import { useState, useEffect, useRef } from 'react';

export default function NarrativeSummary({ narrative, timestamp, onCopy }) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const prevNarrative = useRef('');

  useEffect(() => {
    if (!narrative || narrative === prevNarrative.current) return;
    prevNarrative.current = narrative;
    setIsTyping(true);
    setDisplayText('');

    let idx = 0;
    const speed = Math.max(8, Math.min(25, 2000 / narrative.length));
    const timer = setInterval(() => {
      idx++;
      setDisplayText(narrative.slice(0, idx));
      if (idx >= narrative.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [narrative]);

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString('en-US', { hour12: false }) + ' UTC';
    } catch {
      return ts;
    }
  };

  const handleCopy = async () => {
    if (!narrative) return;
    try {
      await navigator.clipboard.writeText(narrative);
      setCopied(true);
      if (onCopy) onCopy('Narrative copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Loading skeleton
  if (!narrative && !isTyping) {
    return (
      <div className="bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50">
          <div className="flex items-center gap-2">
            <span className="text-accent text-sm">🧠</span>
            <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
              AI Narrative Analysis
            </h2>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-terminal-muted/20 rounded animate-pulse w-full" />
          <div className="h-4 bg-terminal-muted/20 rounded animate-pulse w-5/6" />
          <div className="h-4 bg-terminal-muted/20 rounded animate-pulse w-4/6" />
          <div className="h-4 bg-terminal-muted/20 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-terminal-muted/20 rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">🧠</span>
          <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
            AI Narrative Analysis
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isTyping && (
            <span className="text-accent/60 text-[10px] font-mono uppercase tracking-wider animate-pulse">
              Analyzing...
            </span>
          )}
          {/* Share / Copy button */}
          {narrative && !isTyping && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-terminal-border text-[10px] font-mono text-terminal-muted hover:text-accent hover:border-accent/30 transition-colors"
            >
              {copied ? (
                <>
                  <span>📋</span>
                  <span className="text-accent">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>Share</span>
                </>
              )}
            </button>
          )}
          <span className="text-terminal-muted text-[10px] font-mono">
            {formatTimestamp(timestamp)}
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="relative p-4 min-h-[160px]">
        <div className="scanline-overlay rounded" />
        <div className="relative">
          <pre className="font-mono text-sm text-accent leading-relaxed whitespace-pre-wrap break-words">
            <span className="text-accent/30 select-none">{'> '}</span>
            {displayText}
            {isTyping && <span className="typewriter-cursor" />}
          </pre>
        </div>
      </div>
    </div>
  );
}
