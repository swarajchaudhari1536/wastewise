"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import {
  Recycle,
  BarChart3,
  MapPin,
  Bell,
  Leaf,
  Truck,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Globe,
  TreePine,
  Trash2,
  ChevronDown,
  MousePointer2,
  Users,
  Building2,
  Award,
  Activity,
  Wifi,
  Timer,
  LayoutDashboard,
} from "lucide-react";

/* ═══════════════════════════════════════════
   HOOKS & HELPERS
   ═══════════════════════════════════════════ */

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (delay) {
            setTimeout(() => el.classList.add("visible"), delay);
          } else {
            el.classList.add("visible");
          }
          obs.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2200,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(ease * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const c = cardRef.current;
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${
        -y * 8
      }deg) scale3d(1.02,1.02,1.02)`;
    },
    []
  );
  const handleMouseLeave = useCallback(() => {
    const c = cardRef.current;
    if (c)
      c.style.transform =
        "perspective(800px) rotateY(0) rotateX(0) scale3d(1,1,1)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}

/* ── Feature card extracted so hooks aren't called in a loop ── */
function FeatureCard({
  feature,
  index,
}: {
  feature: {
    icon: any;
    title: string;
    description: string;
    gradient: string;
    bg: string;
    iconColor: string;
  };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), index * 120);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const Icon = feature.icon;

  return (
    <div ref={ref} className="reveal-scale">
      <TiltCard className="h-full">
        <div className="group relative h-full bg-white rounded-3xl p-8 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`}
          />
          <div className="relative z-10">
            <div
              className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
            >
              <Icon className={`h-7 w-7 ${feature.iconColor}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-slate-500 leading-relaxed">
              {feature.description}
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Learn more <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/* ── Step card extracted ── */
function StepCard({
  step,
  index,
}: {
  step: { num: string; title: string; desc: string; icon: any };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), index * 150);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const Icon = step.icon;

  return (
    <div ref={ref} className="reveal-scale relative group text-center">
      <div className="relative mx-auto w-16 h-16 mb-6">
        <div className="absolute inset-0 bg-emerald-100 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500" />
        <div className="relative w-full h-full bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center group-hover:shadow-lg group-hover:border-emerald-200 transition-all duration-500">
          <Icon className="h-7 w-7 text-emerald-600" />
        </div>
        <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
          {step.num.replace("0", "")}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto">
        {step.desc}
      </p>
    </div>
  );
}

/* ── Testimonial card extracted ── */
function TestimonialCard({
  t,
  index,
}: {
  t: { quote: string; author: string; role: string; city: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), index * 150);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={ref} className="reveal-scale">
      <div className="group relative h-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-500">
        <div className="absolute top-6 right-6 text-6xl font-serif text-emerald-100 leading-none select-none group-hover:text-emerald-200 transition-colors duration-300">
          &ldquo;
        </div>
        <div className="relative z-10">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <svg
                key={j}
                className="w-5 h-5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-slate-700 leading-relaxed mb-6 italic">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
              {t.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{t.author}</p>
              <p className="text-xs text-slate-400">
                {t.role} · {t.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sparkle stars ─── */
function SparkleGroup() {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        dur: Math.random() * 2 + 2,
      })),
    []
  );
  return (
    <>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `sparkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
            <path d="M12 0L14.59 8.41L24 12L14.59 15.59L12 24L9.41 15.59L0 12L9.41 8.41Z" />
          </svg>
        </div>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════
   HERO SECTION (separate component for
   mouse-tracking state isolation)
   ═══════════════════════════════════════════ */

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [counters, setCounters] = useState({
    bins: 0,
    active: 0,
    alerts: 0,
    full: 0,
  });
  const rafRef = useRef<number>();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const targets = { bins: 2450, active: 2180, alerts: 185, full: 85 };
    const duration = 2000;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - t, 4);
      setCounters({
        bins: Math.round(e * targets.bins),
        active: Math.round(e * targets.active),
        alerts: Math.round(e * targets.alerts),
        full: Math.round(e * targets.full),
      });
      if (t < 1) raf = requestAnimationFrame(step);
    };
    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 800);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [loaded]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMouse({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    });
  }, []);

  const p = (f: number) => ({
    transform: `translate(${mouse.x * f}px, ${mouse.y * f}px)`,
    transition: "transform 0.3s ease-out",
  });

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative -mt-[4.5rem] min-h-screen flex items-center overflow-hidden hero-aurora text-white"
    >
      {/* ── Backgrounds ── */}
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute inset-[-48px] hero-grid hero-grid-move opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(52,211,153,0.12),transparent_40%)]" />

      {/* Blobs with parallax */}
      <div style={p(30)}>
        <div className="absolute top-[-10%] left-[-8%] w-[550px] h-[550px] bg-emerald-400/20 animate-morph blur-3xl" />
      </div>
      <div style={p(-25)}>
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[650px] h-[650px] bg-teal-300/20 animate-morph blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
      </div>
      <div style={p(15)}>
        <div
          className="absolute top-[35%] right-[15%] w-[350px] h-[350px] bg-cyan-400/15 animate-morph blur-3xl"
          style={{ animationDelay: "-2s" }}
        />
      </div>
      <div style={p(-20)}>
        <div
          className="absolute top-[20%] left-[30%] w-[250px] h-[250px] bg-yellow-400/[0.06] animate-morph blur-3xl"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: "-5%",
              background: `rgba(255,255,255,${Math.random() * 0.35 + 0.1})`,
              animation: `particleFall ${
                Math.random() * 8 + 6
              }s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <SparkleGroup />
      </div>

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3QgZmlsdGVyPSJ1cmwoI2EpIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+PC9zdmc+')]" />

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            fillOpacity="0.06"
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L0,120Z"
          />
          <path
            fill="white"
            d="M0,96L48,90.7C96,85,192,75,288,80C384,85,480,107,576,112C672,117,768,107,864,96C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,120L0,120Z"
          />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[4.5rem] pb-24 lg:pb-0 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[calc(100vh-4.5rem)]">
          {/* ═══ LEFT ═══ */}
          <div className="py-12 lg:py-0">
            {/* Badge */}
            <div
              className={`transition-all duration-700 ${
                loaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-8 border border-white/20 overflow-hidden cursor-default hover:bg-white/15 transition-colors">
                <span className="absolute top-0 h-full w-[60%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[badgeShimmer_3s_ease-in-out_infinite]" />
                <span className="relative flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                  Building Sustainable Smart Cities
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                </span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-6">
              {["Intelligent", "Urban"].map((word, i) => (
                <span key={word} className="inline-block overflow-hidden mr-3">
                  <span
                    className={`inline-block text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] tracking-tight transition-all duration-700 ${
                      loaded
                        ? "translate-y-0 opacity-100 blur-0"
                        : "translate-y-full opacity-0 blur-sm"
                    }`}
                    style={{ transitionDelay: `${200 + i * 120}ms` }}
                  >
                    {word}
                  </span>
                </span>
              ))}
              <br className="hidden sm:block" />
              <span className="inline-block overflow-hidden">
                <span
                  className={`relative inline-block text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] tracking-tight transition-all duration-700 ${
                    loaded
                      ? "translate-y-0 opacity-100 blur-0"
                      : "translate-y-full opacity-0 blur-sm"
                  }`}
                  style={{ transitionDelay: "450ms" }}
                >
                  <span className="relative z-10">Waste Monitoring</span>
                  <span
                    className={`absolute bottom-2 left-0 h-3 sm:h-4 bg-yellow-400/30 rounded-full transition-all duration-1000 ease-out ${
                      loaded ? "w-full" : "w-0"
                    }`}
                    style={{ transitionDelay: "1.2s" }}
                  />
                </span>
              </span>
              <br className="hidden sm:block" />
              <span className="inline-block overflow-hidden">
                <span
                  className={`inline-block text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold leading-[1.1] tracking-tight transition-all duration-700 ${
                    loaded
                      ? "translate-y-0 opacity-100 blur-0"
                      : "translate-y-full opacity-0 blur-sm"
                  }`}
                  style={{ transitionDelay: "580ms" }}
                >
                  System
                </span>
              </span>
            </h1>

            {/* Sub */}
            <p
              className={`text-lg sm:text-xl text-emerald-50/90 mb-10 max-w-lg leading-relaxed transition-all duration-700 ${
                loaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              Transform your city&apos;s waste management with{" "}
              <span className="text-white font-semibold">IoT-powered</span>{" "}
              monitoring, real-time analytics, and{" "}
              <span className="text-white font-semibold">AI-driven</span>{" "}
              recycling optimization.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-700 ${
                loaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "850ms" }}
            >
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] hover:scale-[1.04] active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5" />
                  Open Dashboard
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                href="/about"
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold overflow-hidden transition-all duration-500 hover:scale-[1.04] active:scale-[0.98]"
              >
                <span className="absolute inset-0 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25" />
                <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 text-white">
                  Learn More
                  <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                </span>
              </Link>
            </div>

            {/* Social proof */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 transition-all duration-700 ${
                loaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              <div className="flex items-center">
                <div className="flex -space-x-2.5">
                  {[
                    "from-emerald-400 to-emerald-600",
                    "from-teal-400 to-teal-600",
                    "from-cyan-400 to-cyan-600",
                    "from-blue-400 to-blue-600",
                    "from-violet-400 to-violet-600",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} border-[2.5px] border-emerald-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm hover:scale-110 hover:z-10 transition-transform duration-300`}
                    >
                      {["SC", "JM", "MG", "AK", "LR"][i]}
                    </div>
                  ))}
                </div>
                <div className="ml-3 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center text-[10px] font-bold text-white/70">
                  +99
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-emerald-100">
                  <span className="font-bold text-white">120+ cities</span>{" "}
                  trust WasteWise
                </p>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT — 3D cards ═══ */}
          <div
            className={`relative hidden lg:flex items-center justify-center min-h-[560px] transition-all duration-1000 ${
              loaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
            style={{ transitionDelay: "500ms", perspective: "1200px" }}
          >
            {/* Orbiting dots */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-orbit">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.6)]" />
              </div>
              <div className="animate-orbit-reverse">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
              </div>
              <div
                className="animate-orbit"
                style={{ animationDuration: "25s" }}
              >
                <div className="w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_10px_rgba(244,114,182,0.5)]" />
              </div>
            </div>

            {/* CENTER CARD */}
            <div style={p(20)} className="relative z-20">
              <div className="animate-card-float">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-[28px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/[0.08] backdrop-blur-2xl rounded-3xl p-7 w-[340px] border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-glow-pulse">
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/40 to-teal-400/40 flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <Recycle className="h-6 w-6 text-white drop-shadow" />
                      </div>
                      <div>
                        <p className="text-[13px] text-emerald-200/80 font-medium">
                          Total Smart Bins
                        </p>
                        <p className="text-3xl font-extrabold tracking-tight">
                          {counters.bins.toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-400/20 border border-green-400/30">
                        <Activity className="h-3 w-3 text-green-400" />
                        <span className="text-[11px] font-bold text-green-400">
                          Live
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        {
                          label: "Active",
                          val: counters.active,
                          c: "from-emerald-400/20 to-emerald-400/5 border-emerald-400/20",
                          d: "bg-emerald-400",
                        },
                        {
                          label: "Alert",
                          val: counters.alerts,
                          c: "from-amber-400/20 to-amber-400/5 border-amber-400/20",
                          d: "bg-amber-400",
                        },
                        {
                          label: "Full",
                          val: counters.full,
                          c: "from-red-400/20 to-red-400/5 border-red-400/20",
                          d: "bg-red-400",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`bg-gradient-to-b ${item.c} border rounded-xl p-3 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
                        >
                          <p className="text-lg font-extrabold">
                            {item.val.toLocaleString()}
                          </p>
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${item.d}`}
                            />
                            <p className="text-[11px] text-white/60 font-medium">
                              {item.label}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-end gap-1.5 h-10">
                      {[40, 65, 30, 85, 55, 90, 45, 70, 50, 80, 35, 75].map(
                        (h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-full overflow-hidden bg-white/5"
                          >
                            <div
                              className="w-full rounded-full transition-all duration-1000 ease-out"
                              style={{
                                height: loaded ? `${h}%` : "0%",
                                transitionDelay: `${1200 + i * 80}ms`,
                                background:
                                  "linear-gradient(to top,rgba(52,211,153,0.6),rgba(34,211,238,0.3))",
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TOP-RIGHT CARD */}
            <div
              style={p(-15)}
              className={`absolute -top-4 -right-2 z-30 transition-all duration-1000 ${
                loaded
                  ? "opacity-100 translate-y-0 translate-x-0"
                  : "opacity-0 -translate-y-8 translate-x-8"
              }`}
            >
              <div
                className="animate-float-slow"
                style={{ animationDelay: "-2s" }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-4 w-[190px] border border-white/[0.12] shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-400/25 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-blue-300" />
                      </div>
                      <div>
                        <span className="text-sm font-bold">GPS Live</span>
                        <div className="flex items-center gap-1">
                          <Wifi className="h-2.5 w-2.5 text-blue-400" />
                          <span className="text-[10px] text-blue-300">
                            Connected
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-[3px]">
                      {[40, 70, 30, 85, 55, 90, 45].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-white/[0.06] rounded-full overflow-hidden h-14"
                        >
                          <div
                            className="w-full bg-gradient-to-t from-blue-400/60 to-blue-300/20 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              height: loaded ? `${h}%` : "0%",
                              marginTop: loaded ? `${100 - h}%` : "100%",
                              transitionDelay: `${1500 + i * 100}ms`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM-LEFT CARD */}
            <div
              style={p(25)}
              className={`absolute -bottom-2 -left-6 z-30 transition-all duration-1000 ${
                loaded
                  ? "opacity-100 translate-y-0 translate-x-0"
                  : "opacity-0 translate-y-8 -translate-x-8"
              }`}
            >
              <div
                className="animate-float"
                style={{ animationDelay: "-3s" }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-green-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-4 w-[210px] border border-white/[0.12] shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-green-400/25 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-300" />
                      </div>
                      <span className="text-sm font-bold">Recycling Rate</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-extrabold tracking-tight">
                        35%
                      </span>
                      <span className="flex items-center gap-0.5 text-green-300 text-sm font-bold mb-1.5 bg-green-400/15 px-2 py-0.5 rounded-full">
                        <TrendingUp className="h-3 w-3" />
                        12%
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.06] rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-[1500ms] ease-out"
                        style={{
                          width: loaded ? "35%" : "0%",
                          transitionDelay: "1600ms",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* NOTIFICATION MINI */}
            <div
              style={p(-12)}
              className={`absolute top-[45%] -left-12 z-30 transition-all duration-1000 ${
                loaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
            >
              <div
                className="animate-float-slow"
                style={{ animationDelay: "-5s" }}
              >
                <div className="bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-3.5 w-[170px] border border-white/[0.12] shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-amber-400/25 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-4 w-4 text-amber-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold truncate">
                        Bin #1042
                      </p>
                      <p className="text-[10px] text-amber-300/80">
                        90% capacity
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TIMER MINI */}
            <div
              style={p(18)}
              className={`absolute bottom-[25%] -right-6 z-30 transition-all duration-1000 ${
                loaded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-12"
              }`}
            >
              <div
                className="animate-float"
                style={{ animationDelay: "-1s" }}
              >
                <div className="bg-white/[0.08] backdrop-blur-2xl rounded-2xl p-3.5 border border-white/[0.12] shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-violet-400/25 flex items-center justify-center flex-shrink-0">
                      <Timer className="h-4 w-4 text-violet-300" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold">Next Pickup</p>
                      <p className="text-[10px] text-violet-300/80">
                        in 2h 15m
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${
          loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "1500ms" }}
      >
        <span className="text-[11px] text-white/50 font-medium tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function HomePage() {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Monitor waste levels and collection patterns with live dashboards, heatmaps, and exportable reports.",
      gradient: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      icon: MapPin,
      title: "GPS Tracking",
      description:
        "Track every bin on an interactive map with optimized collection route overlays.",
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description:
        "Instant push and email notifications when bins reach capacity or need maintenance.",
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      icon: Leaf,
      title: "Eco Analytics",
      description:
        "Track carbon footprint reductions, recycling rates, and environmental impact scores.",
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      icon: Truck,
      title: "Route Optimization",
      description:
        "AI-powered route planning that cuts fuel costs and collection time by up to 40%.",
      gradient: "from-rose-500 to-pink-600",
      bg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Role-based access, encrypted data, audit logs, and SOC 2 compliance built-in.",
      gradient: "from-slate-600 to-slate-800",
      bg: "bg-slate-100",
      iconColor: "text-slate-700",
    },
  ];

  const stats = [
    { value: 50, suffix: "%", label: "Cost Reduction", icon: TrendingUp },
    { value: 30, suffix: "%", label: "More Recycling", icon: Recycle },
    { value: 40, suffix: "%", label: "Less Emissions", icon: Leaf },
    { value: 99, suffix: ".9%", label: "System Uptime", icon: Zap },
  ];

  const steps = [
    {
      num: "01",
      title: "Deploy Smart Bins",
      desc: "Install IoT-enabled sensors on existing bins across your city in minutes.",
      icon: Trash2,
    },
    {
      num: "02",
      title: "Monitor in Real-time",
      desc: "Watch fill levels, temperatures, and locations update live on your dashboard.",
      icon: BarChart3,
    },
    {
      num: "03",
      title: "Optimize Collection",
      desc: "Let AI plan the most efficient routes, saving time, fuel, and labor costs.",
      icon: Truck,
    },
    {
      num: "04",
      title: "Measure Impact",
      desc: "Track recycling rates and sustainability KPIs with automated reports.",
      icon: Award,
    },
  ];

  const testimonials = [
    {
      quote:
        "WasteWise reduced our collection costs by 45% in the first quarter. The ROI was almost immediate.",
      author: "Sarah Chen",
      role: "City Sustainability Director",
      city: "Portland, OR",
    },
    {
      quote:
        "The real-time monitoring changed everything. We went from reactive to predictive waste management overnight.",
      author: "James Mwangi",
      role: "Operations Manager",
      city: "Nairobi, KE",
    },
    {
      quote:
        "Our recycling rate jumped from 22% to 51%. The data insights made it easy to find and fix problems.",
      author: "Maria Gonzalez",
      role: "Environmental Officer",
      city: "Barcelona, ES",
    },
  ];

  const trusted = [
    "Metro City Council",
    "GreenTech Corp",
    "EcoUrban",
    "CleanCity Inc",
    "SmartMunicipals",
    "UrbanFlow",
    "CivicWorks",
    "GreenPulse",
  ];

  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r5 = useReveal();
  const r7 = useReveal();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* ════ HERO ════ */}
      <HeroSection />

      {/* ════ TRUSTED BY ════ */}
      <section className="py-5 bg-slate-50/80 border-y border-slate-100 overflow-hidden">
        <div className="flex items-center animate-marquee whitespace-nowrap">
          {[...trusted, ...trusted].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-2 mx-8 sm:mx-12 text-slate-300 font-semibold text-sm sm:text-base"
            >
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ STATS ════ */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="absolute inset-0 dot-grid" />
        <div
          ref={r1}
          className="reveal relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <TiltCard key={i}>
                <div className="relative group bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-500 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <stat.icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <p className="text-4xl sm:text-5xl font-extrabold text-emerald-600 mb-2">
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                      />
                    </p>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FEATURES ════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={r2} className="reveal text-center mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-sm font-semibold text-emerald-700 mb-6">
              <Zap className="h-4 w-4" />
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
              Everything You Need for{" "}
              <span className="text-gradient-emerald">Smart Waste</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              A comprehensive platform to monitor, analyze, and optimize urban
              waste collection — from sensor to report.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ HOW IT WORKS ════ */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-teal-50 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-emerald-50 rounded-full blur-3xl translate-x-1/3" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={r3} className="reveal text-center mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full text-sm font-semibold text-teal-700 mb-6">
              <MousePointer2 className="h-4 w-4" />
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
              Up and Running in{" "}
              <span className="text-gradient-emerald">4 Steps</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              From deployment to impact — get started in days, not months.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
            <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200" />
            {steps.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-amber-50/50 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={r5} className="reveal text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-sm font-semibold text-amber-700 mb-6">
              <Users className="h-4 w-4" />
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight">
              Loved by Cities{" "}
              <span className="text-gradient-gold">Worldwide</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} t={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-aurora" />
        <div className="absolute inset-0 hero-grid opacity-30" />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: "-5%",
                background: `rgba(255,255,255,${Math.random() * 0.3 + 0.1})`,
                animation: `particleFall ${
                  Math.random() * 8 + 6
                }s linear infinite`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>

        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-400/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div
          ref={r7}
          className="reveal relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
        >
          <div className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium mb-8 border border-white/20 overflow-hidden">
            <span className="absolute top-0 h-full w-[60%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[badgeShimmer_3s_ease-in-out_infinite]" />
            <Globe className="h-4 w-4 relative" />
            <span className="relative">Join 120+ Cities Worldwide</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            Ready to Build a{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Cleaner Future</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-400/30 rounded-full -z-0" />
            </span>
            ?
          </h2>

          <p className="text-lg sm:text-xl text-emerald-50/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Start monitoring your city&apos;s waste infrastructure today. Free
            pilot available for qualified municipalities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center px-10 py-4 bg-white text-emerald-700 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,255,255,0.3)] hover:scale-[1.04] active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </Link>
            <Link
              href="/about"
              className="group relative inline-flex items-center justify-center px-10 py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-500 hover:scale-[1.04] active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl" />
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <span className="relative text-white">Schedule a Demo</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-emerald-100/80">
            {[
              "No credit card required",
              "14-day free trial",
              "Cancel anytime",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}