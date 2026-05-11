import asyncio
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from services.hermes_service import HermesService
from services.sosovalue_service import SoSoValueService

async def main():
    print("=" * 50)
    print("  NarrativeOS Integration Tests")
    print("=" * 50)

    # -- SoSoValue Tests --
    print("\n--- SoSoValue API ---")
    soso = SoSoValueService()
    
    print(f"  API Key configured: {'Yes' if soso.api_key else 'No'}")
    
    try:
        hot_news = await soso.get_hot_news()
        if isinstance(hot_news, list) and len(hot_news) > 0:
            print(f"  [OK] Hot News: {len(hot_news)} items")
            print(f"       First item keys: {list(hot_news[0].keys()) if isinstance(hot_news[0], dict) else 'N/A'}")
        else:
            print(f"  [WARN] Hot News: empty (API may return empty or be unavailable)")
    except Exception as e:
        print(f"  [FAIL] Hot News error: {e}")
        
    try:
        macro_events = await soso.get_macro_events()
        if isinstance(macro_events, list) and len(macro_events) > 0:
            print(f"  [OK] Macro Events: {len(macro_events)} items")
            print(f"       First item keys: {list(macro_events[0].keys()) if isinstance(macro_events[0], dict) else 'N/A'}")
        else:
            print(f"  [WARN] Macro Events: empty (API may return empty or be unavailable)")
    except Exception as e:
        print(f"  [FAIL] Macro Events error: {e}")

    try:
        etf_data = await soso.get_etf_data("btc")
        if isinstance(etf_data, list) and len(etf_data) > 0:
            print(f"  [OK] ETF Data (BTC): {len(etf_data)} items")
        else:
            print(f"  [WARN] ETF Data: empty (API may return empty or be unavailable)")
    except Exception as e:
        print(f"  [FAIL] ETF Data error: {e}")

    # -- Hermes AI Tests --
    print("\n--- Nous Hermes AI ---")
    hermes = HermesService()
    
    print(f"  API Key configured: {'Yes' if hermes.api_key else 'No'}")
    
    try:
        result = await hermes.explain_like_im_dumb("Blockchain")
        if result:
            print(f"  [OK] Hermes Output ({len(result)} chars): {result[:120]}...")
        else:
            print("  [WARN] Hermes returned empty response (check API key)")
    except Exception as e:
        print(f"  [FAIL] Hermes error: {e}")

    print("\n" + "=" * 50)
    print("  All integration tests complete!")
    print("=" * 50)

if __name__ == "__main__":
    asyncio.run(main())
