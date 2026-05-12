FALLBACK_TICKERS = [
  {"symbol": "BTC/USDT", "price": "~", "change": "0.00%", "volume": "N/A"},
  {"symbol": "ETH/USDT", "price": "~", "change": "0.00%", "volume": "N/A"},
  {"symbol": "SOL/USDT", "price": "~", "change": "0.00%", "volume": "N/A"},
]

FALLBACK_NEWS = [
  {"title": "Market data temporarily unavailable", "summary": "Please refresh later."}
]

FALLBACK_MOVERS = {
    "gainers": [
        {"symbol": "BTC/USDT", "price": "65000", "change": "+5.20%"},
        {"symbol": "SOL/USDT", "price": "145.20", "change": "+8.40%"},
        {"symbol": "ETH/USDT", "price": "3400", "change": "+3.10%"}
    ],
    "losers": [
        {"symbol": "DOGE/USDT", "price": "0.15", "change": "-4.20%"},
        {"symbol": "ADA/USDT", "price": "0.45", "change": "-2.10%"}
    ]
}

FALLBACK_ANALYSIS = {
  "narratives": ["Market data loading..."],
  "signals": [],
  "tweets": ["Market analysis loading. Please wait a moment and refresh."],
  "top_movers": FALLBACK_MOVERS,
  "timestamp": None
}
