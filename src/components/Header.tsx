"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShieldAlert } from "lucide-react";

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 bg-brand-black/70 backdrop-blur-md border-b border-brand-text/5 px-6 py-4 md:px-12 lg:px-24 flex items-center justify-between"
    >
      {/* Brand logo */}
      <a href="#" className="flex items-center gap-2 font-black font-sans text-xl tracking-tighter text-brand-text group">
        <div className="w-5 h-5 rounded-full bg-brand-orange orange-glow-sm group-hover:scale-110 transition-transform flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-black" />
        </div>
        BLACK<span className="text-brand-orange group-hover:text-brand-dark-orange transition-colors">HOLE</span>
      </a>

      {/* Nav links (hidden on mobile, basic responsive layout) */}
      <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-brand-muted uppercase">
        <a href="#" className="hover:text-brand-orange transition-colors">Systems</a>
        <a href="#" className="hover:text-brand-orange transition-colors">Showcase</a>
        <a href="#" className="hover:text-brand-orange transition-colors">Process</a>
        <a href="#" className="hover:text-brand-orange transition-colors">FAQ</a>
      </nav>

      {/* Launch Portal button */}
      <button className="relative group px-5 py-2 rounded border border-brand-orange/30 text-xs font-mono tracking-widest text-brand-orange uppercase bg-brand-orange/5 hover:bg-brand-orange hover:text-brand-black transition-all duration-300 cursor-pointer">
        <span className="relative z-10 flex items-center gap-1.5">
          Portal <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </button>
    </motion.header>
  );
}
