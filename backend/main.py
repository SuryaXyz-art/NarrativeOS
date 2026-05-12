from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import os

from agents.narrative_agent import NarrativeAgent
from services.sodex_service import SoDEXService
from services.sosovalue_service import SoSoValueService
from services.hermes_service import explain_topic

agent = None
sodex_service = None
sosovalue_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent, sodex_service, sosovalue_service
    agent = NarrativeAgent()
    sodex_service = SoDEXService()
    sosovalue_service = SoSoValueService()
    yield

app = FastAPI(
    title="NarrativeOS API",
    description="AI-powered crypto market narrative engine",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://narrativeonchain.netlify.app",
        "http://localhost:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExplainRequest(BaseModel):
    topic: str

@app.get("/")
async def root():
    try:
        return {"status": "NarrativeOS backend running", "version": "1.0"}
    except Exception as e:
        return {"status": "Error", "error": str(e)}

@app.get("/health")
async def health():
    try:
        return {
            "status": "ok",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

@app.get("/api/analysis")
async def get_analysis():
    try:
        return await agent.run_full_analysis()
    except Exception as e:
        print(f"Analysis error: {e}")
        from fallback_data import FALLBACK_ANALYSIS
        return FALLBACK_ANALYSIS

@app.get("/api/signal/{symbol}")
async def get_signal(symbol: str):
    try:
        return await agent.get_quick_signal(symbol)
    except Exception as e:
        print(f"Signal error: {e}")
        return {"signal": "WATCH", "confidence": 50, "reasoning": "Fallback", "timeframe": "short", "symbol": symbol}

@app.get("/api/markets")
async def get_markets():
    try:
        return await sodex_service.get_all_markets()
    except Exception as e:
        print(f"Markets error: {e}")
        return []

@app.get("/api/tickers")
async def get_tickers():
    try:
        return await sodex_service.get_ticker_all()
    except Exception as e:
        print(f"Tickers error: {e}")
        from fallback_data import FALLBACK_TICKERS
        return FALLBACK_TICKERS

@app.get("/api/news")
async def get_news():
    try:
        return await sosovalue_service.get_hot_news()
    except Exception as e:
        print(f"News error: {e}")
        from fallback_data import FALLBACK_NEWS
        return FALLBACK_NEWS

@app.get("/api/macro")
async def get_macro_events():
    try:
        return await sosovalue_service.get_macro_events()
    except Exception as e:
        print(f"Macro error: {e}")
        return []

@app.get("/api/etf/{etf_type}")
async def get_etf_data(etf_type: str = "btc"):
    try:
        return await sosovalue_service.get_etf_data(etf_type)
    except Exception as e:
        print(f"ETF error: {e}")
        return {}

@app.post("/api/explain")
async def explain(request: ExplainRequest):
    try:
        from services.hermes_service import explain_topic
        result = await explain_topic(request.topic)
        return {"explanation": result}
    except Exception as e:
        print(f"Explain error: {e}")
        return {"explanation": "Explanation currently unavailable. Please try again."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
