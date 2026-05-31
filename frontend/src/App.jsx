import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import MarketTicker from './components/MarketTicker';
import NarrativeSummary from './components/NarrativeSummary';
import SignalCard from './components/SignalCard';
import TopMovers from './components/TopMovers';
import MarketPulse from './components/MarketPulse';
import ETFPanel from './components/ETFPanel';
import TweetThread from './components/TweetThread';
import NewsFeed from './components/NewsFeed';
import ExplainBox from './components/ExplainBox';
import ProjectShowcase from './components/ProjectShowcase';
import Toast from './components/Toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const REFRESH_INTERVAL = 60;
const TICKER_REFRESH_INTERVAL = 30;

export default function App() {
  // ─── Analysis state ───
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [isConnected, setIsConnected] = useState(false);

  // ─── Ticker state (independent refresh cycle) ───
  const [tickers, setTickers] = useState([]);

  // ─── Signal override (when user clicks a symbol in TopMovers) ───
  const [activeSignal, setActiveSignal] = useState(null);

  // ─── Toast notification ───
  const [toastMessage, setToastMessage] = useState(null);
  const toastKey = useRef(0);

  const showToast = useCallback((message) => {
    toastKey.current += 1;
    setToastMessage(message);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Track if first load has completed
  const hasLoadedOnce = useRef(false);

  // ─── Fetch analysis data ───
  const fetchAnalysis = useCallback(async () => {
    // Only show the full-screen spinner on the very first load
    if (!hasLoadedOnce.current) {
      setLoading(true);
    }
    try {
      const res = await fetch(`${API_BASE}/api/analysis`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAnalysisData(data);
      setActiveSignal(data.featured_signal || (data.signals && data.signals[0]) || null);
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }));
      setError(null);
      setIsConnected(true);
      if (hasLoadedOnce.current) {
        showToast('Analysis refreshed');
      }
    } catch (err) {
      console.error('Analysis fetch error:', err);
      setError('Failed to connect to NarrativeOS backend. Is the server running on port 8000?');
      setIsConnected(false);
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
      setCountdown(REFRESH_INTERVAL);
    }
  }, [showToast]);

  // ─── Fetch tickers independently ───
  const fetchTickers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tickers`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTickers(data);
      } else if (typeof data === 'object' && data !== null) {
        const list = Object.entries(data).map(([symbol, info]) => ({
          symbol,
          ...(typeof info === 'object' ? info : {}),
        }));
        setTickers(list);
      }
    } catch (err) {
      console.error('Ticker fetch error:', err);
    }
  }, []);

  // ─── Initial fetch + auto-refresh for analysis (60s) ───
  useEffect(() => {
    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchAnalysis]);

  // ─── Independent ticker refresh (30s) ───
  useEffect(() => {
    fetchTickers();
    const interval = setInterval(fetchTickers, TICKER_REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, [fetchTickers]);

  // ─── Countdown timer (ticks every second) ───
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Manual refresh (resets countdown) ───
  const handleRefreshNow = useCallback(() => {
    setCountdown(REFRESH_INTERVAL);
    fetchAnalysis();
  }, [fetchAnalysis]);

  // ─── Handle signal click from TopMovers ───
  const handleSignalFetch = useCallback((signalData) => {
    setActiveSignal(signalData);
    const sym = signalData?.symbol || 'unknown';
    showToast(`Signal updated for ${sym}`);
  }, [showToast]);

  // ─── Handle narrative copy ───
  const handleNarrativeCopy = useCallback((msg) => {
    showToast(msg);
  }, [showToast]);

  // ─── Loading screen ───
  return (
    <div className="min-h-screen bg-terminal-bg flex flex-col">
      {/* Project showcase / landing — always visible above the live terminal */}
      <ProjectShowcase />

      {/* ─── Live terminal ─── */}
      <div id="dashboard">
      {loading && <div className="h-0.5 bg-accent/40 animate-pulse" />}
      {/* Market ticker bar — full width */}
      <MarketTicker tickers={tickers} />

      {/* Header — full width */}
      <Header
        isConnected={isConnected}
        refreshCountdown={countdown}
        lastUpdated={lastUpdated}
        onRefreshNow={handleRefreshNow}
      />

      {/* Error banner */}
      {error && (
        <div className="bg-bearish/10 border-b border-bearish/30 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-bearish text-sm">⚠</span>
            <span className="font-mono text-xs text-bearish">{error}</span>
          </div>
          <button
            onClick={handleRefreshNow}
            className="px-2 py-1 rounded border border-bearish/30 text-[10px] font-mono text-bearish hover:bg-bearish/20 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Toast notification */}
      <Toast key={toastKey.current} message={toastMessage} onDismiss={dismissToast} />

      {/* ─── Main 3-column grid ─── */}
      <main className="flex-1 p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5 max-w-[1800px] mx-auto">

          {/* Left column (1/4): TopMovers + Market Stats */}
          <div className="lg:col-span-1 space-y-4">
            <MarketPulse pulse={analysisData?.market_pulse} />
            <TopMovers
              gainers={analysisData?.top_movers?.gainers || analysisData?.top_gainers || []}
              losers={analysisData?.top_movers?.losers || analysisData?.top_losers || []}
              onSignalFetch={handleSignalFetch}
            />

            {/* Market Stats card */}
            <div className="bg-terminal-surface border border-terminal-border rounded-lg p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-accent text-sm">📊</span>
                <h2 className="font-mono text-[11px] tracking-[0.15em] uppercase text-accent/80 font-semibold">
                  Market Stats
                </h2>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-terminal-muted">Tickers Tracked</span>
                  <span className="font-mono text-sm text-white font-semibold tabular-nums">
                    {analysisData?.raw_ticker_count ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-terminal-muted">Last Updated</span>
                  <span className="font-mono text-[11px] text-white/60 tabular-nums">
                    {lastUpdated || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-terminal-muted">Next Refresh</span>
                  <span className="font-mono text-[11px] text-accent/70 tabular-nums">{countdown}s</span>
                </div>
              </div>
            </div>
            <ETFPanel />
          </div>

          {/* Center column (2/4): NarrativeSummary + SignalCard */}
          <div className="lg:col-span-2 space-y-4">
            <NarrativeSummary
              narrative={analysisData?.narrative_summary || ''}
              timestamp={analysisData?.timestamp || ''}
              onCopy={handleNarrativeCopy}
            />
            <SignalCard signal={activeSignal} klines={analysisData?.gainers_klines?.[activeSignal?.symbol]} />
          </div>

          {/* Right column (1/4): TweetThread + Market Intel */}
          <div className="lg:col-span-1 space-y-4">
            <TweetThread
              tweets={analysisData?.tweets || analysisData?.tweet_thread || []}
              onRefresh={handleRefreshNow}
            />
            <NewsFeed
              news={analysisData?.soso_hot_news || []}
              events={analysisData?.soso_macro_events || []}
            />
          </div>
        </div>

        {/* ─── Explain Like I'm Dumb — Full-width centered section ─── */}
        <div className="mt-6 max-w-2xl mx-auto">
          <ExplainBox />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border px-6 py-4">
        <p className="text-center font-mono text-[11px] text-terminal-muted/60">
          Built for the SoSoValue Agentic Finance Hackathon &nbsp;│&nbsp; Powered by SoSoValue + SoDEX + Nous Hermes AI &nbsp;│&nbsp; Not financial advice
        </p>
      </footer>
      </div>
    </div>
  );
}
