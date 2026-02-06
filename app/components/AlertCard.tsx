"use client";

import React from "react";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";

interface AlertCardProps {
  id: string;
  binCode: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "active" | "acknowledged" | "resolved";
  createdAt: string;
  onAcknowledge?: (id: string) => void;
  onResolve?: (id: string) => void;
}

export default function AlertCard({
  id,
  binCode,
  message,
  priority,
  status,
  createdAt,
  onAcknowledge,
  onResolve,
}: AlertCardProps) {
  const priorityColors = {
    low: "border-gray-300 bg-gray-50",
    medium: "border-amber-300 bg-amber-50",
    high: "border-orange-400 bg-orange-50",
    critical: "border-red-400 bg-red-50",
  };

  const priorityBadgeColors = {
    low: "bg-gray-200 text-gray-700",
    medium: "bg-amber-200 text-amber-700",
    high: "bg-orange-200 text-orange-700",
    critical: "bg-red-200 text-red-700",
  };

  const statusIcons = {
    active: AlertTriangle,
    acknowledged: Clock,
    resolved: CheckCircle,
  };

  const StatusIcon = statusIcons[status];

  return (
    <div
      className={`rounded-lg border-l-4 p-4 ${priorityColors[priority]} transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <StatusIcon
            className={`h-5 w-5 mt-0.5 ${
              status === "resolved"
                ? "text-emerald-500"
                : status === "acknowledged"
                ? "text-amber-500"
                : "text-red-500"
            }`}
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{binCode}</span>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityBadgeColors[priority]}`}
              >
                {priority.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {status === "active" && (
          <div className="flex space-x-2">
            <button
              onClick={() => onAcknowledge?.(id)}
              className="px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
            >
              Acknowledge
            </button>
            <button
              onClick={() => onResolve?.(id)}
              className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              Resolve
            </button>
          </div>
        )}

        {status === "acknowledged" && (
          <button
            onClick={() => onResolve?.(id)}
            className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
          >
            Resolve
          </button>
        )}
      </div>
    </div>
  );
}