"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, RefreshCw } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  avatarGradient: string;
}

const staticTestimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Optify360 didn't just build our platform; they engineered our entire growth engine. Their Next.js architectures and custom AI automation pipelines allowed us to scale to 50k monthly active users without hiring additional support reps. Their technical SEO strategy drove a 310% increase in inbound enterprise sign-ups.",
    author: "Sarah Jenkins",
    role: "Chief Technology Officer",
    company: "Veloce Analytics",
    initials: "SJ",
    avatarGradient: "from-orange-500 to-amber-500",
  },
  {
    id: "2",
    quote: "Partnering with Md Arsalan and the Optify360 team was a game-changer. They rebuilt our legacy web app from scratch, boosting speed by 250% and conversion rate by 42%. They operate as a strategic business partner, not a dev shop.",
    author: "David Vance",
    role: "VP of Product",
    company: "ScaleFlow Systems",
    initials: "DV",
    avatarGradient: "from-blue-500 to-indigo-500",
  },
  {
    id: "3",
    quote: "Optify360 delivered a top-tier brand identity and a lightning-fast headless website in record time. Their technical SEO knowledge is unmatched—within 90 days, we were ranking #1 for three of our highest-value enterprise keywords.",
    author: "Elena Rostova",
    role: "Founder & CEO",
    company: "Novus HR",
    initials: "ER",
    avatarGradient: "from-pink-500 to-rose-500",
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

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list = snapshot.docs.map((doc, idx) => {
            const data = doc.data();
            
            // Generate initials
            const author = data.author || "Anonymous";
            const initials = author.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
            
            // Gradient options
            const gradients = ["from-orange-500 to-amber-500", "from-blue-500 to-indigo-500", "from-pink-500 to-rose-500", "from-emerald-500 to-teal-500"];
            
            return {
              id: doc.id,
              quote: data.quote || "",
              author,
              role: data.role || "Client",
              company: data.company || "Brand",
              initials,
              avatarGradient: data.avatarGradient || gradients[idx % gradients.length],
            } as Testimonial;
          });
          setTestimonials(list);
        }
      } catch (error) {
        console.error("Failed to load testimonials from Firestore, using static data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  return (
    <section className="py-16 md:py-20 bg-bg relative overflow-hidden">
      {/* Background glow node */}
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-primary-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
            Client Success
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-heading text-text-main tracking-tight mt-2">
            Partners in Scale
          </h2>
          <p className="text-text-muted text-sm md:text-base leading-relaxed">
            See how custom software engineering and targeted technical positioning translate to enterprise leverage.
          </p>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="py-20 text-center text-text-muted text-sm flex flex-col items-center gap-3 font-mono">
            <RefreshCw className="w-6 h-6 animate-spin text-primary-orange" />
            Loading testimonials...
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.id}
                variants={fadeUpVariant}
                className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 relative shadow-xl flex flex-col justify-between group hover:border-primary-orange/20 hover:bg-white/[0.04] transition-all duration-300 animate-fade-in"
              >
                {/* Light glow node on hover top-left */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary-orange/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-primary-orange/20 absolute top-6 right-8 group-hover:text-primary-orange/30 transition-colors pointer-events-none" />

                {/* Quote Text */}
                <p className="text-text-main/90 italic leading-relaxed text-sm md:text-base relative z-10 pt-4 mb-8">
                  "{t.quote}"
                </p>

                {/* Profile details */}
                <div className="flex items-center gap-4 relative z-10 pt-4 border-t border-white/[0.05]">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.avatarGradient} flex items-center justify-center text-text-main font-heading font-bold text-sm border border-white/10 shrink-0 shadow-inner`}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-heading text-text-main">
                      {t.author}
                    </h4>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      {t.role}, <span className="text-primary-orange font-semibold">{t.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
