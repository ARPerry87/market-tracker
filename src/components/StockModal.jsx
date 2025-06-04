import React from "react";

export default function StockModal({ open, onClose, info }) {
  if (!open || !info) return null;

  const {
    company,
    time,
    price,
    openPrice,
    priceChange,
    percentChange
  } = info;

  const isPositive = priceChange >= 0;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const sign = isPositive ? "+" : "";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg max-w-sm shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">{company?.name || company?.ticker}</h2>
        <p><strong>Price at {time}:</strong> ${price}</p>
        <p><strong>Open Price:</strong> ${openPrice}</p>
        <p className={changeColor}>
          <strong>Change:</strong> {sign}${priceChange.toFixed(2)} ({sign}{percentChange}%)
        </p>
        <p className="mt-4 text-sm text-gray-500">{company?.finnhubIndustry}</p>
      </div>
    </div>
  );
}
