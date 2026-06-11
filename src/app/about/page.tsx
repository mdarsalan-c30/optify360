import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Github, Linkedin, Briefcase, Award, ShieldCheck, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story | Md Arsalan & The Optify360 Mission",
  description: "Founded by Md Arsalan, Optify360 is a team of elite software developers and growth marketers helping ventures scale through custom web applications.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Story Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full inline-flex">
                Our Story
              </span>
              
              <h1 className="text-4xl md:text-6xl font-bold font-heading text-text-main tracking-tight leading-none mt-2">
                Scaling Brands Through <span className="text-gradient">Bespoke Engineering</span>
              </h1>

              <div className="space-y-4 text-text-muted leading-relaxed text-sm md:text-base">
                <p>
                  Optify360 was founded by <strong className="text-text-main font-semibold">Md Arsalan</strong>, a seasoned software architect and digital growth specialist. With a background in building complex SaaS applications and optimizing conversion-focused digital experiences, Arsalan established Optify360 to bridge the gap between world-class software engineering and strategic growth marketing.
                </p>
                <p>
                  Having successfully built applications featured on Arsalan's portfolio (<a href="https://mdarsalan.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary-orange hover:underline inline-flex items-center gap-0.5">mdarsalan.vercel.app <ArrowUpRight className="w-3 h-3" /></a>), the agency operates under a singular philosophy: every line of code we write and every keyword we target must directly impact our clients' bottom line.
                </p>
                <p>
                  Today, Optify360 partners with ambitious companies worldwide to design, develop, and scale platforms that redefine their industries. We don't just deliver projects; we engineer digital equity.
                </p>
              </div>

              {/* Core Philosophy Bullets */}
              <div className="pt-6 border-t border-white/[0.05] grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Briefcase className="w-5 h-5 text-primary-orange" />
                  <h4 className="text-sm font-bold font-heading text-text-main">No Templates</h4>
                  <p className="text-xs text-text-muted">Hand-coded Next.js systems engineered for custom performance.</p>
                </div>
                <div className="space-y-2">
                  <Cpu className="w-5 h-5 text-primary-orange" />
                  <h4 className="text-sm font-bold font-heading text-text-main">AI-Attribution</h4>
                  <p className="text-xs text-text-muted">Intelligent pipelines and agents mapping your operational scale.</p>
                </div>
                <div className="space-y-2">
                  <ShieldCheck className="w-5 h-5 text-primary-orange" />
                  <h4 className="text-sm font-bold font-heading text-text-main">Data Security</h4>
                  <p className="text-xs text-text-muted">GDPR/HIPAA compliance with logical database isolation.</p>
                </div>
              </div>
            </div>

            {/* Right Column - Founder Identity Card */}
            <div className="lg:col-span-5 relative">
              {/* Backing Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-3xl blur-[80px] opacity-15 pointer-events-none" />

              {/* Founder Profile Glass Card */}
              <div className="glass-panel rounded-2xl p-8 border border-white/[0.08] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Avatar Initial representation */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-orange to-secondary-orange flex items-center justify-center font-heading font-extrabold text-2xl text-text-main border border-white/10 shadow-lg shadow-black/20 mb-6">
                  MA
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-heading text-text-main">Md Arsalan</h2>
                  <p className="text-xs text-primary-orange font-semibold font-mono uppercase tracking-wider">
                    Founder & Software Architect
                  </p>
                </div>

                {/* Tech coordinates */}
                <div className="mt-6 pt-6 border-t border-white/[0.05] space-y-4 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Domain Focus:</span>
                    <span className="text-text-main font-semibold">SaaS, AI & SEO Systems</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Key Tech Stack:</span>
                    <span className="text-text-main font-semibold text-right">Next.js, TS, Go, Postgres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Portfolio URL:</span>
                    <a href="https://mdarsalan.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary-orange hover:underline flex items-center gap-0.5">
                      mdarsalan.vercel.app
                    </a>
                  </div>
                </div>

                {/* Social links */}
                <div className="mt-8 flex gap-4">
                  <a 
                    href="https://github.com/mdarsalan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-white/[0.02] border border-white/[0.08] hover:border-primary-orange/20 hover:bg-white/[0.06] rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold text-text-muted hover:text-text-main transition-all"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <a 
                    href="https://linkedin.com/in/mdarsalan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-white/[0.02] border border-white/[0.08] hover:border-primary-orange/20 hover:bg-white/[0.06] rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold text-text-muted hover:text-text-main transition-all"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
