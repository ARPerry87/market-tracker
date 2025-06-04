import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { time: '9:30', AAPL: 189.3, TSLA: 724.1 },
  { time: '10:00', AAPL: 188.9, TSLA: 728.5 },
  { time: '10:30', AAPL: 189.8, TSLA: 723.9 },
  { time: '11:00', AAPL: 190.0, TSLA: 720.2 },
];

export default function MarketChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="AAPL" stroke="#8884d8" />
        <Line type="monotone" dataKey="TSLA" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
