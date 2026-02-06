"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import StatCard from "../../components/StatCard";
import AlertCard from "../../components/AlertCard";
import WasteChart from "../../components/charts/WasteChart";
import RecyclingPieChart from "../../components/charts/RecyclingPieChart";
import {
  Trash2,
  AlertTriangle,
  Recycle,
  TrendingUp,
  RefreshCw,
  Loader2,
  Play,
  RotateCcw,
  ArrowUp,
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
  }>;
}

interface Alert {
  _id: string;
  binCode: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "active" | "acknowledged" | "resolved";
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [analyticsRes, alertsRes] = await Promise.all([
        axios.get("/api/analytics"),
        axios.get("/api/alerts?status=active&limit=5"),
      ]);
      setAnalytics(analyticsRes.data);
      setAlerts(alertsRes.data.alerts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async (mode: string) => {
    setSimulating(true);
    try {
      await axios.post("/api/bins/simulate", { mode });
      await fetchData();
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setSimulating(false);
    }
  };

  const handleAlertAction = async (alertId: string, status: string) => {
    try {
      await axios.put(
        "/api/alerts",
        { alertId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchData();
    } catch (error) {
      console.error("Error updating alert:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Real-time waste monitoring overview
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <button
              onClick={() => runSimulation("random")}
              disabled={simulating}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {simulating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Simulate
            </button>
            <button
              onClick={() => runSimulation("increase")}
              disabled={simulating}
              className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Fill Bins
            </button>
            <button
              onClick={() => runSimulation("reset")}
              disabled={simulating}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            <button
              onClick={fetchData}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bins"
            value={analytics?.overview.totalBins || 0}
            icon={Trash2}
            color="emerald"
            change={`${analytics?.overview.activeBins || 0} active`}
            changeType="positive"
          />
          <StatCard
            title="Full Bins"
            value={analytics?.overview.fullBins || 0}
            icon={AlertTriangle}
            color="red"
            change="Above 80%"
            changeType="negative"
          />
          <StatCard
            title="Active Alerts"
            value={analytics?.overview.activeAlerts || 0}
            icon={AlertTriangle}
            color="amber"
            change={`${analytics?.overview.criticalAlerts || 0} critical`}
            changeType={
              (analytics?.overview.criticalAlerts || 0) > 0
                ? "negative"
                : "neutral"
            }
          />
          <StatCard
            title="Recycling Rate"
            value={`${analytics?.wasteStats.recyclingRate || 0}%`}
            icon={Recycle}
            color="blue"
            change="This week"
            changeType="positive"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Waste Collection Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Waste Collection Trends
            </h2>
            {analytics?.wasteHistory && analytics.wasteHistory.length > 0 ? (
              <WasteChart data={analytics.wasteHistory} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <p>No data available. Run simulation to generate data.</p>
              </div>
            )}
          </div>

          {/* Waste Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Waste Distribution by Type
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
                <p>No bins configured yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bin Status Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Bin Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-gray-600">Empty (0-39%)</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {analytics?.overview.emptyBins || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-gray-600">Half (40-79%)</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {analytics?.overview.halfBins || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-gray-600">Full (80-100%)</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {analytics?.overview.fullBins || 0}
                </span>
              </div>
            </div>
            {/* Progress bars */}
            <div className="mt-6 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Overall Capacity</span>
                  <span className="font-medium">
                    {analytics?.overview.totalBins
                      ? Math.round(
                          ((analytics.overview.fullBins +
                            analytics.overview.halfBins * 0.5) /
                            analytics.overview.totalBins) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        analytics?.overview.totalBins
                          ? ((analytics.overview.fullBins +
                              analytics.overview.halfBins * 0.5) /
                              analytics.overview.totalBins) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Waste Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Bins by Type</h3>
            <div className="space-y-4">
              {[
                { type: "General", color: "gray", key: "general" },
                { type: "Recyclable", color: "blue", key: "recyclable" },
                { type: "Organic", color: "green", key: "organic" },
                { type: "Hazardous", color: "red", key: "hazardous" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 bg-${item.color}-500 rounded-full`}
                    />
                    <span className="text-gray-600">{item.type}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {analytics?.binsByType?.[item.key] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Collection Stats
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700">Total Collected</span>
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-emerald-700 mt-1">
                  {analytics?.wasteStats.totalCollected || 0} kg
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Recyclables</span>
                  <Recycle className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-700 mt-1">
                  {analytics?.wasteStats.totalRecyclable || 0} kg
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Active Alerts
            </h2>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {alerts.length} active
            </span>
          </div>
          {alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert._id}
                  id={alert._id}
                  binCode={alert.binCode}
                  message={alert.message}
                  priority={alert.priority}
                  status={alert.status}
                  createdAt={alert.createdAt}
                  onAcknowledge={(id) => handleAlertAction(id, "acknowledged")}
                  onResolve={(id) => handleAlertAction(id, "resolved")}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No active alerts</p>
              <p className="text-sm mt-1">
                All bins are operating within normal parameters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}