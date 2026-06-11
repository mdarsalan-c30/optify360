"use client";

import { useRef } from "react";
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
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.04] bg-white/[0.01] p-8 flex flex-col justify-between backdrop-blur-3xl transition-all duration-700 hover:border-brand-orange/40 hover:bg-white/[0.03] shadow-[0_15px_40px_rgba(0,0,0,0.4)] ${gridClass}`}
    >
      {/* Subtle hover glow layer */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-brand-orange/0 via-brand-orange/0 to-brand-orange/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Top row */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-surface border border-white/5 text-brand-orange group-hover:border-brand-orange/30 group-hover:text-brand-dark-orange transition-all duration-300">
            {icon}
          </div>
          <span className="text-[9px] font-mono text-brand-orange tracking-widest uppercase bg-brand-orange/5 px-3 py-1 rounded-full border border-brand-orange/15">
            {category}
          </span>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-brand-text mb-2 group-hover:text-brand-orange transition-colors duration-300 font-heading">
          {title}
        </h3>
        
        <p className="text-brand-muted text-xs sm:text-sm leading-relaxed max-w-sm font-sans">
          {description}
        </p>
      </div>

      {/* Graphic visual container */}
      <div className="relative z-10 w-full mt-8 h-44 flex items-center justify-center overflow-hidden rounded-2xl bg-[#050505] border border-white/[0.04]">
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
      {/* Background space glows */}
      <div className="absolute inset-0 pointer-events-none radial-dark" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-orange/[0.02] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-dark-orange/[0.02] blur-[150px] pointer-events-none rounded-full" />

      {/* Top divider */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-24">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-brand-orange tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Capabilities &amp; Growth Systems
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-brand-text mb-6 font-heading leading-none">
            Bespoke Digital Architectures <br />
            <span className="text-gradient">Engineered to Convert</span>
          </h2>
          <p className="text-brand-muted text-base leading-relaxed max-w-2xl font-sans">
            We operate at the convergence of custom high-performance React frameworks and 
            search engine optimizations. Here is the operational core of our digital growth systems.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* Card 1: Web Systems */}
          <BentoCard
            title="Web Engineering"
            category="Frontend / Core"
            description="Highly responsive Next.js web applications styled with raw CSS/Tailwind, compiling statically with zero layouts shift."
            icon={<Code2 className="w-5 h-5" />}
            gridClass="md:col-span-2 lg:col-span-2"
          >
            {/* Visual Graphic: Code box terminal with glowing radar */}
            <div className="w-full h-full px-6 flex items-center justify-between relative select-none">
              <div className="w-[58%] flex flex-col gap-2 bg-[#0a0a0a]/90 p-4 rounded-xl border border-white/[0.06] shadow-2xl font-mono text-[9px] text-brand-muted">
                <div className="flex gap-1.5 items-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#FF4E00]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFB800]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-brand-orange">&lt;<span className="text-brand-text">PlatformCore</span>/&gt;</div>
                <div className="pl-3 text-emerald-500">status=&quot;active&quot;</div>
                <div className="pl-3 text-brand-text">performance=&#123;100&#125;</div>
                <div className="pl-3">caching=&quot;edge&quot;</div>
              </div>
              
              {/* Spinning core radar */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full border border-brand-orange/20 border-dashed animate-spin-slow flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-brand-orange/10 flex items-center justify-center text-[10px] font-mono text-brand-orange tracking-widest">
                  100% OK
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: SEO Engine */}
          <BentoCard
            title="SEO Engine Tuning"
            category="Search Optics"
            description="Algorithmic optimization mapping and structural schemas built directly into the system's DNA."
            icon={<Search className="w-5 h-5" />}
            gridClass="md:col-span-1 lg:col-span-1"
          >
            {/* Visual Graphic: High-fidelity SEO growth graph */}
            <div className="relative w-full h-full flex items-center justify-center select-none bg-gradient-to-b from-transparent to-brand-orange/[0.02]">
              {/* Grid Background */}
              <div className="absolute inset-0 glowing-grid opacity-10" />
              
              {/* SVG Line Graph */}
              <svg className="w-5/6 h-24 z-10 overflow-visible" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="seoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,38 L15,35 L30,30 L45,28 L60,18 L75,10 L95,2" fill="none" stroke="#FF6B00" strokeWidth="1.5" className="orange-glow-sm" />
                <path d="M0,38 L15,35 L30,30 L45,28 L60,18 L75,10 L95,2 L95,40 L0,40 Z" fill="url(#seoGrad)" />
                <circle cx="95" cy="2" r="2" fill="#FF8C42" />
                <circle cx="75" cy="10" r="1.5" fill="#FF8C42" />
              </svg>
              
              <div className="absolute top-3 right-6 px-2.5 py-0.5 rounded bg-brand-orange/10 border border-brand-orange/25 text-[10px] font-mono text-brand-orange font-bold uppercase tracking-wider">
                Rank 1
              </div>
            </div>
          </BentoCard>

          {/* Card 3: AI workflows */}
          <BentoCard
            title="AI Automations"
            category="Cognition"
            description="Deep neural network routing and custom agentic microservices automating key visual operations."
            icon={<Cpu className="w-5 h-5" />}
            gridClass="md:col-span-1 lg:col-span-1"
          >
            {/* Visual Graphic: Pulsing Neural Nodes */}
            <div className="relative w-full h-full flex items-center justify-center select-none">
              <svg className="w-40 h-24" viewBox="0 0 100 60">
                {/* Connections */}
                <line x1="20" y1="30" x2="50" y2="15" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="0.8" />
                <line x1="20" y1="30" x2="50" y2="45" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="0.8" />
                <line x1="50" y1="15" x2="80" y2="30" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="0.8" />
                <line x1="50" y1="45" x2="80" y2="30" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="0.8" />
                <line x1="50" y1="15" x2="50" y2="45" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="0.8" />
                
                {/* Nodes */}
                <circle cx="20" cy="30" r="3" fill="#8E8E93" />
                <circle cx="80" cy="30" r="3" fill="#8E8E93" />
                
                {/* Pulsing Active Nodes */}
                <circle cx="50" cy="15" r="4.5" fill="#FF8C42" className="animate-pulse" />
                <circle cx="50" cy="45" r="4.5" fill="#FF6B00" className="animate-pulse" />
                
                {/* Core Node */}
                <circle cx="50" cy="30" r="6" fill="#FF6B00" className="orange-glow" />
              </svg>
            </div>
          </BentoCard>

          {/* Card 4: Automations */}
          <BentoCard
            title="Integrations &amp; Systems"
            category="Mechanics"
            description="Hyper-threaded APIs executing data pipelines, database syncs, and visual asset delivery workflows."
            icon={<RefreshCw className="w-5 h-5 animate-spin-slow" />}
            gridClass="md:col-span-2 lg:col-span-2"
          >
            {/* Visual Graphic: Active pipeline flow */}
            <div className="w-full h-full flex items-center justify-around px-8 gap-4 select-none">
              <div className="w-1/2 font-mono text-[9px] text-[#8E8E93] flex flex-col gap-1 text-left">
                <div>const sync = async () =&gt; &#123;</div>
                <div className="text-brand-orange pl-3">await firestore.sync(lead);</div>
                <div className="pl-3 text-emerald-500">resend.sendAlert();</div>
                <div>&#125;;</div>
              </div>
              
              {/* Pulsing loop path */}
              <div className="relative w-20 h-16 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden bg-brand-surface/30">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/5 via-transparent to-brand-orange/10 pointer-events-none" />
                <span className="text-[9px] font-mono text-brand-orange tracking-widest uppercase animate-pulse">SYNCING</span>
              </div>
            </div>
          </BentoCard>

          {/* Card 5: Mobile Systems */}
          <BentoCard
            title="Tactile Platforms"
            category="Mobile"
            description="Adaptive layouts structured for tactile interactions with smooth gesture interfaces and native optimizations."
            icon={<Smartphone className="w-5 h-5" />}
            gridClass="md:col-span-1 lg:col-span-1"
          >
            {/* Visual Graphic: Phone interface bezel preview */}
            <div className="relative w-28 h-40 mt-8 rounded-t-2xl border-x border-t border-white/[0.08] bg-brand-black flex flex-col p-2 gap-2 select-none shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
              <div className="w-8 h-1.5 rounded-full bg-white/10 mx-auto" />
              <div className="flex-1 rounded-t-lg bg-brand-surface border border-white/[0.04] flex flex-col p-2.5 gap-2">
                <div className="w-full h-1/2 rounded-md bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-brand-orange/15 animate-ping" />
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded" />
                <div className="h-1.5 w-2/3 bg-white/5 rounded" />
              </div>
            </div>
          </BentoCard>

          {/* Card 6: Growth Systems */}
          <BentoCard
            title="Growth Systems"
            category="Revenue"
            description="Integrated lead capture, budget estimation cockpits, and visual funnel metrics built to scale business results."
            icon={<TrendingUp className="w-5 h-5" />}
            gridClass="md:col-span-2 lg:col-span-2"
          >
            {/* Visual Graphic: Growth metrics scale */}
            <div className="w-full h-full flex items-center justify-between px-12 select-none">
              <div className="flex flex-col text-left">
                <span className="text-3xl font-black text-brand-text tracking-tighter group-hover:text-brand-orange transition-colors font-heading leading-none">
                  +340%
                </span>
                <span className="text-[10px] font-mono text-[#8E8E93] tracking-widest uppercase mt-1">
                  FUNNEL SCALE
                </span>
              </div>
              <div className="w-44 h-16 flex items-end gap-1.5 relative">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40">
                  <path d="M0,35 Q25,25 50,18 T100,5" fill="none" stroke="rgba(255, 107, 0, 0.4)" strokeWidth="1.5" />
                  <path d="M0,35 Q25,25 50,18 T100,5 L100,40 L0,40 Z" fill="url(#orangeGrad2)" opacity="0.1" />
                  <defs>
                    <linearGradient id="orangeGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute right-0 top-1 w-2.5 h-2.5 rounded-full bg-brand-orange orange-glow-sm" />
              </div>
            </div>
          </BentoCard>

        </div>
      </div>
    </section>
  );
}
