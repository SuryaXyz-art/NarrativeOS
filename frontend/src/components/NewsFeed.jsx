const stripHtml = (s) => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const fmtTime = (i) => {
  const t = i.release_time || i.create_time || i.publishTime || i.time;
  if (t) {
    const d = new Date(Number(t));
    if (!isNaN(d)) return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  return i.source || i.date || '';
};

export default function NewsFeed({ news = [], events = [] }) {
  const getTitle = (i) => i.title || i.headline || i.name || 'Untitled';
  const getSummary = (i) => stripHtml(i.summary || i.description || i.content || i.text || '');
  const getUrl = (i) => i.source_link || i.url || i.link || null;

  const hasData = news.length > 0 || events.length > 0;

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-terminal-border bg-terminal-bg/50">
        <span className="text-accent text-sm">📰</span>
        <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
          Market Intel
        </h2>
        <span className="ml-auto font-mono text-[9px] text-terminal-muted">via SoSoValue</span>
      </div>

      <div className="p-3 space-y-3">
        {!hasData && (
          <div className="py-4 text-center text-terminal-muted font-mono text-xs">No news available</div>
        )}

        {/* Hot news */}
        {news.length > 0 && (
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-accent/60 font-medium">Hot News</span>
            {news.map((item, idx) => {
              const url = getUrl(item);
              const body = (
                <div className="bg-terminal-bg/60 border border-terminal-border/50 rounded p-2.5 hover:border-accent/30 transition-colors">
                  <p className="text-xs text-white/90 font-medium leading-snug break-words">{getTitle(item)}</p>
                  {getSummary(item) && (
                    <p className="mt-1 text-[11px] text-white/50 leading-relaxed line-clamp-2 break-words">{getSummary(item)}</p>
                  )}
                  {fmtTime(item) && (
                    <span className="mt-1 block font-mono text-[9px] text-terminal-muted">{fmtTime(item)}</span>
                  )}
                </div>
              );
              return url ? (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="block">{body}</a>
              ) : (
                <div key={idx}>{body}</div>
              );
            })}
          </div>
        )}

        {/* Macro events — SoSoValue shape: { date, events: [string] } */}
        {events.length > 0 && (
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-warning/70 font-medium">Macro Events</span>
            {events.map((item, idx) => {
              const names = Array.isArray(item.events) ? item.events : (item.title ? [item.title] : []);
              return (
                <div key={idx} className="bg-terminal-bg/60 border border-terminal-border/50 rounded p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-warning text-[10px]">◆</span>
                    <span className="font-mono text-[10px] text-warning/80">{item.date || ''}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {names.map((ev, j) => (
                      <span key={j} className="font-mono text-[10px] text-white/75 bg-terminal-surface border border-terminal-border/50 rounded px-1.5 py-0.5">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
