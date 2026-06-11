"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Code2, Globe, Cpu, CheckCircle2 } from "lucide-react";

interface Project {
  num: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  metrics: { label: string; val: string }[];
  color: string;
  bgGlow: string;
}

const projects: Project[] = [
  {
    num: "01",
    title: "CLIMATEVERSE DATA ENGINE",
    category: "Geospatial / Data Science",
    description: "Re-engineered data rendering pipelines to support real-time geospatial visualizations at scale, achieving zero rendering lag on mobile devices.",
    tech: ["Next.js", "WebGL Shaders", "R-Tree Indexing", "Binary Streaming"],
    metrics: [
      { label: "Rendering Speed", val: "60 FPS" },
      { label: "Bandwidth Saved", val: "50%" },
    ],
    color: "from-brand-orange to-brand-dark-orange",
    bgGlow: "rgba(255, 107, 0, 0.06)"
  },
  {
    num: "02",
    title: "PDFVERSE AI DATABASE",
    category: "AI Operations / Document Vector",
    description: "Designed a vector matching document catalog that parses system schemas and searches database records with sub-second retrieval times.",
    tech: ["React 19", "Python API", "Tailwind CSS v4", "Docker"],
    metrics: [
      { label: "Query Speed", val: "<0.9s" },
      { label: "Lead Pipeline", val: "+82%" },
    ],
    color: "from-brand-dark-orange to-[#FFB800]",
    bgGlow: "rgba(255, 140, 66, 0.06)"
  },
  {
    num: "03",
    title: "MYNRA DIGITAL PORTAL",
    category: "E-Commerce / Headless Architecture",
    description: "Full headless architecture for a luxury shopping platform, utilizing centralized query servers to minimize layout shift.",
    tech: ["GraphQL", "Next.js Headless", "Three.js", "AWS CDN"],
    metrics: [
      { label: "Load Time", val: "1.1s" },
      { label: "Engagement", val: "+40%" },
    ],
    color: "from-[#FF4E00] to-brand-orange",
    bgGlow: "rgba(255, 78, 0, 0.06)"
  },
  {
    num: "04",
    title: "STUDYCUBS MULTIPLAYER",
    category: "EdTech / Real-time Lobbies",
    description: "Cross-platform core engine managing visual telematics and server response mappings for next-generation automated vehicle fleets.",
    tech: ["Node.js", "Redis Lobbies", "WebSockets", "Canvas API"],
    metrics: [
      { label: "Live Lobbies", val: "10k+" },
      { label: "Response Delay", val: "14ms" },
    ],
    color: "from-brand-orange to-[#FF0055]",
    bgGlow: "rgba(255, 0, 85, 0.06)"
  }
];

