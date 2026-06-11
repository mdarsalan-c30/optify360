"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageSquare, Quote, Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  metric: string;
  metricLabel: string;
}

const column1Testimonials: Testimonial[] = [
  {
    quote: "BLACKHOLE rebuilt our API gateway and web structures from the floor up. System query latency decreased by 74%, and our frontend animations feel completely native.",
    author: "Elena Rostova",
    role: "Chief Technology Officer",
    company: "VORTEX.IO",
    metric: "-74% latency",
    metricLabel: "Query Speed Audit"
  },
  {
    quote: "Their AI workflow pipelines changed how we index system schemas. What used to take days of manual scripting now runs automatically on client edge nodes.",
    author: "Devon Kincaid",
    role: "Director of Operations",
    company: "AETHER LABS",
    metric: "12x speedup",
    metricLabel: "Deployment Flow"
  }
];

const column2Testimonials: Testimonial[] = [
  {
    quote: "The Bento Layout systems and interactive visual cues they delivered are phenomenal. True design luxury backed by rock-solid frontend mechanics.",
    author: "Marcus Vance",
    role: "VP of Digital Products",
    company: "SPECTRE GROUP",
    metric: "+82% CR",
    metricLabel: "Conversion Optics"
  },
  {
    quote: "The custom mouse-reactive visual assets have given our brand a defining identity. Customers constantly reference the premium layout dynamics.",
    author: "Akiko Tanaka",
    role: "Founder & Architect",
    company: "NEXUS NETWORKS",
    metric: "40% engagement",
    metricLabel: "Interaction Scale"
  }
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Track scroll position of the testimonials section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Opposite directions of columns parallax shifts - only on desktop
  const yCol1Val = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yCol2Val = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const yCol1 = isDesktop ? yCol1Val : 0;
  const yCol2 = isDesktop ? yCol2Val : 0;

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-brand-black px-6 py-32 overflow-hidden md:px-12 lg:px-24"
    >
      {/* Separator borders */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Decorative Atmosphere */}
      <div className="absolute inset-0 radial-dark pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-24 text-left">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-brand-orange tracking-widest uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            Ecosystem Reviews &amp; Telemetry
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-brand-text mb-6 font-heading leading-none">
            System Performance <br />
            <span className="text-gradient">Endorsed by Engineers</span>
          </h2>
          <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-2xl font-sans">
            Read what client operators and product managers report about our custom Next.js integrations, 
            schema maps, and response speed indexes.
          </p>
        </div>

        {/* Dual Parallax Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Column 1 */}
          <motion.div style={{ y: yCol1 }} className="flex flex-col gap-8">
            {column1Testimonials.map((t, idx) => (
              <TestimonialCard key={idx} testimonial={t} />
            ))}
          </motion.div>

          {/* Column 2 */}
          <motion.div style={{ y: yCol2 }} className="flex flex-col gap-8 mt-0 lg:mt-12">
            {column2Testimonials.map((t, idx) => (
              <TestimonialCard key={idx} testimonial={t} />
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.05] bg-white/[0.01] p-8 md:p-10 backdrop-blur-2xl group hover:border-brand-orange/30 hover:bg-white/[0.02] transition-all duration-500 shadow-[0_15px_35px_rgba(0,0,0,0.3)]">
      
      {/* Top glowing edge */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Quote symbol */}
      <Quote className="absolute right-8 top-8 w-16 h-16 text-brand-text/[0.01] pointer-events-none" />

      {/* Stars and Metric */}
      <div className="flex justify-between items-center mb-8 select-none">
        <div className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange orange-glow-sm" />
          ))}
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-brand-orange font-mono tracking-tight leading-none mb-1">{testimonial.metric}</div>
          <div className="text-[9px] text-[#8E8E93] font-mono uppercase tracking-widest">{testimonial.metricLabel}</div>
        </div>
      </div>

      {/* Quote */}
      <p className="text-brand-text text-base md:text-lg leading-relaxed font-sans mb-8">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author Details */}
      <div className="flex items-center gap-3 border-t border-white/[0.05] pt-6 select-none">
        <div className="w-9 h-9 rounded-full bg-brand-surface border border-white/5 flex items-center justify-center text-brand-orange font-mono text-xs font-bold shadow-md">
          {testimonial.author.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <h4 className="text-sm font-bold text-brand-text font-heading">{testimonial.author}</h4>
          <p className="text-[11px] font-mono text-brand-muted">
            {testimonial.role} &middot; <span className="text-brand-orange">{testimonial.company}</span>
          </p>
        </div>
      </div>

    </div>
  );
}
