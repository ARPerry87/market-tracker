import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { fetchCompanyProfile } from "../api/finnhub";
import StockModal from "./StockModal";

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

  const openPrice = data[0]?.price ?? null;

  async function handleChartClick(e) {
    if (!e || !e.activePayload || !e.activePayload[0]) return;
    const point = e.activePayload[0].payload;

    try {
      const company = await fetchCompanyProfile(symbol);
      const priceChange = point.price - openPrice;
      const percentChange = ((priceChange / openPrice) * 100).toFixed(2);

      setModalInfo({
        company,
        time: point.time,
        price: point.price,
        openPrice,
        priceChange,
        percentChange
      });

      setModalOpen(true);
    } catch (err) {
      console.error("Failed to load company profile", err);
    }
  }

  return (
    <>
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
