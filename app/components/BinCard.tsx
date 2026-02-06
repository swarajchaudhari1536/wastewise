"use client";

import React from "react";
import { Trash2, MapPin, Clock, Edit, Trash } from "lucide-react";

interface BinCardProps {
  id: string;
  binId: string;
  location: {
    address: string;
    area: string;
  };
  fillLevel: number;
  wasteType: string;
  status: string;
  lastCollected: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function BinCard({
  id,
  binId,
  location,
  fillLevel,
  wasteType,
  status,
  lastCollected,
  onEdit,
  onDelete,
}: BinCardProps) {
  const getFillColor = (level: number) => {
    if (level >= 80) return "bg-red-500";
    if (level >= 50) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "maintenance":
        return "bg-amber-100 text-amber-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getWasteTypeColor = (type: string) => {
    switch (type) {
      case "recyclable":
        return "bg-blue-100 text-blue-700";
      case "organic":
        return "bg-green-100 text-green-700";
      case "hazardous":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-lg ${
              fillLevel >= 80
                ? "bg-red-100"
                : fillLevel >= 50
                ? "bg-amber-100"
                : "bg-emerald-100"
            }`}
          >
            <Trash2
              className={`h-5 w-5 ${
                fillLevel >= 80
                  ? "text-red-600"
                  : fillLevel >= 50
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{binId}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit?.(id)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete?.(id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Fill Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">Fill Level</span>
          <span className="text-sm font-semibold text-gray-900">{fillLevel}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getFillColor(fillLevel)}`}
            style={{ width: `${fillLevel}%` }}
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start space-x-2 mb-3">
        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm text-gray-600">{location.address}</p>
          <p className="text-xs text-gray-400">{location.area}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`text-xs px-2 py-1 rounded-full ${getWasteTypeColor(wasteType)}`}>
          {wasteType}
        </span>
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(lastCollected).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}