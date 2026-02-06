"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AreaBarChartProps {
  data: Array<{
    _id: string;
    totalBins: number;
    avgFillLevel: number;
  }>;
}

export default function AreaBarChart({ data }: AreaBarChartProps) {
  const formattedData = data.map((item) => ({
    area: item._id,
    bins: item.totalBins,
    fillLevel: Math.round(item.avgFillLevel),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="area" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <Bar
          dataKey="fillLevel"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          name="Avg Fill Level (%)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}