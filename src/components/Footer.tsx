"use client";

import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-brand-black border-t border-brand-text/5 px-6 py-16 md:px-12 lg:px-24">
      {/* Background Grid */}
      <div className="absolute inset-0 glowing-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start mb-16">
        
        {/* Brand */}
        <div className="md:col-span-2 flex flex-col items-start text-left">
          <a href="#" className="flex items-center gap-2 font-black font-sans text-xl tracking-tighter text-brand-text mb-6">
            <div className="w-5 h-5 rounded-full bg-brand-orange orange-glow-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-black" />
            </div>
            BLACK<span className="text-brand-orange">HOLE</span>
          </a>
          <p className="text-brand-muted text-sm leading-relaxed max-w-sm">
            Engineering next-generation digital architectures, responsive Bento grids, and high-velocity web platforms for innovative industries.
          </p>
        </div>

        {/* Column 1 */}
        <div className="flex flex-col items-start text-left">
          <h4 className="text-xs font-mono text-brand-orange tracking-widest uppercase mb-4">SYSTEM INDEX</h4>
          <ul className="flex flex-col gap-2.5 text-sm font-medium text-brand-muted">
            <li><a href="#" className="hover:text-brand-text transition-colors">Web Engineering</a></li>
            <li><a href="#" className="hover:text-brand-text transition-colors">AI Routing Engines</a></li>
            <li><a href="#" className="hover:text-brand-text transition-colors">SEO Optimizations</a></li>
            <li><a href="#" className="hover:text-brand-text transition-colors">Tactile Interfaces</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col items-start text-left">
          <h4 className="text-xs font-mono text-brand-orange tracking-widest uppercase mb-4">ENGINEERING</h4>
          <ul className="flex flex-col gap-2.5 text-sm font-medium text-brand-muted">
            <li><a href="#" className="hover:text-brand-text transition-colors">Core telemetry</a></li>
            <li><a href="#" className="hover:text-brand-text transition-colors">System diagnostics</a></li>
            <li><a href="#" className="hover:text-brand-text transition-colors">Developer Portal</a></li>
            <li><a href="#" className="hover:text-brand-text transition-colors">Terminal logs</a></li>
          </ul>
        </div>

      </div>

      <div className="relative z-10 max-w-7xl mx-auto border-t border-brand-text/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-brand-muted">
        <p>&copy; {new Date().getFullYear()} BLACKHOLE Agency. All systems operational.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-brand-orange transition-colors">Status</a>
          <a href="#" className="hover:text-brand-orange transition-colors">Telemetry logs</a>
          <a href="#" className="hover:text-brand-orange transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
