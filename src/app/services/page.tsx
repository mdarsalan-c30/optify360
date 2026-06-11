import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code, Zap, Cpu, Terminal, Sparkles, BarChart2, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export const metadata: Metadata = {
  title: "Enterprise Digital Services | SaaS, SEO & AI Systems | Optify360",
  description: "Discover how Optify360 scales businesses using Custom Web & SaaS Development, Advanced SEO, Brand Identity, and Intelligent Automation systems.",
};

interface ServiceItem {
  id: string | number;
  name: string;
  headline: string;
  text: string;
  iconName: string;
  pillars: string[];
}

const staticServices: ServiceItem[] = [
  {
    id: "saas",
    name: "Enterprise SaaS & Web App Engineering",
    headline: "Scalable, secure, and production-ready applications built to perform.",
    text: "We engineer cloud-native, multi-tenant software architectures that handle heavy workloads and offer flawless user experiences. From technical scoping to final deployment, we build code that scales.",
    iconName: "Code",
    pillars: [
      "Full-Stack Next.js & React: Modern, component-driven development using TypeScript for robust type safety.",
      "Advanced API Architectures: Fast, secure REST and GraphQL endpoints designed for horizontal scalability.",
      "Secure Infrastructure: GDPR/HIPAA compliant database setups with robust OAuth2/SSO authentication."
    ]
  },
  {
    id: "seo",
    name: "Data-Driven Search Engine Optimization (SEO)",
    headline: "Dominate high-intent search queries. Turn traffic into revenue.",
    text: "Standard agency SEO is outdated. We focus on search intent, semantic matching, and technical speed. We construct optimized site structures and high-authority link-building campaigns that place your brand where buyers are looking.",
    iconName: "Zap",
    pillars: [
      "Technical Architecture Optimization: Core Web Vitals optimization, programmatic page generation, and schema automation.",
      "Semantic & Intent Keyword Mapping: Targeting bottom-of-funnel (BOFU) terms that generate qualified leads.",
      "Authority Building & Digital PR: Strategic, high-quality backlink campaigns from reputable industry publications."
    ]
  },
  {
    id: "ai",
    name: "Intelligent AI Automation Systems",
    headline: "Automate manual overhead. Scale operations with custom AI workflows.",
    text: "Human labor is expensive and prone to bottlenecks. We develop custom AI agents, LLM integrations, and automated workflows that streamline operations, reduce human error, and free up your team for high-value tasks.",
    iconName: "Cpu",
    pillars: [
      "Custom AI Agent Pipelines: Tailored LLM agents using OpenAI, Claude, and LangChain to automate business processes.",
      "Operational Integration: Automated workflows mapping across CRM (HubSpot, Salesforce), email, and internal databases.",
      "Cognitive Search & Retrieval: RAG (Retrieval-Augmented Generation) systems that make internal documentation instantly searchable."
    ]
  },
  {
    id: "web",
    name: "Headless Web & Custom Frontend Development",
    headline: "Ultra-fast, responsive web interfaces built for high conversions.",
    text: "Your website is your digital storefront. We construct bespoke, accessible, and fast web experiences using headless CMS setups without sacrificing performance.",
    iconName: "Terminal",
    pillars: [
      "Under 1.2s Load Times: Hand-coded frontend optimization yielding a 100/100 Google Lighthouse score.",
      "Headless CMS Integration: Flexible editing via Sanity, Strapi, or Contentful without compromising on site performance.",
      "WCAG Accessibility Compliant: Fully inclusive frontend design optimized for all screen sizes and users."
    ]
  },
  {
    id: "branding",
    name: "Strategic Brand Identity & Design Systems",
    headline: "Establish authority with a visual identity that commands premium pricing.",
    text: "A premium service needs premium branding. We craft holistic visual guidelines, digital design systems, and marketing collateral that signal enterprise-level capability.",
    iconName: "Sparkles",
    pillars: [
      "Corporate Branding Strategy: Positioning, target audience profiling, and brand tone guidelines.",
      "Bespoke Visual Identity: Typography, color palettes, and custom vector logos optimized for digital and print.",
      "UI/UX Design Systems: High-fidelity Figma libraries that ensure consistency across all present and future assets."
    ]
  },
  {
    id: "growth",
    name: "Growth Systems & Conversion Rate Optimization (CRO)",
    headline: "Maximize your pipeline. Transform traffic into revenue.",
    text: "We engineer high-converting sales funnels, optimize customer journeys, and implement complete marketing attribution setups so you know exactly where every dollar originates.",
    iconName: "BarChart2",
    pillars: [
      "A/B Testing & User Insights: Continuous hypothesis-driven testing of headlines, CTAs, and layout options.",
      "Attribution & Analytics Engineering: Clean Google Analytics 4, Google Tag Manager, and Mixpanel setups.",
      "High-Intent Landing Pages: Speed-optimized landing pages configured specifically for paid media campaigns."
    ]
  }
];

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

export default async function ServicesPage() {
  let services = [...staticServices];

  try {
    const q = query(collection(db, "services"), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      services = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          headline: data.headline || "",
          text: data.description || "",
          iconName: data.iconName || "Code",
          // Support both array and comma-separated string formats
          pillars: Array.isArray(data.pillars) 
            ? data.pillars 
            : (data.pillars ? data.pillars.split(",").map((s: string) => s.trim()) : [])
        };
      });
    }
  } catch (error) {
    console.error("Failed to load services on server:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#F5F5F5]">
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="max-w-3xl mb-20 space-y-4">
            <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
              Our Capabilities
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-text-main tracking-tight mt-2">
              Bespoke Engineering & <span className="text-gradient">Growth Systems</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg leading-relaxed">
              We design, build, and optimize high-leverage software architectures and targeted growth strategies. Every service is hand-crafted around your specific pipeline goals.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              return (
                <div 
                  key={service.id} 
                  className="bg-surface border border-white/[0.05] rounded-3xl p-8 hover:border-primary-orange/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle inner corner glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-primary-orange shrink-0">
                        {renderIcon(service.iconName)}
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-heading text-text-main group-hover:text-primary-orange transition-colors">
                        {service.name}
                      </h2>
                    </div>

                    {/* Headline */}
                    <p className="text-xs font-semibold text-primary-orange/80 font-mono tracking-wide mt-4 uppercase">
                      {service.headline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-text-muted mt-3 leading-relaxed">
                      {service.text}
                    </p>
                  </div>

                  {/* Pillars */}
                  <div className="mt-8 pt-6 border-t border-white/[0.05]">
                    <h4 className="text-xs font-bold font-heading uppercase text-text-main tracking-wider mb-4">
                      Key Capabilities:
                    </h4>
                    <ul className="space-y-3.5">
                      {service.pillars.map((pillar, idx) => {
                        const colonIdx = pillar.indexOf(":");
                        let title = "";
                        let desc = pillar;

                        if (colonIdx !== -1) {
                          title = pillar.substring(0, colonIdx + 1);
                          desc = pillar.substring(colonIdx + 1);
                        }

                        return (
                          <li key={idx} className="flex items-start gap-2 text-xs text-text-muted leading-relaxed">
                            <Check className="w-4 h-4 text-primary-orange shrink-0 mt-0.5" />
                            <span>
                              {title && <strong className="text-text-main font-semibold">{title} </strong>}
                              {desc}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
