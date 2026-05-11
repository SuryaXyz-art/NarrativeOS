import asyncio
from services.sodex_service import SoDEXService
from services.hermes_service import HermesService
from agents.narrative_agent import NarrativeAgent

async def main():
    print("=" * 50)
    print("  NarrativeOS Pipeline Test")
    print("=" * 50)

    print("\n=== TEST 1: SoDEX Connection ===")
    sodex = SoDEXService()
    tickers = await sodex.get_ticker_all(use_testnet=True)
    print(f"Fetched {len(tickers)} tickers")
    if tickers:
        if isinstance(tickers, list):
            print("First ticker:", tickers[0])
        elif isinstance(tickers, dict):
            first_key = list(tickers.keys())[0]
            print(f"First ticker ({first_key}):", tickers[first_key])

    print("\n=== TEST 2: Top Movers ===")
    movers = await sodex.get_top_movers(use_testnet=True)
    print("Top gainers:", movers.get("gainers", [])[:3])
    print("Top losers:", movers.get("losers", [])[:3])

    print("\n=== TEST 3: Hermes AI Narrative ===")
    hermes = HermesService()
    if tickers:
        sample = tickers[:10] if isinstance(tickers, list) else list(tickers.items())[:10]
        narrative = await hermes.analyze_market_narrative(sample)
        print("Narrative:", narrative[:200] if narrative else "(empty response)")
    else:
        print("Skipped — no ticker data available")

    print("\n=== TEST 4: Full Agent Pipeline ===")
    agent = NarrativeAgent()
    result = await agent.run_full_analysis()
    print("Full analysis keys:", list(result.keys()))
    print("Signal:", result.get("featured_signal"))
    tweets = result.get("tweet_thread", [])
    if tweets:
        print("Tweet 1:", tweets[0][:100])
    else:
        print("Tweet thread: (empty)")

    print("\n" + "=" * 50)
    print("  ✅ All tests complete!")
    print("=" * 50)

asyncio.run(main())
