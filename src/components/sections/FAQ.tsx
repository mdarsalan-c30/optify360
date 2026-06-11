"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What core tech stack does optify360 engineer on?",
    answer: "We engineer high-performance platforms using Next.js 16, React 19, Tailwind CSS v4, and Framer Motion. For backend services, we integrate Go, Rust, Python API routers, Redis caching networks, and headless CMS frameworks to maintain speed and telemetry control."
  },
  {
    question: "How do you build complex animations without slowing page speed?",
    answer: "We avoid heavy WebGL and bulky 3D model files (such as .gltf or .obj) that disrupt performance. Instead, we use math-based CSS variables, radial gradient layers, SVG filters, and lightweight spring dynamics in Framer Motion to build premium responsive interactions that run at a smooth 60fps."
  },
  {
    question: "What does the typical discovery-to-launch roadmap look like?",
    answer: "Our roadmap spans 6 to 10 weeks. It begins with (01) Discovery & Auditing, shifts to (02) High-Fidelity Bento Design layouts, moves into (03) Custom Code Assembly, and completes with (04) Edge CDN Launch. Every phase has strict telemetry audits."
  },
  {
    question: "Do you integrate custom database migrations and SEO schema?",
    answer: "Absolutely. We build structured JSON-LD schemas directly into the HTML document node, configure strict canonical mappings, and design robust database pipeline syncs to guarantee zero data loss or search indexing drops during platform launch."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative w-full bg-brand-black px-6 py-32 overflow-hidden md:px-12 lg:px-24">
      {/* Background glow separator */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
      <div className="absolute inset-0 radial-dark pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left column: FAQ info */}
        <div className="lg:col-span-5 flex flex-col items-start text-left select-none">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-brand-orange tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Queried Parameters
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-text mb-6">
            System Operations <br />
            <span className="text-gradient">Questions Answered</span>
          </h2>
          <p className="text-brand-muted text-base leading-relaxed mb-8 max-w-sm">
            Can&apos;t find the specific system parameters you are looking for? Reach out directly to our engineering core.
          </p>
          <button className="group flex items-center gap-2 text-sm font-semibold text-brand-orange hover:text-brand-dark-orange transition-colors">
            Contact Engineering Core 
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right column: Accordions */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="overflow-hidden rounded-xl border border-brand-text/10 bg-brand-surface/40 backdrop-blur-md transition-colors duration-300"
                style={{
                  borderColor: isOpen ? "rgba(255, 107, 0, 0.3)" : "rgba(245, 245, 245, 0.1)"
                }}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex justify-between items-center px-6 py-5 md:px-8 md:py-6 text-left text-brand-text font-bold text-base md:text-lg select-none cursor-pointer hover:bg-brand-surface/20 transition-colors"
                >
                  <span className={isOpen ? "text-brand-orange transition-colors" : ""}>
                    {item.question}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-black border border-brand-text/5 text-brand-muted group-hover:text-brand-text">
                    {isOpen ? <Minus className="w-4 h-4 text-brand-orange" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 text-sm md:text-base text-brand-muted leading-relaxed font-sans border-t border-brand-text/5 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
