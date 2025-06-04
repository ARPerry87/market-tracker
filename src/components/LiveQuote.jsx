import React, { useEffect, useState } from "react";
import { fetchQuote } from "../api/finnhub";
import { useNavigate } from "react-router-dom";

export default function LiveQuote({ symbol }) {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadQuote() {
      try {
        const data = await fetchQuote(symbol);
        if (isMounted) setQuote(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    }

    loadQuote();
    const interval = setInterval(loadQuote, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbol]);

  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!quote) return <div className="text-gray-400">Loading {symbol}...</div>;

  const priceChange = quote.c - quote.pc;
  const percentChange = ((priceChange / quote.pc) * 100).toFixed(2);
  const changeColor = priceChange >= 0 ? "text-green-400" : "text-red-400";

  return (
    <div
      onClick={() => navigate(`/stock/${symbol}`)}
      className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 hover:ring-2 hover:ring-yellow-400 transition cursor-pointer"
    >
      <h2 className="text-lg font-semibold mb-2">{symbol}</h2>
      <p className={`text-xl font-bold ${changeColor}`}>${quote.c.toFixed(2)}</p>
      <p className={`text-sm ${changeColor}`}>
        {priceChange >= 0 ? "+" : ""}
        {priceChange.toFixed(2)} ({percentChange}%)
      </p>
      <div className="text-sm text-gray-300 mt-2">
        <p>Open: ${quote.o}</p>
        <p>High: ${quote.h}</p>
        <p>Low: ${quote.l}</p>
        <p>Prev Close: ${quote.pc}</p>
      </div>
    </div>
  );
}
