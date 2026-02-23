"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

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

interface MapComponentProps {
  bins: Bin[];
}

const BIN_COLORS = {
  fill: {
    empty: "#10b981",
    half: "#f59e0b",
    full: "#ef4444",
  },
  type: {
    general: "#6b7280",
    recyclable: "#3b82f6",
    organic: "#22c55e",
    hazardous: "#a855f7",
  },
};

const getFillColor = (level: number) =>
  level >= 80
    ? BIN_COLORS.fill.full
    : level >= 40
      ? BIN_COLORS.fill.half
      : BIN_COLORS.fill.empty;

const getTypeColor = (type: string) =>
  BIN_COLORS.type[type as keyof typeof BIN_COLORS.type] ||
  BIN_COLORS.type.general;

// ── Pure helper: populate a layer group with bin markers ──
function addMarkers(L: any, layer: any, bins: Bin[]) {
  bins.forEach((bin) => {
    const fillColor = getFillColor(bin.fillLevel);
    const typeColor = getTypeColor(bin.wasteType);

    const icon = L.divIcon({
      html: `
        <div style="position:relative;width:36px;height:46px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.3))">
          <svg width="36" height="46" viewBox="0 0 36 46" fill="none">
            <path d="M18 0C8.06 0 0 8.06 0 18c0 13 16.5 26 17.19 26.53a1.5 1.5 0 001.62 0C19.5 44 36 31 36 18 36 8.06 27.94 0 18 0z" fill="${typeColor}"/>
            <circle cx="18" cy="17" r="11" fill="white" fill-opacity=".95"/>
            <circle cx="18" cy="17" r="8" fill="${fillColor}" fill-opacity=".9"/>
            <text x="18" y="20.5" text-anchor="middle" font-size="8.5" font-weight="700" fill="white" font-family="system-ui,sans-serif">${bin.fillLevel}%</text>
          </svg>
        </div>`,
      className: "",
      iconSize: [36, 46],
      iconAnchor: [18, 46],
      popupAnchor: [0, -46],
    });

    const statusStyle =
      bin.status === "active"
        ? "background:#ecfdf5;color:#047857"
        : bin.status === "inactive"
          ? "background:#f1f5f9;color:#64748b"
          : "background:#fffbeb;color:#b45309";

    const popup = `
      <div style="min-width:240px;padding:4px;font-family:system-ui,sans-serif">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
          <span style="width:12px;height:12px;border-radius:50%;background:${typeColor};box-shadow:0 0 0 2px white"></span>
          <strong style="font-size:15px;color:#0f172a">${bin.binId}</strong>
          <span style="margin-left:auto;font-size:11px;font-weight:600;padding:2px 8px;border-radius:9999px;${statusStyle};text-transform:capitalize">${bin.status}</span>
        </div>
        <p style="font-size:13px;color:#334155;margin:0 0 2px">${bin.location.address}</p>
        <p style="font-size:12px;color:#94a3b8;margin:0 0 12px">${bin.location.area}</p>
        <div style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
            <span style="font-weight:500;color:#475569">Fill Level</span>
            <span style="font-weight:700;color:${fillColor}">${bin.fillLevel}%</span>
          </div>
          <div style="width:100%;height:8px;background:#f1f5f9;border-radius:9999px;overflow:hidden">
            <div style="width:${bin.fillLevel}%;height:100%;background:${fillColor};border-radius:9999px"></div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="width:10px;height:10px;border-radius:50%;background:${typeColor}"></span>
          <span style="font-size:12px;color:#64748b;font-weight:500;text-transform:capitalize">${bin.wasteType} waste</span>
        </div>
      </div>`;

    L.marker([bin.location.latitude, bin.location.longitude], { icon })
      .bindPopup(popup, { closeButton: true, maxWidth: 300 })
      .addTo(layer);
  });
}

// ── Main map component (vanilla Leaflet, no react-leaflet) ──
function MapComponentInner({ bins }: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  const center = useMemo((): [number, number] => {
    return [19.0760, 72.8777]; // Mumbai
  }, []);

  // Ref keeps the latest center available to the async init callback
  const centerRef = useRef(center);
  centerRef.current = center;

  // ── Initialize Leaflet map once ──
  useEffect(() => {
    let cancelled = false;

    import("leaflet").then((mod) => {
      if (cancelled || !containerRef.current) return;

      const L = mod.default;
      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: centerRef.current,
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);

      mapRef.current = map;
      markersLayerRef.current = markersLayer;
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersLayerRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  // ── Sync markers & view whenever bins/center change or map becomes ready ──
  useEffect(() => {
    if (!mapReady) return;
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!L || !map || !layer) return;

    layer.clearLayers();
    addMarkers(L, layer, bins);
    map.flyTo(center, map.getZoom(), { duration: 0.5 });
  }, [mapReady, bins, center]);

  return (
    <div className="h-full w-full relative overflow-hidden rounded-2xl">
      {/* Loading overlay — disappears once map is ready */}
      {!mapReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="text-center space-y-4">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 rounded-full border-[3px] border-slate-200" />
              <div className="absolute inset-0 rounded-full border-[3px] border-emerald-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              Loading map…
            </p>
          </div>
        </div>
      )}
      {/* The actual map container */}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}

export default dynamic(() => Promise.resolve(MapComponentInner), {
  ssr: false,
});