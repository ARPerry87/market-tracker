import React, { useEffect, useState } from 'react';
import axios from 'axios';

const symbols = ['AAPL', 'TSLA', 'GOOGL', 'AMZN'];

export default function Ticker() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const results = await Promise.all(symbols.map(symbol =>
          axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`)
        ));
        const formatted = results.map((res, idx) => ({
          symbol: symbols[idx],
          price: res.data.c,
        }));
        setPrices(formatted);
      } catch (err) {
        console.error("Error fetching stock prices:", err);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="whitespace-nowrap overflow-hidden">
      <div className="animate-marquee flex space-x-6 text-green-400">
        {prices.map(stock => (
          <span key={stock.symbol}>
            {stock.symbol}: ${stock.price.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}
