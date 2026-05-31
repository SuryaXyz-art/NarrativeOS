# NarrativeOS

**An agentic crypto intelligence desk — from market data to actionable decisions, in real time.**

NarrativeOS fuses live market data, macro context, and AI reasoning into a single autonomous workflow. It detects the *narratives* moving the market, scores trading signals, drafts publishable commentary, and turns every insight into a risk-managed, reviewable trade plan — the output of an entire research team, run by one agent.

<p align="center">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

> Built for the **SoSoValue Agentic Finance Hackathon**.

---

## Why NarrativeOS

Crypto trades on **narratives** — DeFi summer, L2 season, AI tokens, RWA, ETF flows. Spotting them early means monitoring hundreds of tickers, reading endless news, and connecting macro dots in real time. No individual can do that by hand.

NarrativeOS automates the entire loop: **Ingest → Analyze → Signal → Act**.

| Stage | What happens |
|---|---|
| **Ingest** | Live tickers, top movers & klines from **SoDEX**; hot news, macro events & spot-ETF flows from **SoSoValue**. |
| **Analyze** | **Nous Hermes-4-70B** reads the combined market + macro context and detects the dominant narratives. |
| **Signal** | Per-asset `BUY` / `WATCH` / `EXIT` / `HIGH_RISK` calls with a confidence score and one-line rationale, derived from real candles. |
| **Act** | Risk-managed trade plans (entry, stop, target, position size) behind a confirmation gate, plus copy-ready tweet threads and plain-English explanations. |

---

## Features

| Feature | Description |
|---|---|
| **Narrative Detection** | AI surfaces the stories driving the market, not just prices. |
| **Trading Signals** | Confidence-scored `BUY/WATCH/EXIT/HIGH_RISK` with transparent reasoning. |
| **Trade Plans** | Risk-sized entry/stop/target with R:R and a confirmation gate — **non-custodial**, no order is placed. |
| **Market Pulse** | Real-time breadth gauge: advancers vs decliners, average change, sentiment. |
| **Market Intel** | SoSoValue hot news + macro event calendar in one feed. |
| **ETF Net Flows** | Daily BTC & ETH spot-ETF inflows from SoSoValue. |
| **24h Sparkline** | Inline price trend on the featured signal, drawn from real klines. |
| **Tweet Threads** | Auto-generated, copy-ready market commentary. |
| **Explain Mode** | "Explain like I'm dumb" for any crypto concept. |
| **Live Terminal** | Auto-refreshing dashboard (60s analysis / 30s tickers) with graceful fallbacks. |

---

## Architecture

```
┌────────────────────────── Frontend (React 19 + Vite + Tailwind) ──────────────────────────┐
│  Project Showcase (scrollable) → Live Terminal:                                            │
│  MarketTicker · MarketPulse · TopMovers · ETFPanel · NarrativeSummary · SignalCard         │
│  (+ TradePlanModal) · TweetThread · NewsFeed · ExplainBox                                  │
└───────────────────────────────────────────┬────────────────────────────────────────────────┘
                                             │ REST
┌───────────────────────────────────────────┴──────────────── Backend (FastAPI) ───────────┐
│                              NarrativeAgent (orchestrator + 5-min cache)                   │
│   ┌────────────────┐        ┌────────────────┐        ┌──────────────────────────────┐     │
│   │  SoDEXService  │        │ hermes_service │        │      SoSoValueService        │     │
│   │ tickers/klines │        │  Nous Hermes   │        │  news / macro / ETF flows    │     │
│   └────────────────┘        └────────────────┘        └──────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────────────────────┘
        SoDEX REST v1                Nous Inference API              SoSoValue OpenAPI v1
```

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- API keys: **SoSoValue** and **Nous Research** (SoDEX market data needs no key)

