import os
import re
import httpx
from dotenv import load_dotenv
import json

load_dotenv()

NOUS_API_KEY = os.getenv("NOUS_API_KEY", "")
NOUS_BASE_URL = "https://inference-api.nousresearch.com/v1"
NOUS_MODEL = "nousresearch/hermes-4-70b"

async def call_hermes(system_prompt: str, user_prompt: str, max_tokens: int = 1000) -> str:
    """Call Nous Hermes AI. Returns text or fallback string on any error."""
    if not NOUS_API_KEY:
        return "AI service unavailable: missing API key."
    
    headers = {
        "Authorization": f"Bearer {NOUS_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": NOUS_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.7
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{NOUS_BASE_URL}/chat/completions",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        print(f"Hermes API HTTP error: {e.response.status_code} - {e.response.text}")
        return f"AI service error: {e.response.status_code}"
    except Exception as e:
        print(f"Hermes API error: {e}")
        return "AI analysis temporarily unavailable."

async def generate_narrative(market_data) -> dict | str:
    system_prompt = "You are a crypto market analyst. Identify top trending narratives based on market data."
    user_prompt = f"Here is the market data:\n{json.dumps(market_data)[:3000]}"
    
    result = await call_hermes(system_prompt, user_prompt, max_tokens=250)
    
    if result.startswith("AI service") or result.startswith("AI analysis"):
        return {"narratives": ["Market analysis temporarily unavailable."]}
    
    return result

async def generate_signal(symbol: str, kline_data: list, market_context: str) -> dict:
    fallback = {"signal": "WATCH", "confidence": 50, "reasoning": "Signal unavailable.", "timeframe": "short", "symbol": symbol}
    system_prompt = (
        "You are a crypto trading analyst. Based on the candlestick data and market context, "
        "respond with ONLY a JSON object and nothing else: "
        '{"signal": "BUY|WATCH|EXIT|HIGH_RISK", "confidence": <0-100 int>, '
        '"reasoning": "<one concise sentence>", "timeframe": "short|medium|long"}'
    )
    user_prompt = f"Symbol: {symbol}\nMarket context: {market_context[:800]}\nRecent klines: {json.dumps(kline_data)[:1500]}"

    result = await call_hermes(system_prompt, user_prompt, max_tokens=200)
    if result.startswith("AI service") or result.startswith("AI analysis"):
        return fallback

    try:
        match = re.search(r"\{.*\}", result, re.DOTALL)
        data = json.loads(match.group(0)) if match else {}
        signal = str(data.get("signal", "WATCH")).upper()
        if signal not in ("BUY", "WATCH", "EXIT", "HIGH_RISK"):
            signal = "WATCH"
        return {
            "signal": signal,
            "confidence": max(0, min(100, int(data.get("confidence", 50)))),
            "reasoning": str(data.get("reasoning", "No reasoning provided.")),
            "timeframe": data.get("timeframe", "short"),
            "symbol": symbol,
        }
    except Exception as e:
        print(f"Signal parse error: {e}")
        return fallback

async def generate_tweet_thread(narrative: str, top_movers: list) -> list[str]:
    system_prompt = "You are a crypto Twitter analyst. Generate exactly 3 tweets about this market narrative separated by '---'. Each tweet max 240 chars."
    user_prompt = f"Narrative:\n{narrative}\n\nTop Movers:\n{json.dumps(top_movers)[:1000]}"
    
    result = await call_hermes(system_prompt, user_prompt, max_tokens=350)
    
    if result.startswith("AI service") or result.startswith("AI analysis"):
        return ["Tweet generation temporarily unavailable."]
    
    tweets = [t.strip() for t in result.split("---") if t.strip()]
    if not tweets:
        return ["Tweet generation temporarily unavailable."]
    return tweets[:3]

async def explain_topic(topic: str) -> str:
    system_prompt = "You are a crypto educator. Explain crypto concepts simply."
    user_prompt = f"Explain this topic: {topic}"
    
    result = await call_hermes(system_prompt, user_prompt, max_tokens=150)
    
    if result.startswith("AI service") or result.startswith("AI analysis"):
        return "Explanation currently unavailable. Please try again."
    
    return result
