"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpRight, Award, CheckCircle2, Globe, Cpu, Zap, Eye, Leaf, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

interface CaseStudy {
  id: string;
  client: string;
  category: string;
  title: string;
  url?: string;
  challenge: string;
  solution: string;
  techStack: string;
  outcome: string;
  results: {
    metric: string;
    label: string;
  }[];
  deliverables: string[];
  gradient: string;
  icon: any;
}

const staticCaseStudies: CaseStudy[] = [
  {
    id: "studycubs",
    client: "StudyCubs",
    category: "EdTech • Learning Platform • Skill Development",
    title: "Online learning platform focused on future-ready skills",
    url: "https://studycubs.com",
    challenge: "Traditional education often overlooks communication, confidence building, public speaking, and practical life skills. Parents increasingly seek personalized skill-based learning environments.",
    solution: "We engineered an interactive learning platform supporting public speaking courses, coding exercises, customized sessions, and student progress tracking systems, integrating a parent-friendly onboarding funnel.",
    techStack: "React • Next.js • Firebase • Video Integration • CRM",
    outcome: "Education-focused UX, parent progress monitoring portal, automated CRM lead capture, and scalable course architecture.",
    results: [
      { metric: "+45%", label: "Parent Onboarding Rate" },
      { metric: "5000+", label: "Hours Taught" },
      { metric: "Excellent", label: "Trustpilot Rating" }
    ],
    deliverables: ["Legacy Migration to NextJS", "Custom Onboarding Flow", "Dynamic Student Portals", "Firebase Firestore Integrations"],
    gradient: "from-amber-600/40 via-orange-900/20 to-black/80",
    icon: Award
  },
  {
    id: "pdfverse",
    client: "PDFVerse",
    category: "SaaS • Productivity Tool • PDF Processing",
    title: "Browser-based document productivity platform",
    url: "https://pdf-verse.vercel.app",
    challenge: "Most online PDF utilities are either expensive, require software installation, have clunky interfaces, or upload sensitive documents to external servers, risking data privacy.",
    solution: "Built a browser-first, privacy-centric utility tool executing PDF splits, merges, compressions, OCR, and page manipulation directly in browser memory using client-side JavaScript.",
    techStack: "Next.js • React • Tailwind CSS • PDF.js • Tesseract OCR • Firebase",
    outcome: "100% client-side privacy-first execution, under 1.2s Largest Contentful Paint (LCP), and robust document utility tools.",
    results: [
      { metric: "Zero", label: "Server Uploads (100% Privacy)" },
      { metric: "< 1.2s", label: "Page Load Speed" },
      { metric: "100k+", label: "Pages Split / Merged" }
    ],
    deliverables: ["WebAssembly (Wasm) processing", "Client-Side OCR Integration", "Image Compression Pipeline", "Firebase Storage Configs"],
    gradient: "from-purple-600/40 via-indigo-900/20 to-black/80",
    icon: Zap
  },
  {
    id: "mynra",
    client: "Mynra",
    category: "AI SaaS • Automation • Conversational AI",
    title: "AI-powered automation and SaaS dashboard",
    url: "https://mynyra.netlify.app",
    challenge: "Ambitious businesses require automated operational workflows and conversational AI agents but lack the technical developer resources to configure LLM prompts and vector memories.",
    solution: "Developed an AI-first SaaS dashboard featuring conversational assistants, operational automation adapters, and low-latency API brokers connected to secure OpenAI backend queues.",
    techStack: "Next.js • OpenAI APIs • Firebase • Tailwind CSS • Serverless",
    outcome: "Autonomous operational agents, dynamic memory state routing, and responsive dashboard experience.",
    results: [
      { metric: "-80%", label: "Manual Overhead Support" },
      { metric: "15+", label: "API Operations Mapped" },
      { metric: "< 200ms", label: "API Response Latency" }
    ],
    deliverables: ["OpenAI LLM Vector Databases", "Dynamic User Session Queueing", "Serverless API Integrations", "Interactive Recharts Dashboard"],
    gradient: "from-blue-600/40 via-cyan-900/20 to-black/80",
    icon: Cpu
  },
  {
    id: "climateverse",
    client: "ClimateVerse",
    category: "ClimateTech • Sustainability • Interactive Platform",
    title: "Environmental awareness & carbon footprint toolkit",
    challenge: "Most environmental and climate websites rely on static articles, providing little interactivity or actionable calculations to engage users in sustainability.",
    solution: "Designed and engineered an environmental utility platform offering footprint calculators, sustainability pledge trackers, and educational content databases.",
    techStack: "Next.js • Firebase • Tailwind CSS • Chart Libraries • Eco APIs",
    outcome: "Educational yet interactive carbon calculators, sustainability metrics, and dynamic SEO content structures.",
    results: [
      { metric: "+60%", label: "User Session Engagement" },
      { metric: "Real-time", label: "Carbon Calculations" },
      { metric: "SEO", label: "Schema-Driven Metadata" }
    ],
    deliverables: ["Interactive SVG Calculators", "Dynamic Footprint Dashboard", "Dynamic Sitemap Engine", "Firestore Analytics Pipeline"],
    gradient: "from-emerald-600/40 via-teal-900/20 to-black/80",
    icon: Leaf
  },
  {
    id: "epicindiatravel",
    client: "Epic India Travel",
    category: "TravelTech • Tourism • Content Platform",
    title: "Indian destination discovery & tour booking portal",
    url: "http://epicindiatravel.iin",
    challenge: "Many travel planning websites overload visitors with slow loading catalogs, poor navigation structures, and high friction booking forms.",
    solution: "Created a destination-focused portal featuring fast travel packages, program catalogs, optimized search indexing, and a simple lead capture database.",
    techStack: "Next.js • Tailwind CSS • Firebase • Headless CMS",
    outcome: "Zero-latency travel catalog, highly optimized SEO structural schemas, and clean database leads logging.",
    results: [
      { metric: "+120%", label: "Organic Search Visibility" },
      { metric: "99 / 100", label: "Google Mobile Speed Score" },
      { metric: "2.5x", label: "Booking Form Conversions" }
    ],
    deliverables: ["Headless CMS Integrations", "Algolia Search Configs", "Lead Router Automation", "Programmatic Travel Pages"],
    gradient: "from-rose-600/40 via-red-900/20 to-black/80",
    icon: Eye
  }
];

