import os
import httpx
from typing import Dict, Any, List

class SoSoValueService:
    def __init__(self):
        self.api_key = os.getenv("SOSOVALUE_API_KEY")
        self.base_url = "https://openapi.sosovalue.com/openapi/v1"
        self.headers = {}
        if self.api_key:
            self.headers["x-soso-api-key"] = self.api_key

    async def _get(self, endpoint: str, params: Dict = None) -> Any:
        if not self.api_key:
            return {"error": "SOSOVALUE_API_KEY not configured"}
            
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}{endpoint}"
            response = await client.get(url, headers=self.headers, params=params, timeout=10.0)
            # Some APIs wrap response in "data", some return list directly. 
            # We will return the parsed JSON.
            if response.status_code == 200:
                return response.json()
            else:
                response.raise_for_status()

    async def get_hot_news(self) -> List[Dict]:
        """Fetch hot news from SoSoValue"""
        try:
            data = await self._get("/news/hot")
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                return data.get("data", [])
            return []
        except Exception as e:
            print(f"SoSoValue get_hot_news error: {e}")
            return []

    async def get_macro_events(self) -> List[Dict]:
        """Fetch macro events from SoSoValue"""
        try:
            data = await self._get("/macro/events")
            if isinstance(data, list):
                return data
            elif isinstance(data, dict):
                return data.get("data", [])
            return []
        except Exception as e:
            print(f"SoSoValue get_macro_events error: {e}")
            return []
