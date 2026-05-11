import time
from datetime import datetime, timezone
from services.sodex_service import SoDEXService
from services.hermes_service import HermesService
from services.sosovalue_service import SoSoValueService

# In-memory cache for full analysis
_CACHE = {
    "data": None,
    "timestamp": 0
}
CACHE_TTL = 300  # 5 minutes

class NarrativeAgent:
    def __init__(self):
        self.sodex = SoDEXService()
        self.hermes = HermesService()
        self.sosovalue = SoSoValueService()

    async def run_full_analysis(self) -> dict:
        """
        Main pipeline coordinating market data and AI services.
        Steps: SoDEX tickers → top movers → klines → SoSoValue context → Hermes AI → signal → tweets
        """
        current_time = time.time()
        # Check cache
        if _CACHE["data"] and (current_time - _CACHE["timestamp"]) < CACHE_TTL:
            return _CACHE["data"]

        # 1. Fetch all tickers from SoDEX
        tickers = await self.sodex.get_ticker_all()
        raw_ticker_count = len(tickers) if isinstance(tickers, list) else len(tickers.keys()) if isinstance(tickers, dict) else 0

        # 2. Fetch top movers
        movers = await self.sodex.get_top_movers()
        top_gainers = movers.get("gainers", [])
        top_losers = movers.get("losers", [])

        # 3. For each of the top 5 gainers, fetch kline data
        gainers_klines = {}
        for gainer in top_gainers:
            symbol = gainer.get("symbol")
            if symbol:
                try:
                    klines = await self.sodex.get_klines(symbol, interval="1h", limit=24)
                    gainers_klines[symbol] = klines
                except Exception as e:
                    print(f"[NarrativeAgent] Failed to fetch klines for {symbol}: {e}")
                    gainers_klines[symbol] = []

        # 4. Fetch contextual data from SoSoValue (graceful fallback)
        hot_news_list = []
        macro_events_list = []
        try:
            hot_news = await self.sosovalue.get_hot_news()
            hot_news_list = hot_news if isinstance(hot_news, list) else []
        except Exception as e:
            print(f"[NarrativeAgent] SoSoValue hot_news failed (non-critical): {e}")

        try:
            macro_events = await self.sosovalue.get_macro_events()
            macro_events_list = macro_events if isinstance(macro_events, list) else []
        except Exception as e:
            print(f"[NarrativeAgent] SoSoValue macro_events failed (non-critical): {e}")

        # Build enriched context dictionary for Hermes
        enriched_context = {
            "tickers": tickers,
            "soso_hot_news": hot_news_list[:5],
            "soso_macro_events": macro_events_list[:3]
        }

        # 5. Send enriched context to HermesService for narrative analysis
        narrative_summary = await self.hermes.analyze_market_narrative(enriched_context)

        # 6. For the #1 top gainer, generate a featured signal
        featured_signal = {}
        if top_gainers:
            top_symbol = top_gainers[0].get("symbol")
            if top_symbol:
                top_klines = gainers_klines.get(top_symbol, [])
                featured_signal = await self.hermes.generate_signal(top_symbol, top_klines, narrative_summary)
                featured_signal["symbol"] = top_symbol

        # 7. Generate tweet thread
        tweet_thread = await self.hermes.generate_tweet_thread(narrative_summary, top_gainers)

        # 8. Return the structured dictionary
        result = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "top_gainers": top_gainers,
            "top_losers": top_losers,
            "narrative_summary": narrative_summary,
            "featured_signal": featured_signal,
            "tweet_thread": tweet_thread,
            "raw_ticker_count": raw_ticker_count,
            "soso_hot_news": hot_news_list[:5],
            "soso_macro_events": macro_events_list[:3]
        }

        # Update cache
        _CACHE["data"] = result
        _CACHE["timestamp"] = current_time

        return result

    async def get_quick_signal(self, symbol: str) -> dict:
        """
        Faster version for a single symbol.
        """
        # 1. Fetch klines
        klines = await self.sodex.get_klines(symbol, interval="1h", limit=24)
        
        # 2. Fetch narrative context from cache or default text
        narrative_context = "General crypto market trend."
        if _CACHE["data"]:
            narrative_context = _CACHE["data"].get("narrative_summary", narrative_context)
            
        # 3. Generate and return signal
        signal = await self.hermes.generate_signal(symbol, klines, narrative_context)
        signal["symbol"] = symbol
        return signal
