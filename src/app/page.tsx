import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import BentoServices from "@/components/sections/BentoServices";
import HorizontalScrollPortfolio from "@/components/sections/HorizontalScrollPortfolio";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import BudgetCalculator from "@/components/sections/BudgetCalculator";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/Footer";
import { FAQSchema, OrganizationSchema } from "@/components/json-ld";

export default function Home() {
  const faqs = [
    {
      question: "What core tech stack does BLACKHOLE engineer on?",
      answer: "We engineer high-performance platforms using Next.js 15, React 19, Tailwind CSS v4, and Framer Motion. For backend services, we integrate Go, Rust, Python API routers, Redis caching networks, and headless CMS frameworks to maintain speed and telemetry control."
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

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-brand-black text-brand-text font-sans antialiased overflow-x-hidden selection:bg-brand-orange selection:text-brand-black">
        {/* Schema Markup for SEO */}
        <OrganizationSchema />
        <FAQSchema questions={faqs} />

        {/* Global atmospheric background grid */}
        <div className="absolute inset-0 glowing-grid pointer-events-none opacity-20" />

        {/* Navigation Header */}
        <Header />

        {/* Main Content Sections */}
        <main className="w-full flex flex-col">
          {/* Hero Section */}
          <Hero />

          {/* TrustBar (Logo marquee) */}
          <TrustBar />

          {/* Bento Services Section */}
          <BentoServices />

          {/* Horizontal Scroll Portfolio Section */}
          <HorizontalScrollPortfolio />

          {/* Vertical Sticky Process Steps */}
          <Process />

          {/* Testimonials Parallax Columns */}
          <Testimonials />

          {/* Budget Calculator (Pricing and lead qualification) */}
          <BudgetCalculator />

          {/* ContactForm (Lead capturing with direct channels) */}
          <ContactForm />

          {/* Interactive FAQ Accordions */}
          <FAQ />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
