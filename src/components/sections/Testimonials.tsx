"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageSquare, Quote, Star, Sparkles } from "lucide-react";

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
  
  // Track scroll position of the testimonials section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Opposite directions of columns parallax shifts
  const yCol1 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const yCol2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-brand-black px-6 py-32 overflow-hidden md:px-12 lg:px-24"
    >
      {/* Separator borders */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-text/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-text/10 to-transparent" />

      {/* Decorative Atmosphere */}
      <div className="absolute inset-0 radial-dark pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="max-w-3xl mb-20 text-left">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-brand-orange tracking-wider uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            Ecosystem Telemetry & Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text mb-6">
            System Performance <br />
            <span className="text-gradient">Endorsed by Engineers</span>
          </h2>
          <p className="text-brand-muted text-base sm:text-lg leading-relaxed">
            Read what client operators say about our custom digital system installations, 
            interactive engineering, and performance parameters.
          </p>
        </div>

        {/* Dual Parallax Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Column 1: Shifts downwards relative to scroll */}
          <motion.div style={{ y: yCol1 }} className="flex flex-col gap-8">
            {column1Testimonials.map((t, idx) => (
              <TestimonialCard key={idx} testimonial={t} />
            ))}
          </motion.div>

          {/* Column 2: Shifts upwards relative to scroll */}
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
    <div className="relative overflow-hidden rounded-2xl border border-brand-text/10 bg-brand-surface/40 p-8 md:p-10 backdrop-blur-md group hover:border-brand-orange/30 transition-all duration-500">
      
      {/* Top glowing edge */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Quote symbol */}
      <Quote className="absolute right-8 top-8 w-16 h-16 text-brand-text/[0.02] pointer-events-none" />

      {/* Stars and Metric */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
          ))}
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-brand-orange font-mono tracking-tight">{testimonial.metric}</div>
          <div className="text-[9px] text-brand-muted font-mono uppercase tracking-wider">{testimonial.metricLabel}</div>
        </div>
      </div>

      {/* Quote */}
      <p className="text-brand-text text-base md:text-lg leading-relaxed font-sans mb-8">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author Details */}
      <div className="flex items-center gap-3 border-t border-brand-text/5 pt-6">
        <div className="w-9 h-9 rounded-full bg-brand-black border border-brand-orange/30 flex items-center justify-center text-brand-orange font-mono text-xs font-bold">
          {testimonial.author.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <h4 className="text-sm font-bold text-brand-text">{testimonial.author}</h4>
          <p className="text-xs font-mono text-brand-muted">
            {testimonial.role} &middot; <span className="text-brand-orange">{testimonial.company}</span>
          </p>
        </div>
      </div>

    </div>
  );
}
