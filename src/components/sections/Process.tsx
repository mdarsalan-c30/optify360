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
    bullets: ["Telemetry collection", "Database scaling assessment", "System architecture design blueprint"],
    icon: <Compass className="w-6 h-6 text-brand-orange" />
  },
  {
    num: "02",
    title: "BESPOKE DESIGN",
    subtitle: "High-Fidelity Interface System",
    description: "We design layout logic using premium dark-theme structures. We craft Bento Grids, responsive flows, and custom micro-interactions.",
    bullets: ["Bento Layout systems", "Aesthetic absolute dark themes", "Component micro-interaction layouts"],
    icon: <Layers className="w-6 h-6 text-brand-orange" />
  },
  {
    num: "03",
    title: "PERFORMANCE DEVELOPMENT",
    subtitle: "Hyper-tuned Engine Assembly",
    description: "Our engineers build the platform using clean Next.js architecture, Tailwind styling, and customized Framer Motion physics. No heavy structures.",
    bullets: ["Headless Next.js and API integrations", "Tailwind CSS v4 layouts", "Frame-rate optimized smooth motions"],
    icon: <Cpu className="w-6 h-6 text-brand-orange" />
  },
  {
    num: "04",
    title: "LAUNCH & SCALE",
    subtitle: "Digital System Release",
    description: "We execute clean database migrations, deploy the headless code to edge nodes, and configure analytical dashboards for live optimization.",
    bullets: ["Edge CDN deployments", "SEO structural indexation setup", "Telemetry scaling dashboard activation"],
    icon: <Rocket className="w-6 h-6 text-brand-orange" />
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
  const step1Scale = useTransform(scrollYProgress, [0, 0.2, 0.25, 0.3], [1, 1, 0.95, 0.95]);
  const step1Y = useTransform(scrollYProgress, [0, 0.2, 0.25, 0.3], [0, 0, -40, -40]);
  
  // Step 2: active at 25% to 50% of scroll
  const step2Opacity = useTransform(scrollYProgress, [0.2, 0.25, 0.45, 0.5], [0, 1, 1, 0]);
  const step2Scale = useTransform(scrollYProgress, [0.2, 0.25, 0.45, 0.5], [0.95, 1, 1, 0.95]);
  const step2Y = useTransform(scrollYProgress, [0.2, 0.25, 0.45, 0.5], [40, 0, 0, -40]);

  // Step 3: active at 50% to 75% of scroll
  const step3Opacity = useTransform(scrollYProgress, [0.45, 0.5, 0.7, 0.75], [0, 1, 1, 0]);
  const step3Scale = useTransform(scrollYProgress, [0.45, 0.5, 0.7, 0.75], [0.95, 1, 1, 0.95]);
  const step3Y = useTransform(scrollYProgress, [0.45, 0.5, 0.7, 0.75], [40, 0, 0, -40]);

  // Step 4: active at 75% to 100% of scroll
  const step4Opacity = useTransform(scrollYProgress, [0.7, 0.75, 0.95, 1], [0, 1, 1, 1]);
  const step4Scale = useTransform(scrollYProgress, [0.7, 0.75, 0.95, 1], [0.95, 1, 1, 1]);
  const step4Y = useTransform(scrollYProgress, [0.7, 0.75, 0.95, 1], [40, 0, 0, 0]);

  // Map progress to left index bullet tracker
  const indicatorHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div id="process" ref={containerRef} className="relative h-[400vh] bg-brand-black">
      {/* Sticky full screen viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Ambient background glows */}
        <div className="absolute inset-0 radial-dark pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-orange/[0.02] rounded-full blur-[140px] pointer-events-none" />
        
        {/* Laser Progress Tracker line (Left of content) */}
        <div className="absolute left-8 md:left-16 lg:left-32 top-1/2 -translate-y-1/2 h-[50vh] w-[2px] bg-white/[0.04] rounded-full z-20">
          <motion.div 
            style={{ height: indicatorHeight }}
            className="w-full bg-brand-orange orange-glow-sm origin-top rounded-full"
          />
        </div>

        {/* Step 1 Page */}
        <motion.div 
          style={{ opacity: step1Opacity, scale: step1Scale, y: step1Y }}
          className="absolute inset-0 w-full h-full flex items-center px-16 md:px-28 lg:px-48"
        >
          <StepContent step={steps[0]} />
        </motion.div>

        {/* Step 2 Page */}
        <motion.div 
          style={{ opacity: step2Opacity, scale: step2Scale, y: step2Y }}
          className="absolute inset-0 w-full h-full flex items-center px-16 md:px-28 lg:px-48"
        >
          <StepContent step={steps[1]} />
        </motion.div>

        {/* Step 3 Page */}
        <motion.div 
          style={{ opacity: step3Opacity, scale: step3Scale, y: step3Y }}
          className="absolute inset-0 w-full h-full flex items-center px-16 md:px-28 lg:px-48"
        >
          <StepContent step={steps[2]} />
        </motion.div>

        {/* Step 4 Page */}
        <motion.div 
          style={{ opacity: step4Opacity, scale: step4Scale, y: step4Y }}
          className="absolute inset-0 w-full h-full flex items-center px-16 md:px-28 lg:px-48"
        >
          <StepContent step={steps[3]} />
        </motion.div>

      </div>
    </div>
  );
}

function StepContent({ step }: { step: Step }) {
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center select-none">
      
      {/* Large Glowing Number */}
      <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-start">
        <span 
          className="text-[12rem] sm:text-[16rem] lg:text-[22rem] font-extrabold font-heading leading-none text-white/[0.015] border-text pointer-events-none select-none tracking-tighter"
          style={{
            WebkitTextStroke: "1px rgba(255,107,0,0.1)",
          }}
        >
          {step.num}
        </span>
        <div className="absolute w-44 h-44 bg-brand-orange/[0.04] rounded-full blur-[80px]" />
      </div>

      {/* Description Content */}
      <div className="lg:col-span-7 flex flex-col items-start text-left">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-brand-orange shadow-lg">
            {step.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-brand-orange tracking-widest uppercase">STAGE {step.num}</span>
            <span className="text-xs font-semibold text-brand-muted tracking-wide font-sans">{step.subtitle}</span>
          </div>
        </div>

        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-text mb-6 tracking-tighter leading-none font-heading">
          {step.title}
        </h3>

        <p className="text-brand-muted text-sm sm:text-base leading-relaxed mb-8 max-w-xl font-sans">
          {step.description}
        </p>

        {/* Bullet checklist */}
        <ul className="flex flex-col gap-3.5">
          {step.bullets.map((b, idx) => (
            <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-brand-text font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange orange-glow-sm" />
              {b}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
