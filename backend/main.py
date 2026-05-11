from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from datetime import datetime, timezone
import uvicorn

from agents.narrative_agent import NarrativeAgent
from services.sodex_service import SoDEXService
from services.hermes_service import HermesService

agent = None
sodex_service = None
hermes_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent, sodex_service, hermes_service
    agent = NarrativeAgent()
    sodex_service = SoDEXService()
    hermes_service = HermesService()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.post("/api/explain")
async def explain_topic(req: ExplainRequest):
    try:
        explanation = await hermes_service.explain_like_im_dumb(req.topic)
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
