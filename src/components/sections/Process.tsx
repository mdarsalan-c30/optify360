"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Layers, Cpu, Rocket } from "lucide-react";

interface Step {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    num: "01",
    title: "SYSTEM DISCOVERY",
    subtitle: "Telemetry & Technical Audit",
    description: "We audit your existing digital infrastructure, perform query analysis, and map technical requirements to define bottlenecks and architectural goals.",
    bullets: ["Telemetry telemetry collection", "Database scaling assessment", "System architecture design blueprint"],
    icon: <Compass className="w-8 h-8 text-brand-orange" />
  },
  {
    num: "02",
    title: "BESPOKE DESIGN",
    subtitle: "High-Fidelity Interface System",
    description: "We design layout logic using premium dark-theme structures. We craft Bento Grids, responsive flows, and custom micro-interactions.",
    bullets: ["Bento Layout systems", "Aesthetic absolute dark themes", "Component micro-interaction layouts"],
    icon: <Layers className="w-8 h-8 text-brand-orange" />
  },
  {
    num: "03",
    title: "PERFORMANCE DEVELOPMENT",
    subtitle: "Hyper-tuned Engine Assembly",
    description: "Our engineers build the platform using clean Next.js architecture, Tailwind styling, and customized Framer Motion physics. No heavy structures.",
    bullets: ["Headless Next.js and API integrations", "Tailwind CSS v4 layouts", "Frame-rate optimized smooth motions"],
    icon: <Cpu className="w-8 h-8 text-brand-orange" />
  },
  {
    num: "04",
    title: "LAUNCH & SCALE",
    subtitle: "Digital System Release",
    description: "We execute clean database migrations, deploy the headless code to edge nodes, and configure analytical dashboards for live optimization.",
    bullets: ["Edge CDN deployments", "SEO structural indexation setup", "Telemetry scaling dashboard activation"],
    icon: <Rocket className="w-8 h-8 text-brand-orange" />
  }
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the entire process section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Create transforms for each step's active state
  // Step 1: active at 0% to 25% of scroll
  const step1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25, 0.3], [1, 1, 0, 0]);
  const step1Scale = useTransform(scrollYProgress, [0, 0.2, 0.25, 0.3], [1, 1, 0.9, 0.9]);
  
  // Step 2: active at 25% to 50% of scroll
  const step2Opacity = useTransform(scrollYProgress, [0.2, 0.25, 0.45, 0.5], [0, 1, 1, 0]);
  const step2Scale = useTransform(scrollYProgress, [0.2, 0.25, 0.45, 0.5], [0.9, 1, 1, 0.9]);

  // Step 3: active at 50% to 75% of scroll
  const step3Opacity = useTransform(scrollYProgress, [0.45, 0.5, 0.7, 0.75], [0, 1, 1, 0]);
  const step3Scale = useTransform(scrollYProgress, [0.45, 0.5, 0.7, 0.75], [0.9, 1, 1, 0.9]);

  // Step 4: active at 75% to 100% of scroll
  const step4Opacity = useTransform(scrollYProgress, [0.7, 0.75, 0.95, 1], [0, 1, 1, 1]);
  const step4Scale = useTransform(scrollYProgress, [0.7, 0.75, 0.95, 1], [0.9, 1, 1, 1]);

  // Map progress to left index bullet tracker
  const indicatorY = useTransform(scrollYProgress, [0, 1], ["0%", "300%"]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-brand-black">
      {/* Sticky full screen viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Ambient background glows */}
        <div className="absolute inset-0 radial-dark pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-dark-orange/5 rounded-full blur-3xl pointer-events-none" />

        {/* Global Progress Bar (left side tracker) */}
        <div className="absolute left-6 md:left-12 lg:left-24 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-20">
          <div className="relative h-40 w-[2px] bg-brand-text/10 rounded-full flex flex-col justify-between">
            {/* Active sliding indicator dot */}
            <motion.div 
              style={{ y: indicatorY }}
              className="absolute left-[-2px] top-0 w-[6px] h-[6px] rounded-full bg-brand-orange orange-glow-sm"
            />
            {steps.map((_, idx) => (
              <div key={idx} className="w-2 h-2 rounded-full bg-brand-text/20" />
            ))}
          </div>
          <span className="text-[10px] font-mono text-brand-orange tracking-widest uppercase origin-left rotate-90 mt-8 whitespace-nowrap">
            PROCESS MAP
          </span>
        </div>

        {/* Step 1 Page */}
        <motion.div 
          style={{ opacity: step1Opacity, scale: step1Scale }}
          className="absolute inset-0 w-full h-full flex items-center px-12 md:px-24 lg:px-48"
        >
          <StepContent step={steps[0]} />
        </motion.div>

        {/* Step 2 Page */}
        <motion.div 
          style={{ opacity: step2Opacity, scale: step2Scale }}
          className="absolute inset-0 w-full h-full flex items-center px-12 md:px-24 lg:px-48"
        >
          <StepContent step={steps[1]} />
        </motion.div>

        {/* Step 3 Page */}
        <motion.div 
          style={{ opacity: step3Opacity, scale: step3Scale }}
          className="absolute inset-0 w-full h-full flex items-center px-12 md:px-24 lg:px-48"
        >
          <StepContent step={steps[2]} />
        </motion.div>

        {/* Step 4 Page */}
        <motion.div 
          style={{ opacity: step4Opacity, scale: step4Scale }}
          className="absolute inset-0 w-full h-full flex items-center px-12 md:px-24 lg:px-48"
        >
          <StepContent step={steps[3]} />
        </motion.div>

      </div>
    </div>
  );
}

function StepContent({ step }: { step: Step }) {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center select-none">
      
      {/* Large Glowing Number */}
      <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-start">
        <motion.span 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[12rem] sm:text-[16rem] lg:text-[22rem] font-black font-mono leading-none text-brand-orange/60 select-none pointer-events-none"
        >
          {step.num}
        </motion.span>
        {/* Glow effect matching index */}
        <div className="absolute w-36 h-36 bg-brand-orange/10 rounded-full blur-3xl" />
      </div>

      {/* Description Content */}
      <div className="lg:col-span-7 flex flex-col items-start text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-orange/20">
            {step.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-brand-orange tracking-wider uppercase">STAGE {step.num}</span>
            <span className="text-sm font-semibold text-brand-muted">{step.subtitle}</span>
          </div>
        </div>

        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-text mb-6 tracking-tight leading-tight">
          {step.title}
        </h3>

        <p className="text-brand-muted text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
          {step.description}
        </p>

        {/* Bullet checklist */}
        <ul className="flex flex-col gap-3">
          {step.bullets.map((b, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm font-medium text-brand-text">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange orange-glow-sm" />
              {b}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
