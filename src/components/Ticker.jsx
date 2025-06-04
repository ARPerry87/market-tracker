import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Ticker({ symbols, onSelect }) {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    let isMounted = true;

    function fetchPrices() {
      Promise.all(
        symbols.map(symbol =>
          axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`)
        )
      )
        .then(results => {
          if (!isMounted) return;
          const formatted = results.map((res, idx) => ({
            symbol: symbols[idx],
            price: res.data.c,
          }));
          setPrices(formatted);
        })
        .catch(err => {
          if (!isMounted) return;
          console.error("Error fetching stock prices:", err);
        });
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbols]);

  return (
    <div className="whitespace-nowrap overflow-hidden">
      <div className="animate-marquee flex space-x-6 text-green-400 cursor-pointer">
        {prices.map(stock => (
          <span
            key={stock.symbol}
            className="hover:text-yellow-300 transition"
            onClick={() => onSelect(stock.symbol)}
          >
            {stock.symbol}: ${stock.price.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}