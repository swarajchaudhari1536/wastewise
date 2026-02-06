"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Recycle,
  LayoutDashboard,
  Trash2,
  BarChart3,
  MapPin,
  LogOut,
  User,
  Home,
  Info,
  Settings,
  Phone,
  ChevronDown,
  X,
  Sparkles,
  Crown,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const publicLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/how-it-works", label: "How It Works", icon: Settings },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  const authLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/bins", label: "Bins", icon: Trash2 },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/map", label: "Map", icon: MapPin },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <>
      {/* ─── Fixed navbar ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-1.5 bg-white/85 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.06)] border-b border-slate-200/50"
            : "py-2 bg-white/60 backdrop-blur-xl border-b border-slate-200/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Circular logo */}
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-500" />
                {/* Outer ring */}
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 p-[2px] shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow duration-500">
                  {/* Inner circle */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-95 transition-transform duration-500">
                    <Recycle className="h-[18px] w-[18px] text-white group-hover:rotate-180 transition-transform duration-700" />
                  </div>
                </div>
                {/* Status dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm">
                  <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                  Waste
                </span>
                <span className="text-lg font-extrabold tracking-tight text-emerald-600">
                  Wise
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 -mt-1 tracking-widest uppercase">
                  Smart City
                </span>
              </div>
            </Link>

            {/* ── Desktop links ── */}
            <div className="hidden lg:flex items-center bg-slate-100/60 rounded-2xl p-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                    isActive(link.href)
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="h-5 w-px bg-slate-200 mx-1" />
                  {authLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                        isActive(link.href)
                          ? "bg-white text-emerald-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <link.icon className="h-3.5 w-3.5" />
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* ── Desktop right ── */}
            <div className="hidden lg:flex items-center gap-2.5">
              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen((p) => !p)}
                    className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full transition-all duration-300 border ${
                      userMenuOpen
                        ? "bg-slate-100 border-slate-200"
                        : "bg-white/60 border-slate-200/60 hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                      {initials}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all duration-300 origin-top-right ${
                      userMenuOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {/* User header */}
                    <div className="relative p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
                      <div className="relative flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border-2 border-white/30 backdrop-blur-sm">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">
                            {user?.name}
                          </p>
                          <p className="text-[11px] text-emerald-100 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-1.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </div>
                    <div className="p-1.5 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="group relative px-5 py-2.5 rounded-full text-sm font-bold text-white overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:shadow-emerald-500/25 active:scale-[0.97]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Get Started
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="lg:hidden relative w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200/80 flex items-center justify-center transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-[18px] h-3.5 flex flex-col justify-between">
                <span
                  className={`block h-[2px] bg-slate-700 rounded-full transition-all duration-300 origin-center ${
                    mobileOpen ? "rotate-45 translate-y-[5px]" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-slate-700 rounded-full transition-all duration-300 ${
                    mobileOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] bg-slate-700 rounded-full transition-all duration-300 origin-center ${
                    mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile drawer ─── */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobile}
        />

        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[82%] max-w-[360px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* ── Drawer header ── */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              onClick={closeMobile}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Recycle className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900">
                  Waste
                </span>
                <span className="text-base font-extrabold text-emerald-600">
                  Wise
                </span>
              </div>
            </Link>
            <button
              onClick={closeMobile}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-90 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Drawer body ── */}
          <div className="flex flex-col h-[calc(100%-73px)] overflow-y-auto">
            <div className="flex-1 p-4 space-y-1">
              {/* User card */}
              {isAuthenticated && user && (
                <div className="mb-4 p-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center font-bold text-sm">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{user.name}</p>
                      <p className="text-[11px] text-emerald-100 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Section: Menu */}
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-3 pt-2 pb-1">
                Menu
              </p>
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive(link.href)
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                  </div>
                  {link.label}
                  {isActive(link.href) && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </Link>
              ))}

              {/* Section: Dashboard */}
              {isAuthenticated && (
                <>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] px-3 pt-4 pb-1">
                    Dashboard
                  </p>
                  {authLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(link.href)
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isActive(link.href)
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <link.icon className="h-4 w-4" />
                      </div>
                      {link.label}
                      {isActive(link.href) && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* ── Drawer footer ── */}
            <div className="p-4 border-t border-slate-100">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    closeMobile();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:scale-[0.98] transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              ) : (
                <div className="space-y-2.5">
                  <Link
                    href="/login"
                    onClick={closeMobile}
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobile}
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 hover:shadow-xl active:scale-[0.98] transition-all"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Spacer ─── */}
      <div className="h-[4.5rem]" />
    </>
  );
}