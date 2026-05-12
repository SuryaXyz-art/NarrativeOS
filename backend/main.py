from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import uvicorn

from agents.narrative_agent import NarrativeAgent
from services.sodex_service import SoDEXService
from services.hermes_service import HermesService
from services.sosovalue_service import SoSoValueService

agent = None
sodex_service = None
hermes_service = None
sosovalue_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent, sodex_service, hermes_service, sosovalue_service
    agent = NarrativeAgent()
    sodex_service = SoDEXService()
    hermes_service = HermesService()
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
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExplainRequest(BaseModel):
    topic: str

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "NarrativeOS",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/api/analysis", response_model=None)
async def get_analysis():
    try:
        return await agent.run_full_analysis()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/signal/{symbol}")
async def get_signal(symbol: str):
    try:
        return await agent.get_quick_signal(symbol)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/markets")
async def get_markets():
    try:
        return await sodex_service.get_all_markets()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tickers")
async def get_tickers():
    try:
        return await sodex_service.get_ticker_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/news")
async def get_news():
    """Fetch hot crypto news from SoSoValue."""
    try:
        return await sosovalue_service.get_hot_news()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/macro")
async def get_macro_events():
    """Fetch macro economic events from SoSoValue."""
    try:
        return await sosovalue_service.get_macro_events()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/etf/{etf_type}")
async def get_etf_data(etf_type: str = "btc"):
    """Fetch ETF data from SoSoValue."""
    try:
        return await sosovalue_service.get_etf_data(etf_type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/explain")
async def explain_topic(req: ExplainRequest):
    try:
        explanation = await hermes_service.explain_like_im_dumb(req.topic)
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
