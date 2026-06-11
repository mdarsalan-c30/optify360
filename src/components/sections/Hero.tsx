"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Activity } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for cursor-linked perspective tilt and shift
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 90, mass: 1 };
  
  const refX = useSpring(mouseX, springConfig);
  const refY = useSpring(mouseY, springConfig);

  // Parallax offsets for various depth layers
  const orbX = useTransform(refX, (val) => val * 0.4);
  const orbY = useTransform(refY, (val) => val * 0.4);
  
  const ring1X = useTransform(refX, (val) => val * 0.6);
  const ring1Y = useTransform(refY, (val) => val * 0.6);

  const ring2X = useTransform(refX, (val) => val * -0.3);
  const ring2Y = useTransform(refY, (val) => val * -0.3);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = ((e.clientX - centerX) / (rect.width / 2)) * 100;
      const y = ((e.clientY - centerY) / (rect.height / 2)) * 100;

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  const headline = "We Engineer Digital Growth Systems.";
  const words = headline.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: "110%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-brand-black glowing-grid px-6 pt-32 pb-20 overflow-hidden md:px-12 lg:px-24"
    >
      {/* Background space glows */}
      <div className="absolute inset-0 pointer-events-none radial-dark" />
      
      {/* Dynamic drifting background dust cloud */}
      <motion.div 
        style={{ x: ring1X, y: ring1Y }}
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-orange/5 blur-[160px] pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Heading copy */}
        <div className="lg:col-span-7 flex flex-col items-start text-left select-none">
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] font-mono text-brand-orange tracking-widest uppercase"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse text-brand-orange" />
            Positioning: From Idea To Revenue
          </motion.div>

          {/* Headline */}
          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-brand-text leading-[0.95] mb-8 font-heading"
          >
            {words.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden mr-[0.2em] py-1">
                <motion.span 
                  variants={wordVariants} 
                  className="inline-block origin-bottom text-gradient"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-xl text-base sm:text-lg text-brand-muted mb-10 leading-relaxed font-sans"
          >
            Businesses don&apos;t need generic websites. They need results. We build premium 
            digital systems, SEO architectures, and automated pipelines engineered for high-ticket growth.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <a 
              href="#calculator"
              className="relative group overflow-hidden flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-orange text-brand-black font-semibold tracking-wide transition-all duration-300 hover:bg-brand-dark-orange cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Book Discovery Call <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
            <a 
              href="#showcase"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-brand-orange/30 text-brand-text transition-all duration-300 cursor-pointer"
            >
              View System Showcase
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange group-hover:animate-ping" />
            </a>
          </motion.div>
        </div>

        {/* Right Column: Accretion Blackhole visual */}
        <div className="lg:col-span-5 flex items-center justify-center min-h-[450px]">
          <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] flex items-center justify-center select-none">
            
            {/* Layer 1: Outermost dynamic orbit trails */}
            <motion.div 
              style={{ x: ring2X, y: ring2Y }}
              className="absolute w-[100%] h-[100%] rounded-full border border-white/[0.02] animate-spin-slow pointer-events-none"
            />

            {/* Layer 2: Ring 2 Accretion Dust (Glow) */}
            <motion.div 
              style={{ x: ring2X, y: ring2Y }}
              className="absolute w-[85%] h-[85%] rounded-full border border-brand-orange/5 bg-gradient-to-tr from-brand-orange/0 via-brand-orange/[0.02] to-brand-dark-orange/0 blur-xl animate-spin-reverse-slow pointer-events-none"
            />

            {/* Layer 3: Main Accretion Disc (SVG Ring rotating) */}
            <motion.div
              style={{ x: ring1X, y: ring1Y }}
              className="absolute w-[75%] h-[75%] pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="accretion" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#FF8C42" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#accretion)" strokeWidth="0.8" strokeDasharray="30 15 5 15" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="url(#accretion)" strokeWidth="0.4" strokeOpacity="0.5" />
              </svg>
            </motion.div>

            {/* Layer 4: Orbital Particle Nodes (SaaS, AI, Web, SEO) */}
            <motion.div 
              style={{ x: orbX, y: orbY }}
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            >
              {/* Particle 1: SEO */}
              <div 
                className="absolute top-[12%] left-[12%] px-3 py-1 rounded-full border border-white/10 bg-brand-surface/90 text-[10px] font-mono text-brand-text shadow-lg animate-bounce"
                style={{ animationDuration: "3.5s" }}
              >
                SEO
              </div>
              {/* Particle 2: AI */}
              <div 
                className="absolute bottom-[14%] right-[10%] px-3 py-1 rounded-full border border-white/10 bg-brand-surface/90 text-[10px] font-mono text-brand-text shadow-lg animate-bounce"
                style={{ animationDuration: "4.2s" }}
              >
                AI
              </div>
              {/* Particle 3: Web */}
              <div 
                className="absolute top-[35%] right-[-5px] px-3 py-1 rounded-full border border-white/10 bg-brand-surface/90 text-[10px] font-mono text-brand-text shadow-lg animate-bounce"
                style={{ animationDuration: "3.8s" }}
              >
                Web
              </div>
              {/* Particle 4: SaaS */}
              <div 
                className="absolute bottom-[30%] left-[-15px] px-3 py-1 rounded-full border border-white/10 bg-brand-surface/90 text-[10px] font-mono text-brand-text shadow-lg animate-bounce"
                style={{ animationDuration: "4.5s" }}
              >
                SaaS
              </div>
            </motion.div>

            {/* Layer 5: Gravity Event Horizon Sphere (Center Core) */}
            <motion.div
              style={{ x: orbX, y: orbY }}
              className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#000000] border border-white/10 shadow-[0_0_80px_20px_rgba(255,107,0,0.18),inset_0_0_40px_rgba(0,0,0,0.95)] flex items-center justify-center overflow-hidden"
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Internal glowing blackhole dust */}
              <div className="absolute inset-0 bg-radial from-brand-orange/20 to-transparent blur-md pointer-events-none" />
              <div className="absolute w-24 h-24 rounded-full bg-brand-black border border-brand-orange/10 flex items-center justify-center text-[10px] font-mono text-brand-orange tracking-widest uppercase">
                CORE
              </div>
            </motion.div>

            {/* Outer edge volumetric glows */}
            <div className="absolute w-72 h-72 rounded-full bg-brand-orange/5 blur-3xl pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
