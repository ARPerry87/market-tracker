const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

// Get the latest quote for a stock
export async function fetchQuote(symbol) {
  const res = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch stock quote");
  return await res.json();
}

// Get recent 1-hour candle data for charting
export async function fetchIntradayData(symbol) {
  const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
  const BASE_URL = "https://finnhub.io/api/v1";

  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - 60 * 60 * 24 * 30;

  const url = `${BASE_URL}/stock/candle?symbol=${symbol}&resolution=D&from=${thirtyDaysAgo}&to=${now}&token=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.s !== "ok") throw new Error("Failed to fetch chart data");

  return data.t.map((timestamp, i) => ({
    time: new Date(timestamp * 1000).toLocaleDateString(),
    price: data.c[i],
  }));
}
