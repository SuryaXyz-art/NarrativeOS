import os
import json
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

NOUS_API_KEY = os.getenv("NOUS_API_KEY", "")
NOUS_BASE_URL = "https://inference-api.nousresearch.com/v1/chat/completions"
DEFAULT_MODEL = "Hermes-4-70B"

class HermesService:
    def __init__(self):
        self.api_key = NOUS_API_KEY
        self.base_url = NOUS_BASE_URL
        self.model = DEFAULT_MODEL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        # Hermes 70B can take a little time, so a 30s timeout is safe
        self.timeout = httpx.Timeout(30.0)

    async def _call_api(self, messages: list, max_tokens: int = 500) -> str:
        """Helper function to call the Nous Research API with retry logic."""
        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": max_tokens
        }
        
        # Retry logic: 1 attempt + 1 retry (2 total)
        for attempt in range(2):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(
                        self.base_url,
                        headers=self.headers,
                        json=payload
                    )
                    response.raise_for_status()
                    data = response.json()
                    
                    if "choices" in data and len(data["choices"]) > 0:
                        return data["choices"][0]["message"]["content"].strip()
                    return ""
            except Exception as e:
                print(f"Error calling Nous Research API (Attempt {attempt+1}/2): {e}")
                if attempt == 0:
                    await asyncio.sleep(2)  # Wait 2 seconds before retrying
                else:
                    return ""
        return ""

    async def analyze_market_narrative(self, ticker_data: list) -> str:
        """Identify top trending narratives based on market data."""
        system_prompt = "You are a crypto market analyst specializing in narrative detection. Identify the top 3 trending narratives based on price action and volume. Be specific about what sectors or themes are gaining momentum. Format as: NARRATIVE 1: [name] - [1 sentence explanation]. Keep response under 150 words."
        
        # We cap the ticker data to avoid exceeding context limits if the list is massive
        user_prompt = f"Here is the latest ticker data:\n{json.dumps(ticker_data)[:3000]}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        return await self._call_api(messages, max_tokens=250)

    async def generate_signal(self, symbol: str, kline_data: list, market_context: str) -> dict:
        """Generate a trading signal based on price data and context."""
        system_prompt = "You are a crypto trading signal generator. Analyze the price data and market context. Output ONLY valid JSON with keys: signal (BUY/WATCH/EXIT/HIGH_RISK), confidence (0-100), reasoning (max 2 sentences), timeframe (short/medium/long)."
        
        user_prompt = f"Symbol: {symbol}\nMarket Context: {market_context}\nKline Data: {json.dumps(kline_data)[:3000]}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        fallback = {
            "signal": "WATCH",
            "confidence": 50,
            "reasoning": "Insufficient data",
            "timeframe": "short"
        }
        
        response_text = await self._call_api(messages, max_tokens=200)
        
        if not response_text:
            return fallback
            
        # Try to parse the JSON output from the AI
        try:
            clean_text = response_text.strip()
            # Often LLMs wrap JSON in markdown block like ```json ... ```
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.startswith("```"):
                clean_text = clean_text[3:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
                
            result = json.loads(clean_text.strip())
            
            # Ensure required keys exist
            for key in ["signal", "confidence", "reasoning", "timeframe"]:
                if key not in result:
                    return fallback
            return result
        except json.JSONDecodeError as e:
            print(f"Failed to parse AI response as JSON: {response_text}")
            return fallback

    async def generate_tweet_thread(self, narrative: str, top_movers: list) -> list[str]:
        """Generate a 3-tweet thread based on narrative and top movers."""
        system_prompt = "You are a crypto Twitter analyst. Write a 3-tweet thread about this market narrative. Each tweet max 240 chars. Make it engaging and informative, not shilly. Start tweet 1 with a hook."
        user_prompt = f"Narrative Context:\n{narrative}\n\nTop Movers:\n{json.dumps(top_movers)[:1000]}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        response_text = await self._call_api(messages, max_tokens=350)
        
        if not response_text:
            return []
            
        # Split by double newline to separate tweets
        tweets = [t.strip() for t in response_text.split("\n\n") if t.strip()]
        
        if len(tweets) > 3:
            tweets = tweets[:3]
            
        return tweets

    async def explain_like_im_dumb(self, topic: str) -> str:
        """Explain a complex crypto topic simply."""
        system_prompt = "You are a crypto educator. Explain the following in simple terms a 16-year-old could understand. Use an analogy. Max 100 words."
        user_prompt = f"Explain this topic: {topic}"
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        return await self._call_api(messages, max_tokens=150)

if __name__ == "__main__":
    async def run_test():
        print("Testing HermesService...")
        service = HermesService()
        
        # Will likely fail with authentication error if NOUS_API_KEY is not set
        print("\n--- Testing 'explain_like_im_dumb' ---")
        explanation = await service.explain_like_im_dumb("Zero-knowledge proofs")
        print(f"Explanation: {explanation}")
        
    asyncio.run(run_test())
