"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Code, Shield, Sparkles, Terminal, BarChart2, Zap, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

interface ServiceItem {
  id: string;
  name: string;
  headline: string;
  description: string;
  pillars: string[];
  iconName: string;
}

const staticServices: ServiceItem[] = [
  {
    id: "saas",
    name: "Enterprise SaaS & Web App Engineering",
    headline: "Scalable, secure, and production-ready applications built to perform.",
    description: "We engineer cloud-native, multi-tenant software architectures that handle heavy workloads and offer flawless user experiences. Custom-built with React, Next.js, and TypeScript.",
    pillars: ["Full-Stack Next.js", "Advanced APIs", "Secure DB Setup"],
    iconName: "Code"
  },
  {
    id: "seo",
    name: "Technical SEO Optimization",
    headline: "Dominate high-intent search queries. Turn traffic into revenue.",
    description: "Fast search engine rankings through clean indexable structure, automated page generation, and schema tags. Focus on bottom-of-funnel conversion queries.",
    pillars: ["Core Web Vitals", "Programmatic SEO", "JSON-LD Schema"],
    iconName: "Zap"
  },
  {
    id: "ai",
    name: "Intelligent AI Workflows",
    headline: "Automate manual overhead. Scale operations with custom AI workflows.",
    description: "Automate manual operational overhead with custom AI agent pipelines, LLM integrations (Claude/OpenAI), and Retrieval-Augmented Generation (RAG) database connections.",
    pillars: ["AI Agent Pipelines", "CRM Automation", "Cognitive Search"],
    iconName: "Cpu"
  },
  {
    id: "web",
    name: "Headless Web Development",
    headline: "Ultra-fast, responsive web interfaces built for high conversions.",
    description: "Your website is your storefront. We build headless sites via Sanity, Strapi, or Contentful that guarantee under 1.2s loading speeds and 100/100 Lighthouse scores.",
    pillars: ["Under 1.2s Load Times", "Headless CMS Connectors", "WCAG Accessible"],
    iconName: "Terminal"
  },
  {
    id: "branding",
    name: "Strategic Brand Identity",
    headline: "Establish authority with a visual identity that commands premium pricing.",
    description: "A premium service needs premium branding. We craft digital brand guidelines, typography, color palettes, and full Figma design libraries.",
    pillars: ["Positioning Strategy", "Logo & Assets System", "Figma Design Libraries"],
    iconName: "Sparkles"
  },
  {
    id: "growth",
    name: "Growth Systems & CRO",
    headline: "Maximize your pipeline. Transform traffic into revenue.",
    description: "We engineer high-converting sales funnels, optimize customer journeys, and implement Mixpanel/GA4 analytics setups to track advertising attribution.",
    pillars: ["A/B Conversion Testing", "Attribution Analytics", "Landing Page Funnels"],
    iconName: "BarChart2"
  }
];

const transitionPreset = {
  duration: 0.8,
  ease: [0.16, 1, 0.3, 1]
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transitionPreset }
};

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>(staticServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const q = query(collection(db, "services"), orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "",
              headline: data.headline || "",
              description: data.description || "",
              pillars: Array.isArray(data.pillars) 
                ? data.pillars 
                : (data.pillars ? data.pillars.split(",").map((s: string) => s.trim()) : []),
              iconName: data.iconName || "Code"
            } as ServiceItem;
          });
          setServices(list);
        }
      } catch (error) {
        console.error("Failed to load services from Firestore, using static data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  // Map icon name to Lucide Component
  const renderIcon = (name: string) => {
    const classes = "w-6 h-6";
    switch (name) {
      case "Code": return <Code className={classes} />;
      case "Zap": return <Zap className={classes} />;
      case "Cpu": return <Cpu className={classes} />;
      case "Terminal": return <Terminal className={classes} />;
      case "Sparkles": return <Sparkles className={classes} />;
      case "BarChart2": return <BarChart2 className={classes} />;
      default: return <Code className={classes} />;
    }
  };

  return (
    <section className="py-16 md:py-20 bg-bg relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
              Bespoke Solutions
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-text-main tracking-tight mt-2">
              Our Core Architectures
            </h2>
          </div>
          <p className="text-text-muted max-w-md leading-relaxed text-sm md:text-base">
            We don't sell hours. We engineer enterprise-grade leverage. We combine the agility of custom-built software with the business intelligence of high-intent SEO and AI workflows.
          </p>
        </div>

        {/* Bento Grid */}
        {loading ? (
          <div className="py-20 text-center text-text-muted text-sm flex flex-col items-center gap-3 font-mono">
            <RefreshCw className="w-6 h-6 animate-spin text-primary-orange" />
            Loading services data...
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {services.map((service, idx) => {
              // Asymmetrical spans matching our layout
              const isLargeCard = idx === 0 || idx === 3 || idx % 4 === 0;
              const colSpanClass = isLargeCard ? "md:col-span-2" : "md:col-span-1";
              
              return (
                <motion.div 
                  key={service.id}
                  variants={fadeUpVariant}
                  className={`${colSpanClass} spotlight-card flex flex-col justify-between min-h-[380px]`}
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary-orange">
                        {renderIcon(service.iconName)}
                      </div>
                      <Link href="/services" className="text-text-muted hover:text-primary-orange transition-colors">
                        <ArrowUpRight className="w-6 h-6" />
                      </Link>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-bold font-heading text-text-main">
                        {service.name}
                      </h3>
                      <p className="text-sm text-text-muted mt-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Widget: Pillars/Keywords */}
                  <div className="px-8 pb-8">
                    <div className="flex flex-wrap gap-2">
                      {service.pillars.map((pillar, pIdx) => (
                        <span 
                          key={pIdx}
                          className="bg-white/[0.02] border border-white/[0.05] rounded-lg px-2.5 py-1 text-[11px] font-semibold text-text-muted"
                        >
                          {pillar}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Bottom CTA Link */}
        <div className="mt-12 text-center">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-orange hover:text-primary-orange/80 transition-colors group"
          >
            Explore all solutions 
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
