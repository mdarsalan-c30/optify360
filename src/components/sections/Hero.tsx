"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Shield, Activity } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tracking cursor position relative to container
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics configuration for organic movement
  const springConfig = { damping: 25, stiffness: 100, mass: 0.8 };
  
  const orbX = useSpring(mouseX, springConfig);
  const orbY = useSpring(mouseY, springConfig);

  // Parallax layers shifting at different magnitudes
  const glowX = useSpring(useTransform(mouseX, (val) => val * 1.3), springConfig);
  const glowY = useSpring(useTransform(mouseY, (val) => val * 1.3), springConfig);
  
  const highlightX = useSpring(useTransform(mouseX, (val) => val * -0.5), springConfig);
  const highlightY = useSpring(useTransform(mouseY, (val) => val * -0.5), springConfig);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Calculate cursor position relative to the center of the container
      const width = rect.width;
      const height = rect.height;
      const centerX = rect.left + width / 2;
      const centerY = rect.top + height / 2;
      
      // Normalize values between -100 and 100
      const x = ((e.clientX - centerX) / (width / 2)) * 80;
      const y = ((e.clientY - centerY) / (height / 2)) * 80;

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      // Return orb to center when cursor leaves
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

  // Heading split into words for stagger reveal
  const headline = "We Build Digital Systems That Scale";
  const words = headline.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // premium custom cubic-bezier
      },
    },
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-brand-black glowing-grid px-6 py-20 overflow-hidden md:px-12 lg:px-24"
    >
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 pointer-events-none radial-dark" />
      
      {/* Bottom glowing separator */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Typography Column */}
        <div className="lg:col-span-7 flex flex-col items-start text-left select-none">
          {/* Subtle upper tag */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-surface/80 backdrop-blur-sm text-xs font-mono text-brand-orange tracking-wider uppercase"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Next-Gen Digital Architecture
          </motion.div>

          {/* Staggered Word Reveal Heading */}
          <motion.h1 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-text leading-[1.05] mb-8"
          >
            {words.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden mr-[0.25em] py-1">
                <motion.span 
                  variants={wordVariants} 
                  className="inline-block origin-bottom font-sans"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Paragraph explanation */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="max-w-xl text-lg text-brand-muted mb-10 leading-relaxed font-sans"
          >
            BLACKHOLE engineering designs custom high-performance web systems, 
            AI-driven workflows, and bento-structured ecosystems built to endure. We combine 
            aesthetic absolute dark design with hyper-tuned digital mechanics.
          </motion.p>

          {/* Action buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button 
              className="relative group overflow-hidden flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-brand-orange text-brand-black font-semibold tracking-wide transition-all duration-300 hover:bg-brand-dark-orange cursor-pointer"
            >
              {/* Inner glowing effect on hover */}
              <span className="absolute inset-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-1.5">
                Initiate Systems <ArrowUpRight className="w-4 h-4" />
              </span>
            </button>
            <button 
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-brand-text/10 bg-brand-surface/40 hover:bg-brand-surface/80 hover:border-brand-orange/30 text-brand-text transition-all duration-300 cursor-pointer"
            >
              Explore Portfolio
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange group-hover:animate-ping" />
            </button>
          </motion.div>
        </div>

        {/* Right Orb Column */}
        <div className="lg:col-span-5 flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
            
            {/* Layer 1: Ambient Backdrop glow (largest and softest, follows cursor with amplified motion) */}
            <motion.div 
              style={{ x: glowX, y: glowY }}
              className="absolute w-[120%] h-[120%] rounded-full bg-brand-orange/10 blur-3xl pointer-events-none"
              animate={{
                scale: isHovered ? 1.15 : 1,
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Layer 2: Secondary Aura (middle level blur) */}
            <motion.div 
              style={{ x: orbX, y: orbY }}
              className="absolute w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-brand-orange/30 to-brand-dark-orange/20 blur-2xl pointer-events-none"
              animate={{
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Layer 3: Main Orb Sphere (Solid radial gradient + heavy border glow) */}
            <motion.div
              style={{ x: orbX, y: orbY }}
              className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-radial from-[#FF8C42] via-[#FF6B00] to-[#1a0b00] border border-brand-orange/30 shadow-[inset_-10px_-10px_40px_rgba(0,0,0,0.9),inset_15px_15px_30px_rgba(255,255,255,0.25),0_0_50px_rgba(255,107,0,0.35)] overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center"
              animate={{
                y: [0, -8, 0], // ambient float
              }}
              transition={{
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
            >
              {/* Layer 4: Volumetric Shading overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-[#000000]/70 to-[#000000]/95 mix-blend-multiply pointer-events-none" />
              
              {/* Layer 5: Inner Core glow */}
              <div className="absolute inset-4 rounded-full bg-radial from-[#FF6B00]/40 to-transparent blur-md pointer-events-none" />
              
              {/* Layer 6: Specular Highlight spot (shifts opposite to cursor for 3D depth) */}
              <motion.div
                style={{ x: highlightX, y: highlightY }}
                className="absolute top-[12%] left-[12%] w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-white/70 to-brand-orange/0 blur-[2px] pointer-events-none"
              />

              {/* Layer 7: Secondary rim light (simulates ground bounce reflection) */}
              <div className="absolute bottom-2 right-12 w-32 h-6 rounded-full bg-[#FF8C42]/20 blur-[6px] transform rotate-[-15deg] pointer-events-none" />

              {/* Decorative core rings (pure CSS) */}
              <div className="absolute w-[95%] h-[95%] rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute w-[80%] h-[80%] rounded-full border border-brand-orange/5 pointer-events-none" />
            </motion.div>

            {/* Peripheral technological details floating outside the orb */}
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-brand-orange/40 animate-ping" />
            <div className="absolute bottom-10 left-10 w-2 h-2 rounded-full bg-brand-dark-orange/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
