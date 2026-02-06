"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import BinCard from "../../components/BinCard";
import {
  Plus,
  Loader2,
  Search,
  Filter,
  X,
  Trash2,
  MapPin,
} from "lucide-react";

interface Bin {
  _id: string;
  binId: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    area: string;
  };
  fillLevel: number;
  wasteType: string;
  status: string;
  lastCollected: string;
}

interface BinFormData {
  location: {
    address: string;
    latitude: number;
    longitude: number;
    area: string;
  };
  wasteType: string;
  status: string;
  fillLevel: number;
}

export default function BinsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, token } = useAuth();
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formData, setFormData] = useState<BinFormData>({
    location: {
      address: "",
      latitude: 40.7128,
      longitude: -74.006,
      area: "",
    },
    wasteType: "general",
    status: "active",
    fillLevel: 0,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBin) {
        await axios.put(`/api/bins/${editingBin._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/bins", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      setEditingBin(null);
      resetForm();
      fetchBins();
    } catch (error) {
      console.error("Error saving bin:", error);
    }
  };

  const handleEdit = (id: string) => {
    const bin = bins.find((b) => b._id === id);
    if (bin) {
      setEditingBin(bin);
      setFormData({
        location: bin.location,
        wasteType: bin.wasteType,
        status: bin.status,
        fillLevel: bin.fillLevel,
      });
      setShowModal(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this bin?")) {
      try {
        await axios.delete(`/api/bins/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBins();
      } catch (error) {
        console.error("Error deleting bin:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      location: {
        address: "",
        latitude: 40.7128,
        longitude: -74.006,
        area: "",
      },
      wasteType: "general",
      status: "active",
      fillLevel: 0,
    });
  };

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.binId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || bin.wasteType === filterType;
    const matchesStatus = !filterStatus || bin.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

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
              Waste Bin Management
            </h1>
            <p className="text-gray-500 mt-1">
              Add, update, and manage waste bins
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingBin(null);
              setShowModal(true);
            }}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Bin
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Types</option>
              <option value="general">General</option>
              <option value="recyclable">Recyclable</option>
              <option value="organic">Organic</option>
              <option value="hazardous">Hazardous</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bins Grid */}
        {filteredBins.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBins.map((bin) => (
              <BinCard
                key={bin._id}
                id={bin._id}
                binId={bin.binId}
                location={bin.location}
                fillLevel={bin.fillLevel}
                wasteType={bin.wasteType}
                status={bin.status}
                lastCollected={bin.lastCollected}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No bins found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType || filterStatus
                ? "Try adjusting your filters"
                : "Get started by adding your first waste bin"}
            </p>
            {!searchTerm && !filterType && !filterStatus && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add First Bin
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingBin ? "Edit Bin" : "Add New Bin"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingBin(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.location.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            address: e.target.value,
                          },
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location.area}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          area: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Downtown"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.location.latitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            latitude: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.location.longitude}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            ...formData.location,
                            longitude: parseFloat(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waste Type
                    </label>
                    <select
                      value={formData.wasteType}
                      onChange={(e) =>
                        setFormData({ ...formData, wasteType: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="general">General</option>
                      <option value="recyclable">Recyclable</option>
                      <option value="organic">Organic</option>
                      <option value="hazardous">Hazardous</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {editingBin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fill Level: {formData.fillLevel}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.fillLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fillLevel: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Empty</span>
                      <span>Full</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBin(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {editingBin ? "Update Bin" : "Add Bin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}