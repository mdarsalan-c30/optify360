"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Code2, Search, Cpu, RefreshCw, Smartphone, TrendingUp, Sparkles } from "lucide-react";

interface BentoCardProps {
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  gridClass: string;
  children?: React.ReactNode;
}

function BentoCard({ title, category, description, icon, gridClass, children }: BentoCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.01] p-8 flex flex-col justify-between backdrop-blur-2xl transition-all duration-500 hover:border-brand-orange/30 hover:bg-white/[0.03] shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${gridClass}`}
    >
      {/* Glow highlight behind card content */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-brand-orange/0 via-brand-orange/0 to-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Top row */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-surface border border-white/5 text-brand-orange group-hover:border-brand-orange/30 group-hover:text-brand-dark-orange transition-all duration-300">
            {icon}
          </div>
          <span className="text-[10px] font-mono text-brand-muted tracking-widest uppercase bg-brand-black/60 px-3 py-1 rounded-full border border-white/[0.05]">
            {category}
          </span>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-brand-text mb-2 group-hover:text-brand-orange transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
          {description}
        </p>
      </div>

      {/* Embedded interactive graphic */}
      <div className="relative z-10 w-full mt-8 h-40 flex items-center justify-center overflow-hidden rounded-2xl bg-brand-black/40 border border-white/[0.05]">
        {children}
      </div>
    </div>
  );
}

export default function BentoServices() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      id="capabilities"
      ref={containerRef}
      className="relative w-full bg-brand-black px-6 py-32 overflow-hidden md:px-12 lg:px-24"
    >
      {/* Background space lighting */}
      <div className="absolute inset-0 pointer-events-none radial-dark" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-orange/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-dark-orange/5 blur-3xl pointer-events-none rounded-full" />

      {/* Top divider line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-brand-orange tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Capabilities &amp; Growth Engine
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-brand-text mb-6">
            Bespoke Digital Systems <br />
            <span className="text-gradient">Designed for Revenue</span>
          </h2>
          <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
            We avoid generic templates and bloated plugins. We build raw, ultra-fast web architectures, 
            search system indexations, and automation pipelines tailored for premium agencies.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* Card 1: Web Systems */}
          <BentoCard
            title="Web Engineering"
            category="Frontend / Platform"
            description="Highly responsive Next.js web applications styled with raw CSS/Tailwind, compiling statically with zero layouts shift."
            icon={<Code2 className="w-5 h-5" />}
            gridClass="md:col-span-2 lg:col-span-2"
          >
            {/* Visual Graphic: Code box terminal */}
            <div className="w-full h-full px-6 flex items-center justify-between relative select-none">
              <div className="w-[55%] flex flex-col gap-2 bg-brand-surface/90 p-4 rounded-xl border border-white/[0.06] shadow-2xl font-mono text-[9px] text-[#A0A0A0]">
                <div className="flex gap-1.5 items-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#FF4E00]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFB800]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-brand-orange">&lt;<span className="text-brand-text">AccretionCore</span>/&gt;</div>
                <div className="pl-3 text-emerald-500">status=&quot;active&quot;</div>
                <div className="pl-3 text-brand-text">metrics=&#123;99&#125;</div>
                <div className="pl-3">latency=&quot;14ms&quot;</div>
              </div>
              
              {/* Spinning core graph */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-brand-orange/20 border-dashed animate-spin-slow flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-brand-orange/10 flex items-center justify-center text-[10px] font-mono text-brand-orange tracking-widest">
                  EDGE: OK
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: SEO Engine */}
          <BentoCard
            title="SEO Engine Tuning"
            category="Search Optics"
            description="Structural indexation blueprint mapping page-by-page semantic schemas directly into the HTML document root."
            icon={<Search className="w-5 h-5" />}
            gridClass="md:col-span-1 lg:col-span-1"
          >
            {/* Visual Graphic: SEO growth graph */}
            <div className="relative w-full h-full flex items-center justify-center select-none">
              <div className="absolute inset-x-6 bottom-4 h-16 flex items-end justify-between gap-2">
                {[45, 60, 52, 75, 65, 90, 100].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t ${i === 6 ? 'bg-gradient-to-t from-brand-orange to-brand-dark-orange orange-glow-sm' : 'bg-white/[0.04]'}`}
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute top-4 right-6 text-3xl font-black font-mono text-brand-orange">
                100
              </div>
            </div>
          </BentoCard>

          {/* Card 3: AI workflows */}
          <BentoCard
            title="AI Workflows"
            category="Cognition"
            description="Agentic automation routes utilizing large language models and vector data matching to run CRM operations."
            icon={<Cpu className="w-5 h-5" />}
            gridClass="md:col-span-1 lg:col-span-1"
          >
            {/* Visual Graphic: Interactive nodes */}
            <div className="relative w-full h-full flex items-center justify-center select-none">
              <svg className="w-36 h-20" viewBox="0 0 100 60">
                <path d="M10,30 L50,15 L90,30 L50,45 Z" fill="none" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="0.8" />
                <path d="M50,15 L50,45" fill="none" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="0.8" />
                <path d="M10,30 L90,30" fill="none" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="0.8" />
                <circle cx="10" cy="30" r="3" fill="#8E8E93" />
                <circle cx="90" cy="30" r="3" fill="#8E8E93" />
                <circle cx="50" cy="15" r="4.5" fill="#FF8C42" className="animate-pulse" />
                <circle cx="50" cy="45" r="4.5" fill="#FF6B00" className="animate-pulse" />
                <circle cx="50" cy="30" r="6" fill="#FF6B00" />
              </svg>
            </div>
          </BentoCard>

          {/* Card 4: Automations */}
          <BentoCard
            title="API & Automations"
            category="Integrations"
            description="Headless API hooks synchronizing content databases, leads calculations, and CRM platforms automatically."
            icon={<RefreshCw className="w-5 h-5 animate-spin-slow" />}
            gridClass="md:col-span-2 lg:col-span-2"
          >
            {/* Visual Graphic: Code loop sync */}
            <div className="w-full h-full flex items-center justify-around px-8 gap-4 select-none">
              <div className="w-1/2 font-mono text-[9px] text-[#A0A0A0] flex flex-col gap-1 text-left">
                <div>const dispatch = async () =&gt; &#123;</div>
                <div className="text-brand-orange pl-3">await client.lead.sync(data);</div>
                <div className="pl-3">email.notify("Md Arsalan");</div>
                <div>&#125;;</div>
              </div>
              <div className="w-[1px] h-16 bg-white/10 rounded-full relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent to-brand-orange animate-bounce" />
              </div>
              <div className="px-4 py-2 rounded border border-brand-orange/20 text-[10px] font-mono tracking-widest text-brand-orange bg-brand-orange/5">
                DISPATCHED
              </div>
            </div>
          </BentoCard>

          {/* Card 5: Mobile Systems */}
          <BentoCard
            title="Tactile Mobiles"
            category="Cross-Device"
            description="Fully responsive interface systems engineered for smooth touch gestures and adaptive spacing."
            icon={<Smartphone className="w-5 h-5" />}
            gridClass="md:col-span-1 lg:col-span-1"
          >
            {/* Visual Graphic: Phone shell */}
            <div className="relative w-28 h-40 mt-8 rounded-t-2xl border-x border-t border-white/10 bg-brand-black flex flex-col p-2 gap-2 select-none">
              <div className="w-8 h-1.5 rounded-full bg-white/10 mx-auto" />
              <div className="flex-1 rounded-t-lg bg-brand-surface border border-white/[0.05] flex flex-col p-2 gap-2">
                <div className="w-full h-1/2 rounded bg-brand-orange/10 border border-brand-orange/20" />
                <div className="h-1.5 w-full bg-white/5 rounded" />
                <div className="h-1.5 w-2/3 bg-white/5 rounded" />
              </div>
            </div>
          </BentoCard>

          {/* Card 6: Growth Systems */}
          <BentoCard
            title="Digital Growth Systems"
            category="Revenue"
            description="Integrated lead capture, budget estimation cockpits, and visual funnel metrics built to scale business results."
            icon={<TrendingUp className="w-5 h-5" />}
            gridClass="md:col-span-2 lg:col-span-2"
          >
            {/* Visual Graphic: Accretion chart */}
            <div className="w-full h-full flex items-center justify-between px-10 select-none">
              <div className="flex flex-col text-left">
                <span className="text-3xl font-black text-brand-text tracking-tighter group-hover:text-brand-orange transition-colors">
                  +340%
                </span>
                <span className="text-[10px] font-mono text-brand-muted tracking-widest uppercase">
                  Growth Scale
                </span>
              </div>
              <div className="w-44 h-16 flex items-end gap-1.5 relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
                  <path d="M0,35 Q25,25 50,18 T100,5" fill="none" stroke="rgba(255, 107, 0, 0.4)" strokeWidth="1.5" />
                  <path d="M0,35 Q25,25 50,18 T100,5 L100,40 L0,40 Z" fill="url(#orangeGrad)" opacity="0.1" />
                  <defs>
                    <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute right-0 top-1 w-1.5 h-1.5 rounded-full bg-brand-orange orange-glow-sm" />
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
