"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Recycle,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  TreePine,
  Heart,
  ExternalLink,
  Send,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Map View", href: "/map" },
        { label: "Analytics", href: "/analytics" },
        { label: "Bin Management", href: "/bins" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Contact", href: "/contact" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "GDPR", href: "#" },
      ],
    },
  ];

  const socials = [
    { icon: Github, href: "#", label: "GitHub", hoverColor: "hover:bg-slate-700" },
    { icon: Twitter, href: "#", label: "Twitter", hoverColor: "hover:bg-sky-600" },
    { icon: Linkedin, href: "#", label: "LinkedIn", hoverColor: "hover:bg-blue-700" },
  ];

  return (
    <footer className="relative bg-slate-950 text-slate-400 overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

      {/* Subtle background elements */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Newsletter section ── */}
        <div className="py-12 sm:py-16 border-b border-slate-800/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-tight">
                Stay in the loop
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get the latest updates on smart waste management, sustainability
                tips, and product news delivered to your inbox.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
            >
              <div className="relative flex-1 lg:w-72">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 whitespace-nowrap"
              >
                {subscribed ? (
                  <>Subscribed! ✓</>
                ) : (
                  <>
                    Subscribe
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* ── Main footer grid ── */}
        <div className="py-12 sm:py-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl rotate-6 opacity-20 group-hover:rotate-12 transition-transform duration-500" />
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Recycle className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Waste<span className="text-emerald-400">Wise</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Intelligent urban waste monitoring and recycling system. Building
              sustainable, smarter cities with IoT-powered technology.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-6">
              {[
                { icon: Mail, text: "swarajchaudhari@gmail.com" },
                { icon: Phone, text: "+1 (555) 123-4567" },
                { icon: MapPin, text: "123 Green St, Eco City, EC 12345" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-2.5 text-sm">
                  <item.icon className="h-4 w-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-white ${s.hoverColor} transition-all duration-300`}
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white mb-5 tracking-wide">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group text-sm flex items-center gap-1 hover:text-emerald-400 transition-colors duration-300"
                    >
                      {link.label}
                      <ExternalLink className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="py-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} WasteWise. All rights reserved. <br />
            <span className="block mt-1">Website by{" Swaraj Chaudhari"}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <TreePine className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-400">
                Carbon-neutral platform
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              Made by
              <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
              Swaraj Chaudhari
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}