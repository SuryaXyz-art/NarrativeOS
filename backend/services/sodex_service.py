import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

SODEX_MAINNET_SPOT = os.getenv("SODEX_MAINNET_SPOT", "https://mainnet-gw.sodex.dev/api/v1/spot")
SODEX_MAINNET_PERPS = os.getenv("SODEX_MAINNET_PERPS", "https://mainnet-gw.sodex.dev/api/v1/perps")
SODEX_TESTNET_SPOT = os.getenv("SODEX_TESTNET_SPOT", "https://testnet-gw.sodex.dev/api/v1/spot")
SODEX_TESTNET_PERPS = os.getenv("SODEX_TESTNET_PERPS", "https://testnet-gw.sodex.dev/api/v1/perps")

class SoDEXService:
    def __init__(self):
        self.headers = {"Accept": "application/json"}
        self.timeout = httpx.Timeout(10.0)

    def _get_base_url(self, use_testnet: bool, market_type: str = "spot") -> str:
        if use_testnet:
            return SODEX_TESTNET_SPOT if market_type == "spot" else SODEX_TESTNET_PERPS
        else:
            return SODEX_MAINNET_SPOT if market_type == "spot" else SODEX_MAINNET_PERPS

    async def _fetch(self, url: str, params: dict = None) -> list | dict:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=self.headers, params=params)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return []

    async def get_all_markets(self, use_testnet: bool = True):
        """Fetch all available spot markets."""
        base_url = self._get_base_url(use_testnet)
        return await self._fetch(f"{base_url}/markets")

    async def get_ticker_all(self, use_testnet: bool = True):
        """Fetch all ticker data (price, volume, change%)."""
        base_url = self._get_base_url(use_testnet)
        return await self._fetch(f"{base_url}/ticker")

    async def get_klines(self, symbol: str, interval: str = "1h", limit: int = 24, use_testnet: bool = True):
        """Candlestick data."""
        base_url = self._get_base_url(use_testnet)
        params = {"symbol": symbol, "interval": interval, "limit": limit}
        return await self._fetch(f"{base_url}/klines", params)

    async def get_recent_trades(self, symbol: str, limit: int = 20, use_testnet: bool = True):
        """Recent trade list."""
        base_url = self._get_base_url(use_testnet)
        params = {"symbol": symbol, "limit": limit}
        return await self._fetch(f"{base_url}/trades", params)

    async def get_top_movers(self, use_testnet: bool = True):
        """Parse ticker data and return top 5 gainers and top 5 losers."""
        try:
            tickers = await self.get_ticker_all(use_testnet=use_testnet)
            if not tickers:
                return {"gainers": [], "losers": []}

            # If it returns a dict of symbol -> data, convert to list
            if isinstance(tickers, dict):
                ticker_list = []
                for k, v in tickers.items():
                    if isinstance(v, dict):
                        v['symbol'] = k
                        ticker_list.append(v)
                tickers = ticker_list

            valid_tickers = []
            for t in tickers:
                if not isinstance(t, dict):
                    continue
                
                # Accommodate various possible naming conventions for 24h change
                change = t.get('priceChangePercent') or t.get('changePercent') or t.get('change') or t.get('24h_change')
                try:
                    if change is not None:
                        t['_change_val'] = float(change)
                        valid_tickers.append(t)
                except ValueError:
                    pass

            if not valid_tickers:
                return {"gainers": [], "losers": []}

            # Sort by percentage change descending
            valid_tickers.sort(key=lambda x: x['_change_val'], reverse=True)

            gainers = valid_tickers[:5]
            for g in gainers:
                g.pop('_change_val', None)

            losers = valid_tickers[-5:]
            # Reverse so the largest negative change is first in the losers list
            losers.reverse()
            for l in losers:
                l.pop('_change_val', None)

            return {
                "gainers": gainers,
                "losers": losers
            }
        except Exception as e:
            print(f"Error parsing top movers: {e}")
            return {"gainers": [], "losers": []}

if __name__ == "__main__":
    async def run_test():
        print("Testing SoDEXService...")
        service = SoDEXService()
        
        print("\n--- Fetching Tickers (Testnet) ---")
        tickers = await service.get_ticker_all(use_testnet=True)
        if isinstance(tickers, list) and len(tickers) > 0:
            print(f"Success! Retrieved {len(tickers)} tickers. First item: {tickers[0]}")
        elif isinstance(tickers, dict) and len(tickers) > 0:
            print(f"Success! Retrieved {len(tickers)} tickers. (Dict format)")
        else:
            print(f"Returned: {tickers}")

        print("\n--- Fetching Top Movers ---")
        movers = await service.get_top_movers(use_testnet=True)
        print(f"Top 5 Gainers: {len(movers['gainers'])}")
        print(f"Top 5 Losers: {len(movers['losers'])}")

    asyncio.run(run_test())
