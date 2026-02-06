"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WasteChartProps {
  data: Array<{
    date: string;
    total: number;
    recyclable: number;
    organic: number;
    general: number;
  }>;
}

export default function WasteChart({ data }: WasteChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981" }}
          name="Total"
        />
        <Line
          type="monotone"
          dataKey="recyclable"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: "#3b82f6" }}
          name="Recyclable"
        />
        <Line
          type="monotone"
          dataKey="organic"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: "#f59e0b" }}
          name="Organic"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}