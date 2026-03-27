"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Zap, Shield, Activity, FolderKanban, CheckCircle, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: FolderKanban, label: "Project Management",  desc: "Centralised tracking across every site and client" },
  { icon: Activity,     label: "Real-Time Visibility", desc: "Live status, overdue flags, and activity feeds"    },
  { icon: Shield,       label: "Full Audit Trail",     desc: "Every action logged — compliant and traceable"     },
];

const TESTIMONIAL = {
  quote: "Opsentra replaced our Excel sheets and WhatsApp chains overnight. Our project managers finally have visibility.",
  name:  "Deon Fourie",
  title: "Engineering Manager, Transnet",
};

export default function LoginPage() {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex bg-bg">

      {/* ── Left: dark brand panel ── */}
      <div className="hidden lg:flex lg:w-130 xl:w-140 flex-col justify-between p-10 xl:p-14 relative overflow-hidden shrink-0 bg-navy">
        {/* Ambient glow blobs */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,82,255,0.18) 0%, transparent 65%)", transform: "translate(30%, -30%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(77,124,255,0.12) 0%, transparent 60%)", transform: "translate(-35%, 35%)" }}
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 btn-primary">
            <Zap size={18} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[18px] font-bold text-white leading-none font-display">Opsentra</p>
            <p className="text-[10px] uppercase tracking-[0.15em] mt-0.5 text-white/40">Engineering OS</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-semibold bg-primary/20 text-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-status" aria-hidden="true" />
            Trusted by SA engineering firms
          </div>

          <h2 className="text-[36px] xl:text-[42px] font-bold text-white leading-[1.1] mb-5">
            Operations,{" "}
            <span style={{ background: "linear-gradient(135deg,#4D7CFF,#93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              under control.
            </span>
          </h2>

          <p className="text-[15px] leading-relaxed mb-8 text-white/55">
            One platform to manage projects, track every job, and give your entire team real-time visibility — from office to site.
          </p>

          {/* Feature list */}
          <div className="space-y-4 mb-10">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-white/[0.07] border border-white/8">
                    <Icon size={15} className="text-blue-300" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white">{f.label}</p>
                    <p className="text-[12px] mt-0.5 text-white/45">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl p-5 bg-white/5 border border-white/8">
            <p className="text-[13px] leading-relaxed italic mb-4 text-white/70">
              &ldquo;{TESTIMONIAL.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] text-white btn-primary">
                DF
              </div>
              <div>
                <p className="text-[12px] font-semibold text-white">{TESTIMONIAL.name}</p>
                <p className="text-[11px] text-white/40">{TESTIMONIAL.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative flex items-center gap-2 text-white/25">
          <CheckCircle size={12} aria-hidden="true" />
          <span className="text-[11px]">No setup required · Cancel anytime</span>
        </div>
      </div>

      {/* ── Right: login form ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center btn-primary">
              <Zap size={16} className="text-white" aria-hidden="true" />
            </div>
            <span className="text-[18px] font-bold text-ink font-display">Opsentra</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-ink leading-tight mb-1.5">Welcome back</h1>
            <p className="text-[13.5px] text-ink-3">Sign in to your Opsentra workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-ink-2" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.co.za"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full h-10 rounded-xl border border-border bg-white text-sm text-ink placeholder:text-ink-4 px-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-ink-2" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] font-medium text-primary hover:opacity-75 cursor-pointer transition-opacity"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full h-10 rounded-xl border border-border bg-white text-sm text-ink placeholder:text-ink-4 pl-3 pr-12 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-ink-3 hover:text-ink cursor-pointer transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-11 rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin-btn w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={15} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-4 rounded-xl bg-primary-muted border border-primary/10 flex items-start gap-3">
            <Zap size={14} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[12px] leading-relaxed text-ink-2">
              <span className="font-semibold">Demo mode:</span> Enter any email and password to explore the full system — no account needed.
            </p>
          </div>

          <p className="text-center text-[12px] text-ink-4 mt-6">
            Don&apos;t have an account?{" "}
            <button type="button" className="font-semibold text-primary hover:opacity-75 cursor-pointer transition-opacity">
              Contact your admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
