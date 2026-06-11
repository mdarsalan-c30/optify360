"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

interface Project {
  id: string;
  client: string;
  industry: string;
  title: string;
  challenge: string;
  solution: string;
  techStack: string;
  outcome: string;
  metric: string;
  heightClass: string;
  gradient: string;
}

const staticProjects: Project[] = [
  {
    id: "studycubs",
    client: "StudyCubs",
    industry: "EdTech & Learning Platform",
    title: "Online Skill-Based Learning Platform",
    challenge: "Traditional education systems overlook key confidence building, public speaking, and interactive life skills.",
    solution: "Built an custom Next.js educational portal supporting parent onboarding, course selections, and progress trackers.",
    techStack: "React • Next.js • Firebase • CRM Integration",
    outcome: "Scalable • Responsive • Optimized Lead Gen",
    metric: "+45% Onboarding",
    heightClass: "min-h-[480px] lg:h-[520px]",
    gradient: "from-amber-600/20 to-orange-950/45",
  },
  {
    id: "pdfverse",
    client: "PDFVerse",
    industry: "Productivity SaaS",
    title: "Browser-First Document Processor",
    challenge: "Standard PDF utilities are expensive, require installations, and compromise security by uploading documents to external servers.",
    solution: "Developed a client-side document toolkit executing merges, compressions, splits, and OCR entirely within the client sandboxes.",
    techStack: "Next.js • Tailwind CSS • PDF.js • Firebase",
    outcome: "Zero Server Uploads • Privacy First • LCP < 1.2s",
    metric: "100k+ Pages Split",
    heightClass: "min-h-[480px] lg:h-[520px]",
    gradient: "from-purple-600/20 to-indigo-950/45",
  },
  {
    id: "mynra",
    client: "Mynra",
    industry: "AI SaaS & Operational Automation",
    title: "Intelligent SaaS Automation Portal",
    challenge: "Ambitious businesses require customized AI workflows but lack the technical developer resources to configure LLM prompts and vector memories.",
    solution: "Created an AI-first dashboard connecting OpenAI API vectors, memory queues, and custom action adapters.",
    techStack: "Next.js • OpenAI APIs • Firebase • Serverless",
    outcome: "Autonomous Agents • Dynamic Memory • Zero Config",
    metric: "80% Operational Efficiency",
    heightClass: "min-h-[480px] lg:h-[500px] md:col-span-2 max-w-4xl mx-auto w-full",
    gradient: "from-blue-600/20 to-cyan-950/45",
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
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transitionPreset }
};

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list = snapshot.docs.map((doc, idx) => {
            const data = doc.data();
            return {
              id: doc.id,
              client: data.client || "Untitled Client",
              industry: data.industry || data.category || "Digital Product",
              title: data.title || "Custom Engineering Solution",
              challenge: data.challenge || "",
              solution: data.solution || "",
              techStack: data.techStack || "",
              outcome: data.outcome || "",
              metric: data.metric || "N/A",
              gradient: data.gradient || (idx % 3 === 0 ? "from-amber-600/20 to-orange-950/45" : idx % 3 === 1 ? "from-purple-600/20 to-indigo-950/45" : "from-blue-600/20 to-cyan-950/45"),
              heightClass: idx === 2 ? "min-h-[480px] lg:h-[500px] md:col-span-2 max-w-4xl mx-auto w-full" : "min-h-[480px] lg:h-[520px]"
            } as Project;
          });
          // If we have custom projects in DB, use them (we take the first 3 for homepage)
          setProjects(list.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch projects for homepage portfolio, using static fallback:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-bg relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
              Case Studies
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-text-main tracking-tight mt-2">
              Featured Case Studies
            </h2>
          </div>
          <p className="text-text-muted max-w-sm leading-relaxed text-sm md:text-base">
            Detailed breakdown of how we solve complex problems with clean custom engineering and conversion architecture.
          </p>
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="py-20 text-center text-text-muted text-sm flex flex-col items-center gap-3 font-mono">
            <RefreshCw className="w-6 h-6 animate-spin text-primary-orange" />
            Loading project data...
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={fadeUpVariant}
                className={`group relative overflow-hidden rounded-[24px] border border-white/[0.06] bg-surface ${project.heightClass} transition-all duration-300 hover:border-primary-orange/20 flex flex-col justify-between p-8`}
              >
                {/* Cover Gradient/Mockup representation */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none z-0`} />
                
                {/* Technical Grid Accent inside card */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />

                {/* Bottom Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none z-0" />

                {/* Top Row: Industry & Metric */}
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase text-primary-orange font-bold tracking-widest font-mono">
                      {project.industry}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold font-heading text-text-main mt-1">
                      {project.client}
                    </h3>
                  </div>
                  <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.1] rounded-full px-3.5 py-1.5 text-[10px] font-bold text-text-main flex items-center gap-1 shadow-lg shadow-black/25">
                    <span className="w-1.5 h-1.5 bg-primary-orange rounded-full"></span>
                    {project.metric}
                  </div>
                </div>

                {/* Case Study Details Format: Challenge -> Solution -> Tech -> Outcome */}
                <div className="relative z-10 space-y-4 my-8 md:my-10 text-xs md:text-sm text-text-muted">
                  <div>
                    <span className="text-text-main font-semibold block uppercase tracking-wider text-[10px] mb-0.5">Challenge</span>
                    <p className="leading-relaxed">{project.challenge}</p>
                  </div>
                  <div>
                    <span className="text-text-main font-semibold block uppercase tracking-wider text-[10px] mb-0.5">Solution</span>
                    <p className="leading-relaxed">{project.solution}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/[0.05]">
                    <div>
                      <span className="text-text-main font-semibold block uppercase tracking-wider text-[10px] mb-0.5">Tech Stack</span>
                      <p className="text-text-muted/80 font-mono text-[11px]">{project.techStack}</p>
                    </div>
                    <div>
                      <span className="text-text-main font-semibold block uppercase tracking-wider text-[10px] mb-0.5">Outcome</span>
                      <p className="text-primary-orange font-semibold text-[11px]">{project.outcome}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: CTA Link */}
                <div className="relative z-10 flex justify-between items-center pt-4 border-t border-white/[0.05]">
                  <span className="flex items-center gap-1.5 text-xs text-text-muted font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Technical Audit Passed
                  </span>
                  <div className="flex items-center gap-1 text-xs text-primary-orange font-bold font-mono group-hover:translate-x-1 transition-transform">
                    View Case Study <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <Link href="/portfolio" className="absolute inset-0 z-30" aria-label={`Read case study for ${project.client}`} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Explore CTA */}
        <div className="mt-16 text-center">
          <Link 
            href="/portfolio" 
            className="group relative inline-flex items-center justify-center border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] text-text-main font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 gap-2"
          >
            Explore All 5 Case Studies
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
