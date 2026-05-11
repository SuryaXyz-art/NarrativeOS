import asyncio
from services.hermes_service import HermesService
from services.sosovalue_service import SoSoValueService

async def main():
    print("Testing SoSoValue API...")
    soso = SoSoValueService()
    try:
        hot_news = await soso.get_hot_news()
        print(f"Hot News success! Count: {len(hot_news) if isinstance(hot_news, list) else 'Not a list'}")
    except Exception as e:
        print(f"Hot News error: {e}")
        
    try:
        macro_events = await soso.get_macro_events()
        print(f"Macro Events success! Count: {len(macro_events) if isinstance(macro_events, list) else 'Not a list'}")
    except Exception as e:
        print(f"Macro Events error: {e}")

    print("\nTesting NOUS (Hermes) API...")
    hermes = HermesService()
    try:
        result = await hermes.explain_like_im_dumb("Blockchain")
        print("Hermes Output:", result)
    except Exception as e:
        print(f"Hermes error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
