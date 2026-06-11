"use client";

import { motion } from "framer-motion";
import { Eye, Layers, Terminal, Rocket } from "lucide-react";

interface Step {
  number: string;
  title: string;
  headline: string;
  text: string;
  icon: any;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Discover & Strategy",
    headline: "Aligning Business Goals with Technical Execution",
    text: "We audit your current tech stack, review search metrics, and detail target personas to build a thorough project roadmap.",
    icon: Eye,
  },
  {
    number: "02",
    title: "Design & Architecture",
    headline: "Prototyping and Technical System Design",
    text: "We create modular UI/UX design systems in Figma while planning database schemas and API integrations to prevent scaling bottlenecks.",
    icon: Layers,
  },
  {
    number: "03",
    title: "Develop & Automate",
    headline: "Clean Code & High-Performance Pipelines",
    text: "We write structured, modular code in TypeScript, build clean database migrations, integrate AI agents, and set up metadata structures.",
    icon: Terminal,
  },
  {
    number: "04",
    title: "Launch & Optimize",
    headline: "Flawless Deployment and Inbound Growth",
    text: "We execute a zero-downtime deployment, monitor server metrics, and configure analytics dashboard tracking to monitor conversions.",
    icon: Rocket,
  },
];

const transitionPreset = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1]
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transitionPreset }
};

export default function Process() {
  return (
    <section className="py-16 md:py-20 bg-bg relative overflow-hidden">
      {/* Background backing glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
            Our Workflow
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-text-main tracking-tight mt-2">
            The Scaling Engine
          </h2>
          <p className="text-text-muted text-sm md:text-base leading-relaxed">
            How we translate your product concept into a high-performance, automated inbound marketing asset.
          </p>
        </div>

        {/* Steps Horizontal/Vertical Flow */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
        >
          {/* Connecting Line between steps (Desktop only) */}
          <div className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[1px] bg-white/[0.06] -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={fadeUpVariant}
                className="group relative flex flex-col items-start space-y-4"
              >
                {/* Step Circle & Icon */}
                <div className="flex items-center justify-between w-full">
                  <div className="w-[52px] h-[52px] rounded-xl bg-surface border border-white/[0.08] flex items-center justify-center text-primary-orange group-hover:border-primary-orange/30 group-hover:bg-primary-orange/10 transition-all duration-300 shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Step Sequence Indicator */}
                  <span className="font-heading font-extrabold text-4xl text-white/[0.02] group-hover:text-primary-orange/10 transition-colors duration-300 select-none">
                    {step.number}
                  </span>
                </div>

                {/* Step Content */}
                <div className="pt-2">
                  <span className="text-[10px] uppercase text-primary-orange font-bold tracking-widest font-mono">
                    Phase {index + 1}
                  </span>
                  <h3 className="text-lg font-bold font-heading text-text-main mt-1">
                    {step.title}
                  </h3>
                  <h4 className="text-xs font-semibold text-text-muted mt-2 border-l border-primary-orange/30 pl-2 leading-relaxed">
                    {step.headline}
                  </h4>
                  <p className="text-sm text-text-muted/80 mt-3 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
