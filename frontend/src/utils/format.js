// SoDEX testnet symbols look like "vBTC_vUSDC" / "WSOSO_vUSDC".
// Prettify to "BTC/USDC" for display. Falls back to the raw value.
export const prettySymbol = (s) => {
  if (!s || typeof s !== 'string') return s || '???';
  return s
    .split('_')
    .map((p) => p.replace(/^v/, ''))
    .join('/');
};
