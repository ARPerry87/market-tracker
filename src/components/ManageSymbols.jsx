import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ManageSymbols({ symbols, setSymbols }) {
  const [input, setInput] = useState("");

  function addSymbol(e) {
    e.preventDefault();
    const clean = input.trim().toUpperCase();
    if (clean && !symbols.includes(clean)) {
      setSymbols([...symbols, clean]);
      setInput("");
    }
  }

  function removeSymbol(symbolToRemove) {
    setSymbols(symbols.filter(s => s !== symbolToRemove));
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <Link to="/" className="text-yellow-400 underline text-sm">← Back to Dashboard</Link>
      <h1 className="text-2xl font-bold mt-2 mb-4 text-white">Manage Ticker Symbols</h1>

      <form onSubmit={addSymbol} className="flex space-x-2 mb-4">
        <input
          className="p-2 rounded bg-gray-700 text-white"
          placeholder="Enter symbol (e.g., NFLX)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-green-500 px-4 rounded text-white hover:bg-green-600">
          Add
        </button>
      </form>

      <ul className="text-white space-y-2">
        {symbols.map(symbol => (
          <li key={symbol} className="flex justify-between items-center">
            <span>{symbol}</span>
            <button
              className="text-red-400 hover:text-red-600 text-sm"
              onClick={() => removeSymbol(symbol)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
