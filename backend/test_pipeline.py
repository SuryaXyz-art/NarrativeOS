import asyncio
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from services.sodex_service import SoDEXService
from services.hermes_service import generate_narrative, explain_topic, NOUS_API_KEY
from services.sosovalue_service import SoSoValueService
from agents.narrative_agent import NarrativeAgent

async def main():
    print("=" * 60)
    print("  NarrativeOS Pipeline Test")
    print("=" * 60)

    # -- TEST 1: SoDEX Connection --
    print("\n=== TEST 1: SoDEX Connection ===")
    sodex = SoDEXService()
    tickers = []
    try:
        tickers = await sodex.get_ticker_all(use_testnet=True)
        if isinstance(tickers, list):
            print(f"  [OK] Fetched {len(tickers)} tickers")
            if tickers:
                print(f"  First ticker: {tickers[0]}")
        elif isinstance(tickers, dict):
            print(f"  [OK] Fetched {len(tickers)} tickers (dict format)")
            first_key = list(tickers.keys())[0]
            print(f"  First ticker ({first_key}): {tickers[first_key]}")
        else:
            print(f"  [WARN] Unexpected ticker format: {type(tickers)}")
    except Exception as e:
        print(f"  [FAIL] SoDEX connection failed: {e}")

    # -- TEST 2: Top Movers --
    print("\n=== TEST 2: Top Movers ===")
    try:
        movers = await sodex.get_top_movers(use_testnet=True)
        gainers = movers.get("gainers", [])
        losers = movers.get("losers", [])
        print(f"  [OK] Top gainers: {len(gainers)} found")
        for g in gainers[:3]:
            print(f"       {g.get('symbol', '?')} -- {g.get('priceChangePercent', g.get('changePercent', '?'))}%")
        print(f"  [OK] Top losers: {len(losers)} found")
        for l in losers[:3]:
            print(f"       {l.get('symbol', '?')} -- {l.get('priceChangePercent', l.get('changePercent', '?'))}%")
    except Exception as e:
        print(f"  [FAIL] Top movers failed: {e}")

    # -- TEST 3: SoSoValue Integration --
    print("\n=== TEST 3: SoSoValue Integration ===")
    soso = SoSoValueService()
    try:
        hot_news = await soso.get_hot_news()
        print(f"  [OK] Hot News: {len(hot_news)} items" if hot_news else "  [WARN] Hot News: empty (API may be unavailable)")
    except Exception as e:
        print(f"  [FAIL] Hot News error: {e}")
    
    try:
        macro_events = await soso.get_macro_events()
        print(f"  [OK] Macro Events: {len(macro_events)} items" if macro_events else "  [WARN] Macro Events: empty (API may be unavailable)")
    except Exception as e:
        print(f"  [FAIL] Macro Events error: {e}")

    # -- TEST 4: Hermes AI Narrative --
    print("\n=== TEST 4: Hermes AI Narrative ===")
    print(f"  NOUS_API_KEY configured: {'Yes' if NOUS_API_KEY else 'No'}")
    if tickers:
        try:
            sample = tickers[:10] if isinstance(tickers, list) else dict(list(tickers.items())[:10])
            narrative = await generate_narrative({"tickers": sample})
            text = narrative if isinstance(narrative, str) else str(narrative)
            if text:
                print(f"  [OK] Narrative generated ({len(text)} chars)")
                print(f"  Preview: {text[:200]}...")
            else:
                print("  [WARN] Narrative returned empty (check NOUS_API_KEY)")
        except Exception as e:
            print(f"  [FAIL] Hermes narrative error: {e}")
    else:
        print("  [SKIP] Skipped -- no ticker data available")

    # -- TEST 5: Explain Like I'm Dumb --
    print("\n=== TEST 5: Explain Like I'm Dumb ===")
    try:
        explanation = await explain_topic("Blockchain")
        if explanation:
            print(f"  [OK] Explanation generated ({len(explanation)} chars)")
            print(f"  Preview: {explanation[:150]}...")
        else:
            print("  [WARN] Explanation returned empty")
    except Exception as e:
        print(f"  [FAIL] Explain error: {e}")

    # -- TEST 6: Full Agent Pipeline --
    print("\n=== TEST 6: Full Agent Pipeline ===")
    agent = NarrativeAgent()
    try:
        result = await agent.run_full_analysis()
        print(f"  [OK] Full analysis completed!")
        print(f"  Keys: {list(result.keys())}")
        print(f"  Tickers tracked: {result.get('raw_ticker_count', '?')}")
        signals = result.get('signals', [])
        signal = signals[0] if signals else {}
        print(f"  Signal: {signal.get('signal', 'N/A')} "
              f"({signal.get('confidence', '?')}% confidence)")
        tweets = result.get("tweets", [])
        if tweets:
            print(f"  Tweets: {len(tweets)} generated")
            print(f"  Tweet 1: {tweets[0][:100]}...")
        else:
            print("  Tweets: (none generated)")
        print(f"  News items: {len(result.get('soso_hot_news', []))}")
        print(f"  Macro events: {len(result.get('soso_macro_events', []))}")
    except Exception as e:
        print(f"  [FAIL] Full pipeline error: {e}")

    print("\n" + "=" * 60)
    print("  All tests complete!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
