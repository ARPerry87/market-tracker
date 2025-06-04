import React from "react";
import LiveQuote from "./LiveQuote";

const symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"]; // ✅ Add more symbols here

export default function LiveQuotes() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {symbols.map((symbol) => (
        <LiveQuote key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}
