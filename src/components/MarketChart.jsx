import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { fetchCompanyProfile, fetchQuote } from "../api/finnhub";
import StockModal from "./StockModal";

// Static mock chart data
const mockData = [
  { time: "9:30", price: 189.3 },
  { time: "10:00", price: 190.2 },
  { time: "10:30", price: 188.7 },
  { time: "11:00", price: 191.1 },
  { time: "11:30", price: 192.4 },
  { time: "12:00", price: 190.8 },
  { time: "12:30", price: 189.5 },
  { time: "1:00", price: 191.9 },
  { time: "1:30", price: 192.1 },
  { time: "2:00", price: 193.0 }
];

export default function MarketChart({ symbol = "AAPL" }) {
  const [data] = useState(mockData);
  const [modalInfo, setModalInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [quote, setQuote] = useState(null);

  const openPrice = data[0]?.price ?? null;

  useEffect(() => {
    async function loadCompanyAndQuote() {
      try {
        const [companyInfo, quoteInfo] = await Promise.all([
          fetchCompanyProfile(symbol),
          fetchQuote(symbol)
        ]);
        setCompany(companyInfo);
        setQuote(quoteInfo);
      } catch (err) {
        console.error("Error loading company/quote:", err);
      }
    }

    loadCompanyAndQuote();
  }, [symbol]);

  const percentChange = quote
    ? (((quote.c - quote.pc) / quote.pc) * 100).toFixed(2)
    : null;

  const changeColor =
    percentChange > 0
      ? "text-green-400"
      : percentChange < 0
      ? "text-red-400"
      : "text-gray-300";

  async function handleChartClick(e) {
    if (!e || !e.activePayload || !e.activePayload[0]) return;
    const point = e.activePayload[0].payload;

    try {
      const priceChange = point.price - openPrice;
      const pointPercentChange = ((priceChange / openPrice) * 100).toFixed(2);

      setModalInfo({
        company,
        time: point.time,
        price: point.price,
        openPrice,
        priceChange,
        percentChange: pointPercentChange
      });

      setModalOpen(true);
    } catch (err) {
      console.error("Failed to handle chart click", err);
    }
  }

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {company ? `${company.name} (${company.ticker})` : symbol}
          {percentChange && (
            <span className={`text-sm font-semibold ${changeColor}`}>
              {percentChange > 0 ? "+" : ""}
              {percentChange}%
            </span>
          )}
        </h3>
        {company?.exchange && (
          <p className="text-sm text-gray-400">
            {company.exchange} - {company.finnhubIndustry}
          </p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} onClick={handleChartClick}>
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#82ca9d" dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <StockModal open={modalOpen} onClose={() => setModalOpen(false)} info={modalInfo} />
    </>
  );
}