export default function HorizontalScrollPortfolio() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
  });

  // Since we have 4 projects, translating by 75% of the total width (400vw) shows slides 1, 2, 3, and 4.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  if (!isDesktop) {
    return (
      <div id="showcase" className="relative bg-brand-black py-24 px-6 md:px-12 w-full overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute inset-0 radial-dark pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-orange/[0.01] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-20 relative z-10 select-none">
          {/* Header */}
          <div className="text-left mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] font-mono text-brand-orange mb-6 uppercase tracking-widest">
              Selected Growth Systems
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-brand-text mb-6 font-heading tracking-tighter leading-none">
              Proven Digital Systems <br />
              <span className="text-gradient">Shipped for Impact</span>
            </h2>
            <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              Explore our real-world integrations, high-performance architectures, and conversion results.
            </p>
          </div>

          {/* Project Cards stack */}
          <div className="flex flex-col gap-12">
            {projects.map((project, index) => (
              <div
                key={index}
                className="relative rounded-3xl border border-white/[0.05] bg-white/[0.01] p-6 sm:p-10 md:p-12 overflow-hidden flex flex-col gap-8"
                style={{
                  background: `radial-gradient(circle at 90% 10%, ${project.bgGlow} 0%, transparent 60%)`
                }}
              >
                {/* Background Grid */}
                <div className="absolute inset-0 glowing-grid opacity-15 pointer-events-none" />

                {/* Outlined project number background */}
                <div className="absolute right-6 top-6 text-7xl sm:text-9xl font-black text-white/[0.015] font-heading leading-none pointer-events-none select-none">
                  {project.num}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="lg:col-span-7 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-4 text-xs font-mono tracking-widest text-brand-orange uppercase">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[9px] font-bold">
                        CASE {project.num}
                      </span>
                      <span>{project.category}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-text mb-4 font-heading tracking-tight leading-none">
                      {project.title}
                    </h3>

                    <p className="text-brand-muted text-xs sm:text-sm leading-relaxed mb-6 max-w-xl font-sans">
                      {project.description}
                    </p>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
                      {project.metrics.map((m, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-white/[0.05] bg-white/[0.01] flex flex-col">
                          <span className="text-xl font-bold font-heading text-brand-orange leading-none mb-1">{m.val}</span>
                          <span className="text-[9px] font-mono tracking-wider text-brand-muted uppercase">{m.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-8">
                      {project.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-[9px] font-mono text-brand-text"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* CTA link */}
                    <a
                      href={`/case-studies/${project.title.toLowerCase().replace(/ /g, "-").replace("-data-engine", "").replace("-ai-database", "").replace("-digital-portal", "").replace("-multiplayer", "")}`}
                      className="group flex items-center gap-2 text-brand-orange font-semibold text-xs tracking-wider hover:text-brand-dark-orange transition-colors"
                    >
                      View Interactive Case Study
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  {/* Visual Frame */}
                  <div className="lg:col-span-5 flex items-center justify-center">
                    <div className="relative w-full aspect-video rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 shadow-2xl backdrop-blur-2xl overflow-hidden group/card hover:border-brand-orange/30 transition-all duration-500">
                      
                      <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-3">
                        <div className="flex gap-1.5 items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-mono text-[#8E8E93] px-4 py-0.5 rounded-full bg-brand-black/55 border border-white/[0.05]">
                          https://api.optify360.com/{project.title.toLowerCase().replace(/ /g, "-")}
                        </div>
                        <Code2 className="w-3.5 h-3.5 text-white/20" />
                      </div>

                      <div className="grid grid-cols-3 gap-3 h-full pb-4">
                        <div className="col-span-2 rounded-xl bg-brand-black/40 border border-white/[0.05] p-4 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="h-2 w-12 bg-brand-orange/30 rounded" />
                            <div className="h-1.5 w-full bg-white/5 rounded" />
                            <div className="h-1.5 w-[85%] bg-white/5 rounded" />
                          </div>
                          <div className="h-10 w-full rounded-lg bg-gradient-to-r from-brand-orange/5 via-brand-orange/15 to-brand-dark-orange/5 border border-brand-orange/20 flex items-center justify-center">
                            <span className="text-[8px] font-mono text-brand-orange tracking-widest animate-pulse">RENDER ACTIVE</span>
                          </div>
                        </div>

                        <div className="col-span-1 rounded-xl bg-brand-black/40 border border-white/[0.05] p-4 flex flex-col justify-between items-center text-center">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${project.color} flex items-center justify-center text-brand-black font-mono text-[8px] font-black`}>
                            SYS
                          </div>
                          <div className="w-full space-y-1">
                            <div className="h-1 w-full bg-white/5 rounded" />
                            <div className="h-1 w-[70%] bg-white/5 rounded mx-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="showcase" ref={scrollRef} className="relative h-[350vh] bg-brand-black w-full overflow-hidden">
      {/* Sticky viewport wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        {/* Horizontal scroll track */}
        <motion.div style={{ x }} className="flex h-full w-[400vw]">
          
          {projects.map((project, index) => (
            <section
              key={index}
              className="relative w-screen max-w-full h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 py-16 bg-brand-black select-none border-r border-white/[0.04] overflow-hidden flex-shrink-0"
              style={{
                background: `radial-gradient(circle at 75% 50%, ${project.bgGlow} 0%, transparent 70%)`
              }}
            >
              {/* Glowing background grid lines */}
              <div className="absolute inset-0 glowing-grid opacity-20 pointer-events-none" />

              {/* Large project number background */}
              <div className="absolute right-12 bottom-12 lg:right-24 lg:bottom-12 text-[15rem] sm:text-[22rem] lg:text-[30rem] font-black text-white/[0.01] font-heading leading-none pointer-events-none tracking-tighter">
                {project.num}
              </div>

              <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                
                {/* Left column: Content info */}
                <div className="lg:col-span-6 flex flex-col items-start">
                  
                  {/* Category and Index */}
                  <div className="flex items-center gap-3 mb-6 text-xs font-mono tracking-widest text-brand-orange uppercase">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[10px]">
                      CASE {project.num}
                    </span>
                    <span>{project.category}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-text tracking-tighter mb-6 font-heading leading-none">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-sans">
                    {project.description}
                  </p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                    {project.metrics.map((m, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-white/[0.05] bg-white/[0.01] flex flex-col">
                        <span className="text-2xl font-bold font-heading text-brand-orange leading-none mb-1">{m.val}</span>
                        <span className="text-[10px] font-mono tracking-wider text-brand-muted uppercase">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded bg-white/[0.03] border border-white/[0.05] text-[10px] font-mono text-brand-text"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* CTA link */}
                  <a 
                    href={`/case-studies/${project.title.toLowerCase().replace(/ /g, "-").replace("-data-engine", "").replace("-ai-database", "").replace("-digital-portal", "").replace("-multiplayer", "")}`}
                    className="group flex items-center gap-2 text-brand-orange font-semibold text-sm tracking-wider hover:text-brand-dark-orange transition-colors"
                  >
                    View Interactive Case Study 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Right column: Glass browser frame visual */}
                <div className="lg:col-span-6 flex items-center justify-center">
                  <div className="relative w-full max-w-lg aspect-video rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 shadow-2xl backdrop-blur-2xl overflow-hidden group/card hover:border-brand-orange/30 transition-all duration-500">
                    
                    {/* Header bar of simulated browser */}
                    <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-3">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      </div>
                      <div className="text-[9px] font-mono text-[#8E8E93] px-4 py-0.5 rounded-full bg-brand-black/55 border border-white/[0.05]">
                        https://api.optify360.com/{project.title.toLowerCase().replace(/ /g, "-")}
                      </div>
                      <Code2 className="w-3.5 h-3.5 text-white/20" />
                    </div>

                    {/* Content area: Grid of code and components */}
                    <div className="grid grid-cols-3 gap-3 h-full pb-4 select-none">
                      
                      {/* Left sub-box */}
                      <div className="col-span-2 rounded-xl bg-brand-black/40 border border-white/[0.05] p-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="h-2 w-12 bg-brand-orange/30 rounded" />
                          <div className="h-1.5 w-full bg-white/5 rounded" />
                          <div className="h-1.5 w-[85%] bg-white/5 rounded" />
                        </div>
                        <div className="h-12 w-full rounded-lg bg-gradient-to-r from-brand-orange/5 via-brand-orange/15 to-brand-dark-orange/5 border border-brand-orange/20 flex items-center justify-center">
                          <span className="text-[9px] font-mono text-brand-orange tracking-widest animate-pulse">RENDER PIPELINE ACTIVE</span>
                        </div>
                      </div>

                      {/* Right sub-box */}
                      <div className="col-span-1 rounded-xl bg-brand-black/40 border border-white/[0.05] p-4 flex flex-col justify-between items-center text-center">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${project.color} flex items-center justify-center text-brand-black font-mono text-[10px] font-black`}>
                          SYS
                        </div>
                        <div className="w-full space-y-1">
                          <div className="h-1 w-full bg-white/5 rounded" />
                          <div className="h-1 w-[70%] bg-white/5 rounded mx-auto" />
                        </div>
                      </div>

                    </div>

                    {/* Scanline effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-orange/[0.01] to-transparent -translate-y-full group-hover/card:translate-y-full transition-transform [animation-duration:3.5s] [animation-iteration-count:infinite] pointer-events-none" />
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
