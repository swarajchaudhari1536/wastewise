"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface RecyclingPieChartProps {
  data: {
    recyclable: number;
    organic: number;
    general: number;
    hazardous: number;
  };
}

const COLORS = ["#3b82f6", "#22c55e", "#6b7280", "#ef4444"];

export default function RecyclingPieChart({ data }: RecyclingPieChartProps) {
  const chartData = [
    { name: "Recyclable", value: data.recyclable || 0 },
    { name: "Organic", value: data.organic || 0 },
    { name: "General", value: data.general || 0 },
    { name: "Hazardous", value: data.hazardous || 0 },
  ].filter((item) => item.value > 0);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}