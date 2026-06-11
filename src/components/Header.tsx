"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 bg-brand-black/60 backdrop-blur-xl border border-white/[0.05] rounded-full px-6 py-3 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      {/* Brand logo */}
      <a href="#" className="flex items-center gap-2 font-black font-sans text-lg tracking-tighter text-brand-text group">
        <div className="w-4 h-4 rounded-full bg-brand-orange orange-glow-sm group-hover:scale-110 transition-transform flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-brand-black" />
        </div>
        BLACK<span className="text-brand-orange group-hover:text-brand-dark-orange transition-colors">HOLE</span>
      </a>

      {/* Nav links (hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-brand-muted uppercase">
        <a href="#capabilities" className="hover:text-brand-orange transition-colors">Capabilities</a>
        <a href="#showcase" className="hover:text-brand-orange transition-colors">Showcase</a>
        <a href="#process" className="hover:text-brand-orange transition-colors">Process</a>
        <a href="#calculator" className="hover:text-brand-orange transition-colors">Calculator</a>
        <a href="#contact" className="hover:text-brand-orange transition-colors">Contact</a>
      </nav>

      {/* Launch Portal button */}
      <a 
        href="#calculator"
        className="relative group px-4 py-1.5 rounded-full border border-brand-orange/30 text-[10px] font-mono tracking-widest text-brand-orange uppercase bg-brand-orange/5 hover:bg-brand-orange hover:text-brand-black transition-all duration-300 cursor-pointer"
      >
        <span className="relative z-10 flex items-center gap-1">
          Estimate <ArrowUpRight className="w-3 h-3" />
        </span>
      </a>
    </motion.header>
  );
}
