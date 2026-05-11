# NarrativeOS — Backend

AI-powered crypto market narrative engine. Fetches live market data from **SoDEX**, analyzes trends with **Nous Hermes AI**, and surfaces actionable signals.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables

Copy the example env file from the project root and fill in your key:

```bash
cp ../.env.example ../.env
```

| Variable | Required | Description |
|---|---|---|
| `NOUS_API_KEY` | ✅ Yes | Your Nous Research API key from [nousresearch.com](https://nousresearch.com) |
| `SODEX_TESTNET_SPOT` | No | SoDEX testnet spot base URL (default provided) |
| `SODEX_TESTNET_PERPS` | No | SoDEX testnet perps base URL (default provided) |
| `SODEX_MAINNET_SPOT` | No | SoDEX mainnet spot base URL (default provided) |
| `SODEX_MAINNET_PERPS` | No | SoDEX mainnet perps base URL (default provided) |

### 3. Run the Server

```bash
# Option A: Direct
python main.py

# Option B: Uvicorn with auto-reload
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### 4. Test the Pipeline

Run all backend tests without needing the frontend:

```bash
python test_pipeline.py
```

This tests: SoDEX connectivity → ticker fetch → top movers → Hermes AI narrative → full agent pipeline.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check + timestamp |
| `GET` | `/api/analysis` | Full AI market analysis (cached 5 min) |
| `GET` | `/api/signal/{symbol}` | Quick signal for a single symbol |
| `GET` | `/api/markets` | All available SoDEX markets |
| `GET` | `/api/tickers` | All ticker data (price, volume, change%) |
| `POST` | `/api/explain` | AI explanation of a crypto topic |

### POST /api/explain body

```json
{
  "topic": "What are zero-knowledge proofs?"
}
```

## SoDEX Testnet vs Mainnet

By default, **all SoDEX calls use testnet** so you can develop and test without risking real funds.

- **Testnet Spot**: `https://testnet-gw.sodex.dev/api/v1/spot`
- **Testnet Perps**: `https://testnet-gw.sodex.dev/api/v1/perps`
- **Mainnet Spot**: `https://mainnet-gw.sodex.dev/api/v1/spot`
- **Mainnet Perps**: `https://mainnet-gw.sodex.dev/api/v1/perps`

To switch to mainnet, pass `use_testnet=False` to any SoDEXService method.

## Architecture

```
NarrativeAgent (orchestrator)
├── SoDEXService     → Market data (tickers, klines, trades)
└── HermesService    → AI analysis (Nous Hermes-4-70B)
```

The `NarrativeAgent` coordinates both services into a single `run_full_analysis()` pipeline that produces narratives, signals, and tweet threads.
