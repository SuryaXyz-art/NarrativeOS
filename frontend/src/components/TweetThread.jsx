import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function TweetThread({ tweets: initialTweets, onRefresh }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [tweets, setTweets] = useState(initialTweets || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTweets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/analysis`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const newTweets = data.tweets || data.analysis?.tweets || [];
      setTweets(newTweets);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch tweets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialTweets || initialTweets.length === 0) {
      fetchTweets();
    } else {
      setTweets(initialTweets);
    }
  }, [initialTweets]);

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    }
    await fetchTweets();
  };

  const copyToClipboard = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const cleanTweet = (text) => {
    return text.replace(/^\d+[\.\)\/]\s*/, '').replace(/^Tweet\s*\d+:\s*/i, '').trim();
  };

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">✦</span>
          <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
            Tweet Thread
          </h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-2 py-1 rounded border border-terminal-border text-[10px] font-mono text-terminal-muted hover:text-accent hover:border-accent/30 transition-colors disabled:opacity-50"
        >
          <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
          Generate New
        </button>
      </div>

      {/* Tweets */}
      <div className="p-3 space-y-2">
        {loading ? (
          <div className="py-6 text-center text-accent font-mono text-xs animate-pulse">
            Generating tweets...
          </div>
        ) : error ? (
          <div className="py-6 text-center text-bearish font-mono text-xs">
            {error}
          </div>
        ) : (!tweets || tweets.length === 0) ? (
          <div className="py-6 text-center text-terminal-muted font-mono text-xs">
            No market data available right now
          </div>
        ) : (
          tweets.map((tweet, idx) => (
            <div
              key={idx}
              className="bg-terminal-bg/60 border border-terminal-border/50 rounded-lg p-3 hover:border-terminal-border transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  {/* Thread number */}
                  <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent text-[10px] font-mono font-bold">{idx + 1}</span>
                  </div>
                  {/* Tweet text */}
                  <p className="text-sm text-white/80 leading-relaxed break-words">
                    {cleanTweet(tweet)}
                  </p>
                </div>

                {/* Copy button */}
                <button
                  onClick={() => copyToClipboard(cleanTweet(tweet), idx)}
                  className="shrink-0 p-1.5 rounded hover:bg-white/[0.05] transition-colors group"
                  title="Copy tweet"
                >
                  {copiedIdx === idx ? (
                    <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-terminal-muted group-hover:text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Character count */}
              <div className="mt-2 flex justify-end">
                <span className={`font-mono text-[10px] ${cleanTweet(tweet).length > 240 ? 'text-bearish' : 'text-terminal-muted'}`}>
                  {cleanTweet(tweet).length}/240
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
