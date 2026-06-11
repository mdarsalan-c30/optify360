"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Shield, HardDrive, Target, Terminal } from "lucide-react";

interface Logo {
  name: string;
  icon: React.ReactNode;
}

const logos: Logo[] = [
  { name: "VORTEX.IO", icon: <Cpu className="w-4 h-4 text-brand-orange" /> },
  { name: "AETHER LABS", icon: <Zap className="w-4 h-4 text-brand-orange" /> },
  { name: "SPECTRE GROUP", icon: <Shield className="w-4 h-4 text-brand-orange" /> },
  { name: "HYPERION CORP", icon: <HardDrive className="w-4 h-4 text-brand-orange" /> },
  { name: "APEX COGNITION", icon: <Target className="w-4 h-4 text-brand-orange" /> },
  { name: "NEXUS NETWORKS", icon: <Terminal className="w-4 h-4 text-brand-orange" /> },
];

export default function TrustBar() {
  // Duplicate for smooth seamless wrapping
  const marqueeLogos = [...logos, ...logos, ...logos];

  return (
    <section className="relative w-full py-16 bg-brand-black/90 border-y border-brand-text/5 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 glowing-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-[11px] font-mono text-brand-orange tracking-[0.25em] uppercase">
          Trusted by Next-Generation Technological Frontrunners
        </p>
      </div>

      {/* Marquee Wrapper with side fades */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left Fade Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-brand-black to-transparent z-10 pointer-events-none" />
        
        {/* Right Fade Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-brand-black to-transparent z-10 pointer-events-none" />

        {/* Sliding Row */}
        <motion.div 
          className="flex gap-12 sm:gap-20 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear"
            }
          }}
        >
          {marqueeLogos.map((logo, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-brand-text/5 bg-brand-surface/40 hover:border-brand-orange/25 transition-colors duration-300 select-none cursor-default"
            >
              <div className="flex items-center justify-center p-1.5 rounded-lg bg-brand-black/60 border border-brand-text/5">
                {logo.icon}
              </div>
              <span className="text-sm font-bold font-mono tracking-wider text-brand-text">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
