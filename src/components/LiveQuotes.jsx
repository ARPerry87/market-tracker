import React from "react";
import { Link } from "react-router-dom";
import LiveQuote from "./LiveQuote";

const symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"]; // ✅ Add more symbols here

export default function LiveQuotes() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {symbols.map((symbol) => (
        <LiveQuote key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}
