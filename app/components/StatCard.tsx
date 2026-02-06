import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  color?: "emerald" | "blue" | "amber" | "red" | "purple";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  color = "emerald",
}: StatCardProps) {
  const colorClasses = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };

  const changeColorClasses = {
    positive: "text-emerald-600 bg-emerald-100",
    negative: "text-red-600 bg-red-100",
    neutral: "text-gray-600 bg-gray-100",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <span
              className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${changeColorClasses[changeType]}`}
            >
              {change}
            </span>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}