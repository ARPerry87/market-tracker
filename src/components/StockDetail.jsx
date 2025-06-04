import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const timeRanges = ["1D", "1W", "1M", "YTD"];

// Mock data to simulate each range
const mockData = {
  "1D": [
    { time: "9:30", price: 189 },
    { time: "12:00", price: 192 },
    { time: "2:00", price: 193 }
  ],
  "1W": [
    { time: "Mon", price: 180 },
    { time: "Tue", price: 182 },
    { time: "Wed", price: 185 },
    { time: "Thu", price: 188 },
    { time: "Fri", price: 193 }
  ],
  "1M": [
    { time: "Week 1", price: 170 },
    { time: "Week 2", price: 175 },
    { time: "Week 3", price: 183 },
    { time: "Week 4", price: 193 }
  ],
  "YTD": [
    { time: "Jan", price: 160 },
    { time: "Mar", price: 175 },
    { time: "May", price: 193 }
  ]
};

export default function StockDetail() {
  const { symbol } = useParams();
  const [range, setRange] = useState("1D");

  const chartData = mockData[range];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <Link to="/" className="text-yellow-400 underline text-sm mb-4 inline-block">
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-white mb-4">{symbol} Chart</h1>

      {/* Range Toggle */}
      <div className="flex space-x-4 mb-6">
        {timeRanges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded text-sm ${
              range === r ? "bg-yellow-400 text-black font-semibold" : "bg-gray-700 text-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#82ca9d" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
