"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Search, Cpu, RefreshCw, Smartphone, TrendingUp, Sparkles } from "lucide-react";

interface BentoCardProps {
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  gridClass: string;
  yOffset: [number, number]; // custom scroll parallax translation
  children?: React.ReactNode;
}

function BentoCard({ title, category, description, icon, gridClass, yOffset, children }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the card relative to viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Apply parallax transform
  const y = useTransform(scrollYProgress, [0, 1], yOffset);

  return (
    <motion.div
      ref={cardRef}
      style={{ y }}
      className={`group relative overflow-hidden rounded-2xl border border-brand-text/10 bg-brand-surface/50 p-8 flex flex-col justify-between backdrop-blur-md transition-colors duration-500 hover:border-brand-orange/30 hover:bg-brand-surface/80 ${gridClass}`}
    >
      {/* Glow highlight behind card content */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-brand-orange/0 via-brand-orange/0 to-brand-orange/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Top row */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-black border border-brand-text/10 text-brand-orange group-hover:border-brand-orange/40 group-hover:text-brand-dark-orange transition-all duration-300">
            {icon}
          </div>
          <span className="text-xs font-mono text-brand-muted tracking-wider uppercase bg-brand-black/60 px-3 py-1 rounded-full border border-brand-text/5">
            {category}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-brand-text mb-2 group-hover:text-brand-orange transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
          {description}
        </p>
      </div>

      {/* Embedded interactive graphic */}
      <div className="relative z-10 w-full mt-6 h-36 flex items-center justify-center overflow-hidden rounded-xl bg-brand-black/40 border border-brand-text/5">
        {children}
      </div>
    </motion.div>
  );
}

export default function BentoServices() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-brand-black px-6 py-32 overflow-hidden md:px-12 lg:px-24"
    >
      {/* Background radial lighting */}
      <div className="absolute inset-0 pointer-events-none radial-dark" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-orange/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-dark-orange/5 blur-3xl pointer-events-none rounded-full" />

      {/* Top divider border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-text/10 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-brand-orange tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Capabilities & Ecosystems
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text mb-6">
            Bespoke Digital Architectures <br />
            <span className="text-gradient">Engineered to Dominate</span>
          </h2>
          <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
            We operate at the convergence of elite styling and high-velocity backend mechanics. 
            Explore our architectural components that run the digital systems of tomorrow.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Card 1: Web Systems (Parallax offset: fast up) */}
          <BentoCard
            title="Web Engineering"
            category="Frontend / Engine"
            description="Highly responsive, performant platforms developed on solid headless infrastructures with fluid scroll mechanics."
            icon={<Code2 className="w-6 h-6" />}
            gridClass="md:col-span-2 lg:col-span-2"
            yOffset={[-30, 30]}
          >
            {/* Custom Graphic: Floating UI elements */}
            <div className="w-full h-full px-6 flex items-center justify-between relative">
              <div className="w-[60%] flex flex-col gap-2 bg-brand-surface/80 p-3 rounded-lg border border-brand-text/10 shadow-lg">
                <div className="flex gap-1.5 items-center mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="h-1.5 w-full bg-brand-muted/20 rounded" />
                <div className="h-1.5 w-[80%] bg-brand-muted/20 rounded" />
                <div className="h-3 w-[40%] bg-brand-orange/30 rounded mt-1" />
              </div>
              <div className="absolute right-8 top-6 w-24 h-24 rounded-full border border-brand-orange/30 border-dashed animate-spin [animation-duration:12s] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-brand-orange/20 flex items-center justify-center text-[10px] font-mono text-brand-orange">
                  SYSTEM
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: SEO Systems (Parallax offset: slow down) */}
          <BentoCard
            title="SEO Engine Tuning"
            category="Search Optics"
            description="Algorithmic optimization mapping and structural schemas built directly into the system's DNA."
            icon={<Search className="w-6 h-6" />}
            gridClass="md:col-span-1 lg:col-span-1"
            yOffset={[20, -20]}
          >
            {/* Custom Graphic: Glowing performance scale */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-x-6 bottom-4 h-16 flex items-end justify-between gap-1.5">
                {[40, 55, 48, 70, 60, 85, 98].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${val}%` }}
                      transition={{ duration: 1, delay: i * 0.05 }}
                      className={`w-full rounded-t-sm ${i === 6 ? 'bg-gradient-to-t from-brand-orange to-brand-dark-orange orange-glow-sm' : 'bg-brand-muted/20'}`}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute top-4 right-6 text-2xl font-black font-mono text-brand-orange animate-pulse">
                99/100
              </div>
            </div>
          </BentoCard>

          {/* Card 3: AI workflows (Parallax offset: fast down) */}
          <BentoCard
            title="AI Workflows"
            category="Cognition"
            description="Deep neural network routing and custom agentic microservices automating key visual operations."
            icon={<Cpu className="w-6 h-6" />}
            gridClass="md:col-span-1 lg:col-span-1"
            yOffset={[40, -40]}
          >
            {/* Custom Graphic: Interactive glowing nodes */}
            <div className="relative w-full h-full flex items-center justify-center">
              <svg className="w-32 h-20" viewBox="0 0 100 60">
                <path d="M10,30 L50,15 L90,30 L50,45 Z" fill="none" stroke="rgba(255, 107, 0, 0.3)" strokeWidth="1" />
                <path d="M50,15 L50,45" fill="none" stroke="rgba(255, 107, 0, 0.3)" strokeWidth="1" />
                <path d="M10,30 L90,30" fill="none" stroke="rgba(255, 107, 0, 0.3)" strokeWidth="1" />
                <circle cx="10" cy="30" r="3" fill="#A0A0A0" />
                <circle cx="90" cy="30" r="3" fill="#A0A0A0" />
                <circle cx="50" cy="15" r="4" fill="#FF8C42" className="animate-pulse" />
                <circle cx="50" cy="45" r="4" fill="#FF6B00" className="animate-pulse" />
                <circle cx="50" cy="30" r="5" fill="#FF6B00" />
              </svg>
            </div>
          </BentoCard>

          {/* Card 4: Automation (Parallax offset: slow up) */}
          <BentoCard
            title="Integrations & Automations"
            category="Mechanics"
            description="Hyper-threaded APIs executing data pipelines, database syncs, and visual asset delivery workflows."
            icon={<RefreshCw className="w-6 h-6 animate-spin [animation-duration:15s]" />}
            gridClass="md:col-span-2 lg:col-span-2"
            yOffset={[-15, 15]}
          >
            {/* Custom Graphic: Dynamic code scroll & flow */}
            <div className="w-full h-full flex items-center justify-around px-8 gap-4">
              <div className="w-1/2 font-mono text-[9px] text-brand-muted/60 flex flex-col gap-1 text-left">
                <div>const flow = async () =&gt; &#123;</div>
                <div className="text-brand-orange pl-2">await database.sync();</div>
                <div className="pl-2">pipeline.dispatch("DEPLOY");</div>
                <div>&#125;;</div>
              </div>
              <div className="w-1.5 h-16 bg-brand-muted/20 rounded-full relative overflow-hidden">
                <motion.div 
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent to-brand-orange"
                />
              </div>
              <div className="w-[30%] h-12 rounded border border-brand-orange/20 flex items-center justify-center text-[10px] font-semibold text-brand-orange bg-brand-orange/5">
                ACTIVE
              </div>
            </div>
          </BentoCard>

          {/* Card 5: Mobile Systems (Parallax offset: extra fast up) */}
          <BentoCard
            title="Mobile Platforms"
            category="Cross-Device"
            description="Adaptive layouts structured for tactile interactions with smooth gesture interfaces and native optimizations."
            icon={<Smartphone className="w-6 h-6" />}
            gridClass="md:col-span-1 lg:col-span-1"
            yOffset={[-50, 50]}
          >
            {/* Custom Graphic: Smartphone shell preview */}
            <div className="relative w-24 h-40 mt-8 rounded-t-xl border-x border-t border-brand-text/20 bg-brand-black flex flex-col p-1.5 gap-2">
              <div className="w-8 h-2 rounded bg-brand-text/20 mx-auto" />
              <div className="flex-1 rounded-t bg-brand-surface border border-brand-text/5 flex flex-col p-2 gap-1.5">
                <div className="w-full h-1/2 rounded bg-brand-orange/15 border border-brand-orange/25" />
                <div className="h-2 w-full bg-brand-muted/20 rounded" />
                <div className="h-2 w-2/3 bg-brand-muted/20 rounded" />
              </div>
            </div>
          </BentoCard>

          {/* Card 6: Growth (Parallax offset: slow down) */}
          <BentoCard
            title="Growth Systems"
            category="Velocity"
            description="High-velocity user funnel designs, structural analytics setups, and visual telemetry dashboards."
            icon={<TrendingUp className="w-6 h-6" />}
            gridClass="md:col-span-2 lg:col-span-2"
            yOffset={[15, -15]}
          >
            {/* Custom Graphic: Data growth timeline */}
            <div className="w-full h-full flex items-center justify-between px-10">
              <div className="flex flex-col text-left">
                <span className="text-3xl font-black text-brand-text tracking-tight group-hover:text-brand-orange transition-colors">
                  +340%
                </span>
                <span className="text-[10px] font-mono text-brand-muted tracking-wider uppercase">
                  Telemetry Scale
                </span>
              </div>
              <div className="w-40 h-16 flex items-end gap-1.5 relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
                  <path d="M0,35 Q25,25 50,20 T100,5" fill="none" stroke="rgba(255, 107, 0, 0.4)" strokeWidth="2" />
                  <path d="M0,35 Q25,25 50,20 T100,5 L100,40 L0,40 Z" fill="url(#orangeGrad)" opacity="0.1" />
                  <defs>
                    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute right-0 top-1 w-2 h-2 rounded-full bg-brand-orange orange-glow-sm" />
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
