"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Code2, Globe, Cpu, ArrowRight } from "lucide-react";

interface Project {
  num: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  color: string;
  bgGlow: string;
}

const projects: Project[] = [
  {
    num: "01",
    title: "VORTEX BLOCKCHAIN ENGINE",
    category: "Web3 Systems / Fintech",
    description: "A real-time telemetry dashboard and high-frequency trading platform built on a custom Next.js layer with zero-latency visual rendering.",
    tech: ["Next.js 16", "Framer Motion", "Rust Core", "WebSockets"],
    color: "from-brand-orange to-brand-dark-orange",
    bgGlow: "rgba(255, 107, 0, 0.08)"
  },
  {
    num: "02",
    title: "AETHER AUTOMATION MATRIX",
    category: "AI Operations / CRM",
    description: "An agentic neural workflow mapping pipeline that synchronizes developer cycles and visualizes asset compilation across multiple cloud databases.",
    tech: ["React 19", "Python API", "Tailwind v4", "Docker"],
    color: "from-brand-dark-orange to-[#FFB800]",
    bgGlow: "rgba(255, 140, 66, 0.08)"
  },
  {
    num: "03",
    title: "SPECTRE DIGITAL ECOSYSTEM",
    category: "Luxury E-Commerce",
    description: "Full headless architecture for a luxury fashion house, featuring localized checkout channels, bespoke 3D product visualizers, and swift speeds.",
    tech: ["Next.js Headless", "GraphQL", "Three.js", "Tailwind CSS"],
    color: "from-[#FF4E00] to-brand-orange",
    bgGlow: "rgba(255, 78, 0, 0.08)"
  },
  {
    num: "04",
    title: "HYPERION TELEMETRY APP",
    category: "Mobile Performance / IoT",
    description: "Cross-platform core engine managing visual telematics and server response mappings for next-generation automated vehicle fleets.",
    tech: ["React Native", "Swift Core", "Node.js", "Redis"],
    color: "from-brand-orange to-[#FF0055]",
    bgGlow: "rgba(255, 0, 85, 0.08)"
  }
];

export default function HorizontalScrollPortfolio() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track the vertical scroll of the parent container
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  });

  // Map vertical scroll progress (0 to 1) to horizontal translation (0% to -75%)
  // Since we have 4 projects, shifting by 75% of the total width (400vw) shows slides 1, 2, 3, and 4.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <div ref={scrollRef} className="relative h-[300vh] bg-brand-black">
      {/* Sticky viewport wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        {/* Horizontal scroll track */}
        <motion.div style={{ x }} className="flex h-full w-[400vw]">
          
          {projects.map((project, index) => (
            <section
              key={index}
              className="relative w-screen max-w-full h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 py-16 bg-brand-black select-none border-r border-brand-text/5 overflow-hidden flex-shrink-0"
              style={{
                background: `radial-gradient(circle at 70% 50%, ${project.bgGlow} 0%, transparent 60%)`
              }}
            >
              {/* Glowing background grid lines */}
              <div className="absolute inset-0 glowing-grid opacity-30 pointer-events-none" />

              {/* Large project number background */}
              <div className="absolute right-10 bottom-10 lg:right-24 lg:bottom-12 text-[15rem] sm:text-[20rem] lg:text-[28rem] font-black text-brand-text/[0.02] font-mono leading-none pointer-events-none">
                {project.num}
              </div>

              {/* Project Layout Details */}
              <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Left column: content */}
                <div className="lg:col-span-6 flex flex-col items-start">
                  
                  {/* Category and Index */}
                  <div className="flex items-center gap-3 mb-6 text-xs font-mono tracking-widest text-brand-orange uppercase">
                    <span className="px-2 py-0.5 rounded bg-brand-orange/15 border border-brand-orange/30">
                      {project.num}
                    </span>
                    <span>{project.category}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-text tracking-tight mb-8 leading-tight">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-brand-muted text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                    {project.description}
                  </p>

                  {/* Tech stack items */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-lg border border-brand-text/5 bg-brand-surface/60 text-xs font-mono text-brand-text"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Call to action */}
                  <button className="group flex items-center gap-2 text-brand-orange font-semibold tracking-wide hover:text-brand-dark-orange transition-colors">
                    View Technical Breakdown 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right column: Graphic preview simulating a headless application UI */}
                <div className="lg:col-span-6 flex items-center justify-center">
                  <div className="relative w-full max-w-lg aspect-video rounded-xl border border-brand-text/10 bg-brand-surface/60 p-4 shadow-2xl backdrop-blur-md overflow-hidden group/card hover:border-brand-orange/20 transition-colors duration-500">
                    
                    {/* Header bar of simulated browser */}
                    <div className="flex items-center justify-between mb-4 border-b border-brand-text/5 pb-3">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-text/15" />
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-text/15" />
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-text/15" />
                      </div>
                      <div className="text-[10px] font-mono text-brand-muted/50 px-4 py-0.5 rounded bg-brand-black/40 border border-brand-text/5">
                        https://api.blackhole.agency/v1/{project.title.toLowerCase().replace(/ /g, "-")}
                      </div>
                      <Code2 className="w-3.5 h-3.5 text-brand-muted/40" />
                    </div>

                    {/* Content area: Grid of code and components */}
                    <div className="grid grid-cols-3 gap-3 h-full pb-4">
                      
                      {/* Left sub-box */}
                      <div className="col-span-2 rounded bg-brand-black/40 border border-brand-text/5 p-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="h-2 w-12 bg-brand-orange/30 rounded" />
                          <div className="h-1.5 w-full bg-brand-muted/20 rounded" />
                          <div className="h-1.5 w-5/6 bg-brand-muted/20 rounded" />
                          <div className="h-1.5 w-4/6 bg-brand-muted/20 rounded" />
                        </div>
                        <div className="h-16 w-full rounded bg-gradient-to-r from-brand-orange/5 via-brand-orange/20 to-brand-dark-orange/5 border border-brand-orange/20 flex items-center justify-center">
                          <span className="text-[10px] font-mono text-brand-orange tracking-widest animate-pulse">RENDERING SHADERS...</span>
                        </div>
                      </div>

                      {/* Right sub-box */}
                      <div className="col-span-1 rounded bg-brand-black/40 border border-brand-text/5 p-3 flex flex-col justify-between items-center text-center">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${project.color} flex items-center justify-center text-brand-black font-mono text-xs font-black`}>
                          H-1
                        </div>
                        <div className="w-full space-y-1">
                          <div className="h-1 w-full bg-brand-muted/15 rounded" />
                          <div className="h-1 w-full bg-brand-muted/15 rounded" />
                          <div className="h-1 w-2/3 bg-brand-muted/15 rounded mx-auto" />
                        </div>
                      </div>

                    </div>

                    {/* Hover scanline effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-orange/[0.02] to-transparent -translate-y-full group-hover/card:translate-y-full transition-transform [animation-duration:3s] [animation-iteration-count:infinite] pointer-events-none" />
                  </div>
                </div>

              </div>
            </section>
          ))}
          
        </motion.div>
      </div>
    </div>
  );
}