export default function PortfolioPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(staticCaseStudies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCaseStudies() {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list = snapshot.docs.map((doc, idx) => {
            const data = doc.data();
            
            // Map results from DB fields
            const results = [
              { metric: data.metric || "Verified", label: "Primary Metric" },
              { metric: data.metric2 || "Success", label: data.metric2Label || "Client Success" },
              { metric: data.metric3 || "Deploy", label: data.metric3Label || "Active Status" }
            ];

            // Map icon based on category
            let IconClass = Cpu;
            const categoryLower = (data.category || "").toLowerCase();
            if (categoryLower.includes("edu") || categoryLower.includes("learn")) IconClass = Award;
            else if (categoryLower.includes("saas") || categoryLower.includes("prod")) IconClass = Zap;
            else if (categoryLower.includes("eco") || categoryLower.includes("sustain") || categoryLower.includes("climate")) IconClass = Leaf;
            else if (categoryLower.includes("travel") || categoryLower.includes("seo") || categoryLower.includes("web")) IconClass = Eye;

            return {
              id: doc.id,
              client: data.client || "Untitled Client",
              category: data.category || "Consulting Project",
              title: data.title || "Custom Solution Integration",
              url: data.url || "",
              challenge: data.challenge || "",
              solution: data.solution || "",
              techStack: data.techStack || "",
              outcome: data.outcome || "",
              results,
              deliverables: data.deliverables ? data.deliverables.split(",").map((s: string) => s.trim()) : ["Custom Codebase Integration"],
              gradient: data.gradient || (idx % 3 === 0 ? "from-amber-600/40 via-orange-900/20 to-black/80" : idx % 3 === 1 ? "from-purple-600/40 via-indigo-900/20 to-black/80" : "from-blue-600/40 via-cyan-900/20 to-black/80"),
              icon: IconClass
            } as CaseStudy;
          });
          setCaseStudies(list);
        }
      } catch (error) {
        console.error("Failed to load portfolio case studies from Firestore, using static data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCaseStudies();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="max-w-3xl mb-24 space-y-4">
            <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
              Case Studies
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-text-main tracking-tight mt-2">
              Our Scaled <span className="text-gradient">Case Studies</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg leading-relaxed">
              Explore how we bridge the gap between high-end software engineering and strategic digital growth, delivering custom solutions that directly impact our clients' bottom line.
            </p>
          </div>

          {/* Case Studies List */}
          {loading ? (
            <div className="py-20 text-center text-text-muted text-sm flex flex-col items-center gap-3 font-mono">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-orange" />
              Loading portfolio case studies...
            </div>
          ) : (
            <div className="space-y-28">
              {caseStudies.map((project, index) => {
                const isEven = index % 2 === 0;
                const Icon = project.icon;
                return (
                  <div 
                    key={project.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-b border-white/[0.04] pb-24 last:border-b-0"
                  >
                    
                    {/* Left Column (Details in specific Case Study Format) */}
                    <div className={`lg:col-span-7 space-y-6 ${!isEven ? "lg:order-2" : ""}`}>
                      <div>
                        <span className="text-[10px] uppercase text-primary-orange font-bold tracking-widest font-mono">
                          {project.category}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-bold font-heading text-text-main mt-1 leading-snug">
                          {project.client} &mdash; {project.title}
                        </h2>
                      </div>

                      {/* Problem -> Solution -> Tech Stack -> Outcome Format */}
                      <div className="space-y-5 text-sm md:text-base text-text-muted">
                        <div className="border-l-2 border-primary-orange/30 pl-4">
                          <strong className="text-text-main font-semibold uppercase tracking-wider text-xs block mb-1">Challenge (The Problem)</strong>
                          <p>{project.challenge}</p>
                        </div>
                        <div className="border-l-2 border-primary-orange/30 pl-4">
                          <strong className="text-text-main font-semibold uppercase tracking-wider text-xs block mb-1">Our Solution</strong>
                          <p>{project.solution}</p>
                        </div>
                        <div className="border-l-2 border-primary-orange/30 pl-4">
                          <strong className="text-text-main font-semibold uppercase tracking-wider text-xs block mb-1">Outcome & Highlights</strong>
                          <p>{project.outcome}</p>
                        </div>
                        <div className="border-l-2 border-primary-orange/30 pl-4">
                          <strong className="text-text-main font-semibold uppercase tracking-wider text-xs block mb-1">Tech Stack</strong>
                          <p className="font-mono text-xs text-text-main/80 pt-0.5">{project.techStack}</p>
                        </div>
                      </div>

                      {/* Tech Stack & Deliverables */}
                      <div className="pt-2">
                        <h4 className="text-xs font-bold font-heading uppercase tracking-wider text-text-main mb-3">
                          Key Engineering Deliverables:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.deliverables.map((item, idx) => (
                            <span 
                              key={idx}
                              className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-text-muted hover:text-text-main transition-colors"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column (Visual / Metrics Dashboard representation) */}
                    <div className={`lg:col-span-5 ${!isEven ? "lg:order-1" : ""}`}>
                      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-surface p-8 min-h-[380px] flex flex-col justify-between group">
                        
                        {/* Gradient Backdrop inside card */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none`} />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                        {/* Header metadata */}
                        <div className="relative z-10 flex justify-between items-center">
                          <span className="font-heading font-extrabold text-lg text-text-main/90">
                            {project.client}
                          </span>
                          <Icon className="w-5 h-5 text-primary-orange" />
                        </div>

                        {/* Results display */}
                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
                          {project.results.map((res, rIdx) => (
                            <div 
                              key={rIdx}
                              className="bg-black/65 border border-white/[0.05] backdrop-blur-sm p-4 rounded-xl flex flex-col justify-center text-center"
                            >
                              <span className="text-xl md:text-2xl font-bold font-heading text-primary-orange block">
                                {res.metric}
                              </span>
                              <span className="text-[9px] text-text-muted mt-1 uppercase tracking-wider block leading-snug">
                                {res.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Link Details */}
                        <div className="relative z-10 mt-8 pt-4 border-t border-white/[0.05] flex justify-between items-center text-xs text-text-muted font-mono">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Validated Live
                          </span>
                          {project.url && (
                            <a 
                              href={project.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-orange font-semibold flex items-center gap-1 hover:underline"
                            >
                              Visit Site <Globe className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