### 1. Configure environment
```bash
cp .env.example .env
```
| Variable | Required | Description |
|---|---|---|
| `SOSOVALUE_API_KEY` | ✅ | SoSoValue key — get it at https://sosovalue.com/developer/dashboard |
| `NOUS_API_KEY` | ✅ | Nous Research key for Hermes-4-70B |
| `SODEX_*` | ❌ | SoDEX REST URLs (working defaults provided) |

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
python main.py          # http://localhost:8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check + timestamp |
| `GET` | `/api/analysis` | Full AI analysis (narratives, signals, movers, pulse, tweets, news, macro) — cached 5 min |
| `GET` | `/api/signal/{symbol}` | Quick AI signal for one symbol |
| `GET` | `/api/tickers` | All SoDEX tickers |
| `GET` | `/api/markets` | All SoDEX trading symbols |
| `GET` | `/api/news` | SoSoValue hot news |
| `GET` | `/api/macro` | SoSoValue macro events |
| `GET` | `/api/etf/{type}` | SoSoValue spot-ETF flows (`btc` / `eth`) |
| `POST` | `/api/explain` | AI explanation of a crypto topic — body: `{ "topic": "..." }` |

---

## Integrations

### SoSoValue — `https://openapi.sosovalue.com/openapi/v1` (header `x-soso-api-key`)
| Method | Endpoint | Used for |
|---|---|---|
| `GET` | `/news/hot` | Hot crypto news feed |
| `GET` | `/macro/events` | Macroeconomic event calendar |
| `GET` | `/etfs/summary-history` | BTC / ETH spot-ETF net flows |

### SoDEX — public REST v1 (`https://testnet-gw.sodex.dev/api/v1/spot`, unsigned reads)
| Method | Endpoint | Used for |
|---|---|---|
| `GET` | `/markets/tickers` | 24h ticker stats (price, change, volume) |
| `GET` | `/markets/symbols` | Trading symbols & rules |
| `GET` | `/markets/{symbol}/klines` | Candlesticks for signals & sparklines |

### Nous Research
`Hermes-4-70B` via the Nous inference API — narrative detection, signal generation, tweet drafting, and explanations.

---

## Testing
```bash
cd backend
python test_integrations.py    # SoSoValue + Nous connectivity
python test_pipeline.py        # Full SoDEX → AI → signal pipeline
```

```bash
cd frontend
npm run build                  # Production build
```

---

## Project Structure
```
NarrativeOS/
├── backend/
│   ├── agents/narrative_agent.py     # Orchestrator + market-pulse + cache
│   ├── services/
│   │   ├── sodex_service.py          # SoDEX market data
│   │   ├── hermes_service.py         # Nous AI: narrative, signal, tweets, explain
│   │   └── sosovalue_service.py      # SoSoValue news / macro / ETF
│   ├── fallback_data.py              # Graceful-degradation defaults
│   ├── main.py                       # FastAPI app
│   └── test_pipeline.py / test_integrations.py
└── frontend/src/
    ├── components/                   # Showcase, terminal panels, TradePlanModal, Sparkline …
    ├── utils/format.js               # Symbol prettifier (vBTC_vUSDC → BTC/USDC)
    └── App.jsx
```

---

## Hackathon Alignment

- ✅ **Genuine SoSoValue integration** — news, macro, and ETF-flow endpoints, live.
- ✅ **Clear use case** — a one-person financial news + signal desk.
- ✅ **Complete flow** — data input → AI insight → actionable, risk-managed output.
- ⭐ **SoDEX integration** — live market data and candlesticks.
- ⭐ **AI-enhanced** — narrative discovery, signals, and market explanations.
- ⭐ **Risk control & confirmation** — confidence scores, `HIGH_RISK` flags, a non-custodial trade-plan confirmation gate, and clear disclaimers.

---

## Resources
- [SoSoValue API Docs](https://sosovalue-1.gitbook.io/sosovalue-api-doc)
- [SoDEX API Docs](https://sodex.com/documentation/api/api)
- [Common Free-Tier APIs](https://www.notion.so/Common-APIs-167b57bd102a4c03b8f2421108fc66eb)

---

## Security
- Never commit real keys. `.env` is git-ignored; `.env.example` ships placeholders only.
- If a key is ever exposed, **rotate it** in the provider dashboard immediately.
- The trade-plan feature is **non-custodial** — it stages a reviewable plan and never holds keys or places orders.

## Disclaimer
NarrativeOS is an analytics tool, **not financial advice**. Signals are AI-generated and may be wrong. Always do your own research and manage risk.

## License
MIT — see [LICENSE](LICENSE).
