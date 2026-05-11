# 🧠 NarrativeOS

**AI-Powered Crypto Market Narrative Engine**

> Real-time market intelligence that detects narratives, generates trading signals, and creates Twitter-ready content — all powered by AI.

[![Built for Wave Hacks 2025](https://img.shields.io/badge/Wave%20Hacks-2025-00ff88?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iIzBhMGEwYSIvPjx0ZXh0IHg9IjE2IiB5PSIyMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC13ZWlnaHQ9ImJvbGQiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiMwMGZmODgiPk48L3RleHQ+PC9zdmc+)](https://github.com/SuryaXyz-art/NarrativeOS)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)

---

## 🚀 What is NarrativeOS?

NarrativeOS is an **AI-powered crypto intelligence platform** that goes beyond simple price tracking. It detects emerging market narratives, generates actionable trading signals, and produces ready-to-post Twitter threads — all in real time.

### The Problem
Crypto markets move on **narratives** — DeFi summer, L2 season, AI tokens, RWA hype. Traders who spot these narratives early win. But monitoring hundreds of tokens, reading news, and connecting dots manually is impossible.

### The Solution
NarrativeOS automates the entire narrative detection pipeline:

1. **📊 Market Data** → Pulls real-time tickers, top movers, and klines from **SoDEX**
2. **📰 Macro Context** → Enriches analysis with hot news and macro events from **SoSoValue**
3. **🧠 AI Analysis** → Sends everything to **Nous Hermes-4-70B** to detect narratives and generate signals
4. **🐦 Content Generation** → Auto-generates Twitter-ready threads about market trends
5. **💡 Education** → "Explain Like I'm Dumb" feature for any crypto concept

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                  │
│  ┌──────────┐ ┌──────────────┐ ┌────────────┐ ┌─────────────┐  │
│  │  Market   │ │  Narrative   │ │   Signal   │ │    Tweet    │  │
│  │  Ticker   │ │   Summary    │ │    Card    │ │   Thread    │  │
│  │   Bar     │ │  (Typewriter)│ │ (BUY/SELL) │ │  Generator  │  │
│  └──────────┘ └──────────────┘ └────────────┘ └─────────────┘  │
│  ┌──────────┐ ┌──────────────┐ ┌────────────────────────────┐  │
│  │   Top    │ │   Explain    │ │     Market Stats Panel     │  │
│  │  Movers  │ │     Box      │ │   (Live Refresh Counter)   │  │
│  └──────────┘ └──────────────┘ └────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────┴────────────────────────────────────────┐
│                    BACKEND (FastAPI + Python)                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              NarrativeAgent (Orchestrator)                │   │
│  │  Coordinates all services into a unified analysis pipeline│   │
│  └────────┬──────────────┬──────────────────┬───────────────┘   │
│           │              │                  │                    │
│  ┌────────▼──────┐ ┌─────▼────────┐ ┌──────▼─────────┐         │
│  │  SoDEXService │ │HermesService │ │SoSoValueService│         │
│  │  (Market Data)│ │ (Nous AI)    │ │ (Macro/News)   │         │
│  └───────────────┘ └──────────────┘ └────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
         │                    │                  │
    SoDEX API          Nous Research       SoSoValue API
  (Spot + Perps)      Hermes-4-70B        (News + Macro + ETF)
```

---

## ⚡ Features

| Feature | Description |
|---|---|
| **Narrative Detection** | AI identifies top 3 trending narratives from market data |
| **Trading Signals** | BUY / WATCH / EXIT / HIGH_RISK signals with confidence scores |
| **Top Movers** | Real-time gainers & losers with click-to-analyze |
| **Tweet Generator** | Auto-generated 3-tweet threads about market trends |
| **Explain Like I'm Dumb** | AI explains any crypto concept in simple terms |
| **Live Market Ticker** | Scrolling ticker bar with real-time price data |
| **Macro Context** | Enriched with SoSoValue news and macro event data |
| **Auto-Refresh** | 60s analysis refresh + 30s ticker refresh cycles |
| **Caching** | 5-minute server-side cache to avoid API rate limits |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite + Tailwind CSS | Terminal-style dashboard UI |
| **Backend** | Python + FastAPI + Uvicorn | REST API + orchestration |
| **AI Engine** | Nous Research Hermes-4-70B | Narrative analysis & signal generation |
| **Market Data** | SoDEX API (Spot + Perps) | Real-time tickers, klines, trades |
| **Macro Data** | SoSoValue API | Hot news, macro events, ETF data |
| **Deployment** | Netlify (frontend) | Static hosting with SPA routing |

---

## 📦 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- API keys for [Nous Research](https://nousresearch.com) and [SoSoValue](https://sosovalue.com)

### 1. Clone the repo

```bash
git clone https://github.com/SuryaXyz-art/NarrativeOS.git
cd NarrativeOS
```

### 2. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your API keys
```

| Variable | Required | Description |
|---|---|---|
| `NOUS_API_KEY` | ✅ Yes | Nous Research API key for Hermes-4-70B |
| `SOSOVALUE_API_KEY` | ✅ Yes | SoSoValue API key for macro/news data |
| `SODEX_*` | ❌ No | SoDEX URLs (defaults provided) |

### 3. Start the backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000`. Verify with:
```bash
curl http://localhost:8000/health
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 5. Run tests

```bash
cd backend
python test_pipeline.py        # Full pipeline test
python test_integrations.py    # SoSoValue + Hermes integration test
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check + timestamp |
| `GET` | `/api/analysis` | Full AI market analysis (cached 5 min) |
| `GET` | `/api/signal/{symbol}` | Quick signal for a single symbol |
| `GET` | `/api/markets` | All available SoDEX markets |
| `GET` | `/api/tickers` | All ticker data (price, volume, change%) |
| `GET` | `/api/news` | Hot crypto news from SoSoValue |
| `GET` | `/api/macro` | Macro economic events from SoSoValue |
| `GET` | `/api/etf/{type}` | ETF data from SoSoValue (btc/eth) |
| `POST` | `/api/explain` | AI explanation of a crypto topic |

### Example: POST /api/explain

```json
{
  "topic": "What are zero-knowledge proofs?"
}
```

---

## 🧪 Testing

### Backend Pipeline Test
```bash
cd backend
python test_pipeline.py
```

Tests the full pipeline:
1. SoDEX connection + ticker fetch
2. Top movers calculation
3. Hermes AI narrative generation
4. Full agent orchestration (tickers → AI → signals → tweets)

### Integration Test
```bash
cd backend
python test_integrations.py
```

Tests individual service integrations:
1. SoSoValue hot news endpoint
2. SoSoValue macro events endpoint
3. Nous Hermes AI explanation

### Frontend Build
```bash
cd frontend
npm run build
```

---

## 📁 Project Structure

```
NarrativeOS/
├── backend/
│   ├── agents/
│   │   ├── narrative_agent.py    # Main orchestrator
│   │   └── signal_agent.py       # Signal generation (reserved)
│   ├── services/
│   │   ├── sodex_service.py      # SoDEX market data
│   │   ├── hermes_service.py     # Nous Hermes AI
│   │   └── sosovalue_service.py  # SoSoValue macro/news
│   ├── main.py                   # FastAPI server
│   ├── test_pipeline.py          # Full pipeline test
│   ├── test_integrations.py      # Service integration tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── MarketTicker.jsx
│   │   │   ├── NarrativeSummary.jsx
│   │   │   ├── SignalCard.jsx
│   │   │   ├── TopMovers.jsx
│   │   │   ├── TweetThread.jsx
│   │   │   ├── ExplainBox.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── netlify.toml
├── .env.example
├── .gitignore
└── README.md                     # ← You are here
```

---

## 🏆 Hackathon Submission

**Event:** Wave Hacks 2025

**Tracks:**
- AI / Machine Learning
- DeFi / Trading Tools

**What makes NarrativeOS unique:**
1. **Multi-source intelligence** — Combines SoDEX market data + SoSoValue macro context + Nous AI analysis
2. **Narrative-first approach** — Doesn't just track prices; identifies the *stories* driving markets
3. **Actionable output** — Signals, tweets, and explanations — not just raw data
4. **Production-ready architecture** — Caching, error handling, graceful fallbacks, auto-refresh

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built with 🧠 by <a href="https://github.com/SuryaXyz-art">SuryaXyz-art</a></strong><br/>
  <sub>Powered by SoDEX • Nous Research Hermes-4-70B • SoSoValue</sub>
</p>
