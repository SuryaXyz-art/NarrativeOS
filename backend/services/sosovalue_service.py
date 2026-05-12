import os
import httpx
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

SOSOVALUE_API_KEY = os.getenv("SOSOVALUE_API_KEY", "")

class SoSoValueService:
    def __init__(self):
        self.api_key = SOSOVALUE_API_KEY
        self.base_url = "https://openapi.sosovalue.com/openapi/v1"
        self.headers = {"Accept": "application/json"}
        if self.api_key:
            self.headers["x-soso-api-key"] = self.api_key
        self.timeout = httpx.Timeout(15.0)

    async def _get(self, endpoint: str, params: Dict = None) -> Any:
        """Generic GET request to SoSoValue API with proper error handling."""
        if not self.api_key:
            print("[SoSoValue] WARNING: SOSOVALUE_API_KEY not configured — returning empty data")
            return []
            
        url = f"{self.base_url}{endpoint}"
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, headers=self.headers, params=params)
                if response.status_code == 200:
                    data = response.json()
                    # Some APIs wrap response in "data", some return list directly
                    if isinstance(data, dict) and "data" in data:
                        return data["data"]
                    return data
                else:
                    print(f"[SoSoValue] HTTP {response.status_code} from {endpoint}")
                    return []
        except httpx.TimeoutException:
            print(f"[SoSoValue] Timeout calling {endpoint}")
            return []
        except Exception as e:
            print(f"[SoSoValue] Error calling {endpoint}: {e}")
            return []

    async def get_hot_news(self) -> List[Dict]:
        """Fetch hot news from SoSoValue."""
        result = await self._get("/news/hot")
        if isinstance(result, dict) and "list" in result:
            return result["list"]
        if isinstance(result, list):
            return result
        return []

    async def get_macro_events(self) -> List[Dict]:
        """Fetch macro events from SoSoValue."""
        result = await self._get("/macro/events")
        if isinstance(result, list):
            return result
        return []

    async def get_etf_data(self, etf_type: str = "btc") -> List[Dict]:
        """Fetch ETF dashboard data from SoSoValue."""
        symbol = etf_type.upper()
        params = {"symbol": symbol, "country_code": "US"}
        result = await self._get("/etfs/summary-history", params=params)
        
        if isinstance(result, dict) and "list" in result:
            return result["list"]
        if isinstance(result, list):
            return result
        if isinstance(result, dict) and "error" not in result:
            return [result]
        return []
