"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import MapComponent from "../../components/MapComponent";
import { Loader2, MapPin, Filter, Trash2, Recycle } from "lucide-react";

interface Bin {
  _id: string;
  binId: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    area: string;
  };
  fillLevel: number;
  wasteType: string;
  status: string;
}

export default function MapPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLevel, setFilterLevel] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBins();
    }
  }, [isAuthenticated]);

  const fetchBins = async () => {
    try {
      const response = await axios.get("/api/bins");
      setBins(response.data.bins);
    } catch (error) {
      console.error("Error fetching bins:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBins = bins.filter((bin) => {
    const matchesStatus = !filterStatus || bin.status === filterStatus;
    let matchesLevel = true;
    if (filterLevel === "full") matchesLevel = bin.fillLevel >= 80;
    else if (filterLevel === "half")
      matchesLevel = bin.fillLevel >= 40 && bin.fillLevel < 80;
    else if (filterLevel === "empty") matchesLevel = bin.fillLevel < 40;
    return matchesStatus && matchesLevel;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto" />
          <p className="text-slate-400 text-sm font-medium">Loading bins…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const statCards = [
    {
      label: "Total Visible",
      value: filteredBins.length,
      color: "text-slate-800",
      bg: "from-slate-50 to-white",
      icon: <Trash2 className="h-5 w-5 text-slate-400" />,
    },
    {
      label: "Empty",
      value: filteredBins.filter((b) => b.fillLevel < 40).length,
      color: "text-emerald-600",
      bg: "from-emerald-50 to-white",
      icon: <Recycle className="h-5 w-5 text-emerald-400" />,
    },
    {
      label: "Half Full",
      value: filteredBins.filter(
        (b) => b.fillLevel >= 40 && b.fillLevel < 80
      ).length,
      color: "text-amber-600",
      bg: "from-amber-50 to-white",
      icon: <Trash2 className="h-5 w-5 text-amber-400" />,
    },
    {
      label: "Full",
      value: filteredBins.filter((b) => b.fillLevel >= 80).length,
      color: "text-red-600",
      bg: "from-red-50 to-white",
      icon: <Trash2 className="h-5 w-5 text-red-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <MapPin className="h-6 w-6 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Map View
            </h1>
          </div>
          <p className="text-slate-500 ml-14">
            Visualize all bin locations, fill levels {"&"} statuses at a glance.
          </p>
        </div>

        {/* Filters + Legend bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Filter className="h-4 w-4" />
                Filters
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
              >
                <option value="">All Levels</option>
                <option value="full">Full (≥80%)</option>
                <option value="half">Half (40–79%)</option>
                <option value="empty">Empty (&lt;40%)</option>
              </select>

              {(filterStatus || filterLevel) && (
                <button
                  onClick={() => {
                    setFilterStatus("");
                    setFilterLevel("");
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 text-sm">
              <span className="font-semibold text-slate-600">Legend</span>
              {[
                { color: "bg-emerald-500", label: "Empty" },
                { color: "bg-amber-500", label: "Half" },
                { color: "bg-red-500", label: "Full" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span
                    className={`w-3 h-3 rounded-full ${item.color} ring-2 ring-white shadow-sm`}
                  />
                  <span className="text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="h-[620px]">
            {filteredBins.length > 0 ? (
              <MapComponent bins={filteredBins} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <MapPin className="h-10 w-10 opacity-50" />
                </div>
                <p className="text-lg font-semibold text-slate-500">
                  No bins to display
                </p>
                <p className="text-sm mt-1">
                  Try adjusting your filters or add new bins
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`bg-gradient-to-br ${card.bg} rounded-2xl shadow-sm border border-slate-200/60 p-5 text-center transition-transform hover:scale-[1.02]`}
            >
              <div className="flex justify-center mb-2">{card.icon}</div>
              <p className={`text-3xl font-extrabold ${card.color}`}>
                {card.value}
              </p>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}