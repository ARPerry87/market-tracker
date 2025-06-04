import React from "react";
import { useParams, Link } from "react-router-dom";
import MarketChart from "./MarketChart";

export default function StockDetail() {
  const { symbol } = useParams();

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <Link to="/" className="text-yellow-400 underline text-sm">
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mt-2 mb-4">{symbol} Full Chart</h1>
      <MarketChart symbol={symbol} />
    </div>
  );
}
