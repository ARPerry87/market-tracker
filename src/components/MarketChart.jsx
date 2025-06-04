import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { time: "9:30", AAPL: 189.3, TSLA: 724.1 },
  { time: "10:00", AAPL: 190.2, TSLA: 728.5 },
  { time: "10:30", AAPL: 188.7, TSLA: 720.3 },
  { time: "11:00", AAPL: 191.1, TSLA: 735.9 },
  { time: "11:30", AAPL: 192.4, TSLA: 740.2 },
  { time: "12:00", AAPL: 190.8, TSLA: 732.0 },
  { time: "12:30", AAPL: 189.5, TSLA: 726.7 },
  { time: "1:00",  AAPL: 191.9, TSLA: 738.6 },
  { time: "1:30",  AAPL: 192.1, TSLA: 742.4 },
  { time: "2:00",  AAPL: 193.0, TSLA: 745.8 }
];

export default function MarketChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="AAPL" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="TSLA" stroke="#82ca9d" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
