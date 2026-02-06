"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import WasteChart from "../../components/charts/WasteChart";
import RecyclingPieChart from "../../components/charts/RecyclingPieChart";
import AreaBarChart from "../../components/charts/AreaBarChart";
import {
  Loader2,
  TrendingUp,
  Recycle,
  Trash2,
  BarChart3,
  Calendar,
} from "lucide-react";

interface Analytics {
  overview: {
    totalBins: number;
    activeBins: number;
    fullBins: number;
    halfBins: number;
    emptyBins: number;
    activeAlerts: number;
    criticalAlerts: number;
  };
  binsByType: Record<string, number>;
  wasteStats: {
    totalCollected: number;
    totalRecyclable: number;
    recyclingRate: number;
  };
  wasteHistory: Array<{
    date: string;
    total: number;
    recyclable: number;
    organic: number;
    general: number;
    hazardous: number;
    recyclingRate: number;
  }>;
  areaStats: Array<{
    _id: string;
    totalBins: number;
    avgFillLevel: number;
  }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics();
    }
  }, [isAuthenticated, period]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/analytics?period=${period}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics & Reports
            </h1>
            <p className="text-gray-500 mt-1">
              Detailed waste management insights
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Collected</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {analytics?.wasteStats.totalCollected || 0}
                  <span className="text-lg font-normal text-gray-500 ml-1">
                    kg
                  </span>
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Recyclables</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {analytics?.wasteStats.totalRecyclable || 0}
                  <span className="text-lg font-normal text-gray-500 ml-1">
                    kg
                  </span>
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Recycle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Recycling Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {analytics?.wasteStats.recyclingRate || 0}
                  <span className="text-lg font-normal text-gray-500 ml-1">
                    %
                  </span>
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Bins</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {analytics?.overview.activeBins || 0}
                  <span className="text-lg font-normal text-gray-500 ml-1">
                    / {analytics?.overview.totalBins || 0}
                  </span>
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Trash2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Waste Collection Trends
            </h2>
            {analytics?.wasteHistory && analytics.wasteHistory.length > 0 ? (
              <WasteChart data={analytics.wasteHistory} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No data available for this period
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Waste Distribution
            </h2>
            {analytics?.binsByType &&
            Object.keys(analytics.binsByType).length > 0 ? (
              <RecyclingPieChart
                data={{
                  recyclable: analytics.binsByType.recyclable || 0,
                  organic: analytics.binsByType.organic || 0,
                  general: analytics.binsByType.general || 0,
                  hazardous: analytics.binsByType.hazardous || 0,
                }}
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No bins configured yet
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Average Fill Level by Area
            </h2>
            {analytics?.areaStats && analytics.areaStats.length > 0 ? (
              <AreaBarChart data={analytics.areaStats} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No area data available
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recycling vs Landfill
            </h2>
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="w-full max-w-md space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Recyclable
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {analytics?.wasteStats.recyclingRate || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${analytics?.wasteStats.recyclingRate || 0}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Landfill
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      {100 - (analytics?.wasteStats.recyclingRate || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-gray-500 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          100 - (analytics?.wasteStats.recyclingRate || 0)
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Goal: Achieve 50% recycling rate by 2025
              </p>
            </div>
          </div>
        </div>

        {/* Area Statistics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Area-wise Statistics
          </h2>
          {analytics?.areaStats && analytics.areaStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Area
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Total Bins
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Avg Fill Level
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.areaStats.map((area, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {area._id}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">
                        {area.totalBins}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`font-medium ${
                            area.avgFillLevel >= 80
                              ? "text-red-600"
                              : area.avgFillLevel >= 50
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {Math.round(area.avgFillLevel)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            area.avgFillLevel >= 80
                              ? "bg-red-100 text-red-700"
                              : area.avgFillLevel >= 50
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {area.avgFillLevel >= 80
                            ? "Critical"
                            : area.avgFillLevel >= 50
                            ? "Moderate"
                            : "Normal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No area statistics available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}