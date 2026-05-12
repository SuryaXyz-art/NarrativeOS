import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ExplainBox() {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setExplanation('');

    try {
      const res = await fetch(`${API_BASE}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setExplanation(data.explanation || 'No explanation returned.');
    } catch (err) {
      setError('Failed to get explanation. Is the backend running?');
      console.error('Explain error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50">
        <span className="text-accent text-sm">💡</span>
        <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
          Explain Like I'm Dumb
        </h2>
      </div>

      <div className="p-3 space-y-3">
        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Ask me to explain anything crypto..."
            className="flex-1 bg-terminal-bg border border-terminal-border rounded px-3 py-2 text-sm text-white/90 font-mono placeholder:text-terminal-muted/60 focus:outline-none focus:border-accent/40 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="px-3 py-2 bg-accent/10 border border-accent/30 rounded font-mono text-xs text-accent hover:bg-accent/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="bg-terminal-bg/60 border border-accent/20 rounded p-3">
            <span className="font-mono text-xs text-accent animate-pulse">⚡ Thinking...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-bearish/10 border border-bearish/30 rounded p-3">
            <span className="font-mono text-xs text-bearish">{error}</span>
          </div>
        )}

        {/* Explanation output */}
        {explanation && !loading && (
          <div className="relative bg-terminal-bg/60 border border-accent/20 rounded p-3">
            <div className="scanline-overlay rounded" />
            <pre className="font-mono text-xs text-accent leading-relaxed whitespace-pre-wrap break-words">
              <span className="text-accent/30 select-none">{'> '}</span>
              {explanation}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
