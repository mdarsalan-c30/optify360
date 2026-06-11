"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

const transitionPreset = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1] // Ease Out Expo
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transitionPreset }
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pb-16">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-orange/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-secondary-orange/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Copy & CTAs) */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Heading */}
            <motion.h1 
              variants={fadeUpVariant}
              className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading tracking-tight leading-[1.05] text-text-main"
            >
              Architecting Elite Digital Products That Fuel{" "}
              <span className="text-gradient">Hyper-Growth</span>
            </motion.h1>

            {/* Support Text */}
            <motion.p 
              variants={fadeUpVariant}
              className="text-base md:text-lg text-text-muted max-w-xl leading-relaxed"
            >
              We build custom SaaS platforms, automate complex operations, and execute high-performance SEO strategies. No templates, no shortcuts—just bespoke engineering and marketing that scales your revenue.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeUpVariant}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center bg-primary-orange hover:bg-primary-orange/90 text-text-main font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-orange/20 gap-2"
              >
                Book a Growth Consultation
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] text-text-main font-semibold px-8 py-4 rounded-xl transition-all duration-200 gap-2"
              >
                Explore Our Solutions
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              variants={fadeUpVariant}
              className="pt-8 border-t border-white/[0.05] grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-primary-orange">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Led by Architect</p>
                  <p className="text-sm font-bold text-text-main">Md Arsalan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-primary-orange">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Project success</p>
                  <p className="text-sm font-bold text-text-main">99% Success Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-primary-orange">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Client Revenue</p>
                  <p className="text-sm font-bold text-text-main">$10M+ Generated</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (Interactive SaaS Dashboard Widget) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 relative w-full"
          >
            {/* Dashboard Backing Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-3xl blur-[80px] opacity-15 pointer-events-none" />

            {/* Dashboard Glass Frame */}
            <div className="glass-panel rounded-2xl p-6 shadow-2xl shadow-black/50 border border-white/[0.08] relative overflow-hidden">
              {/* Header Details */}
              <div className="flex justify-between items-center mb-6 border-b border-white/[0.05] pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
                  <span className="text-xs text-text-muted ml-2 font-mono">live_attribution_tracker</span>
                </div>
                <div className="bg-primary-orange/10 border border-primary-orange/20 rounded-md px-2 py-0.5 text-[10px] text-primary-orange font-semibold font-mono uppercase tracking-wider">
                  Active
                </div>
              </div>

              {/* Metric Row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">MRR Growth</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-heading text-text-main">$48.2k</span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +24%
                    </span>
                  </div>
                </div>
                <div className="bg-white/[0.01] border border-white/[0.04] p-3 rounded-xl">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Conversion rate</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold font-heading text-text-main">4.82%</span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +42%
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Graphic (SVG) */}
              <div className="relative h-44 w-full bg-black/20 rounded-xl p-4 border border-white/[0.03] overflow-hidden">
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-orange rounded-full"></span>
                  <span className="text-[10px] text-text-muted">SEO vs Paid Traffic Volume</span>
                </div>

                {/* SVG Graph Paths */}
                <svg className="w-full h-full pt-4" viewBox="0 0 100 50" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  
                  {/* Paid Traffic Curve (Fades Out) */}
                  <path
                    d="M0 45 Q 20 40, 40 35 T 80 20 T 100 22"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="2"
                  />

                  {/* Organic SEO Growth Curve (Glowing Orange) */}
                  <path
                    d="M0 48 Q 20 42, 45 28 T 80 8 T 100 2"
                    fill="none"
                    stroke="url(#orange-gradient)"
                    strokeWidth="2.5"
                    className="drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]"
                  />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="orange-gradient" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FF6B00" />
                      <stop offset="100%" stopColor="#FF8C42" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Bottom Details */}
              <div className="mt-4 flex justify-between items-center text-xs text-text-muted font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full block animate-pulse"></span>
                  Engineered in Next.js
                </span>
                <span>Optimized (1.2s Load)</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
