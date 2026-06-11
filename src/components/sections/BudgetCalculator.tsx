"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitBudgetCalculator } from "@/app/actions";
import { Calculator, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const PROJECT_TYPES = [
  { id: "webapp", label: "Web Application", icon: "🌐" },
  { id: "mobile", label: "Mobile Platform", icon: "📱" },
  { id: "ai", label: "AI & Automation", icon: "🤖" },
  { id: "design", label: "Design System", icon: "🎨" },
];

const TIMELINES = [
  { id: "fast", label: "1-2 Months" },
  { id: "medium", label: "3-6 Months" },
  { id: "flexible", label: "Flexible" },
];

const BUDGETS = [
  { id: "tier1", label: "₹75,000 - ₹1,20,000" },
  { id: "tier2", label: "₹1,20,000 - ₹2,50,000" },
  { id: "tier3", label: "₹2,50,000 - ₹5,00,000" },
  { id: "tier4", label: "₹5,00,000+" },
];

export default function BudgetCalculator() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("webapp");
  const [timeline, setTimeline] = useState("medium");
  const [budget, setBudget] = useState("tier2");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setStatus({ type: "error", message: "Name and Email are required." });
      return;
    }

    setLoading(true);
    setStatus(null);

    const typeLabel = PROJECT_TYPES.find((t) => t.id === projectType)?.label || projectType;
    const timelineLabel = TIMELINES.find((t) => t.id === timeline)?.label || timeline;
    const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label || budget;

    const result = await submitBudgetCalculator({
      name,
      email,
      company,
      projectType: typeLabel,
      timeline: timelineLabel,
      budget: budgetLabel,
      details,
    });

    setLoading(false);

    if (result.success) {
      setStatus({ type: "success", message: result.message || "Lead submitted successfully." });
      setName("");
      setEmail("");
      setCompany("");
      setDetails("");
    } else {
      setStatus({ type: "error", message: result.error || "Submission failed." });
    }
  };

  return (
    <section id="calculator" className="relative py-32 px-6 md:px-12 lg:px-24 bg-brand-black w-full overflow-hidden">
      {/* Background space glow */}
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-brand-orange/[0.02] blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] font-mono text-brand-orange mb-6 uppercase tracking-widest"
          >
            <Calculator className="w-3.5 h-3.5" />
            Interactive System Cost Calculator
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-brand-text mb-6 font-heading tracking-tighter leading-none"
          >
            Estimate Your Investment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-brand-muted max-w-xl mx-auto font-sans"
          >
            Configure your technical scope requirements to calculate the approximate budget ranges for your digital growth systems.
          </motion.p>
        </div>

        {/* Dashboard Grid Cockpit */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 md:p-12 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Step 1: Project Type */}
            <div>
              <label className="block text-xs font-mono text-brand-muted uppercase tracking-widest mb-4">
                1. Select System Architecture
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setProjectType(type.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all duration-300 cursor-pointer ${
                      projectType === type.id
                        ? "border-brand-orange bg-brand-orange/10 text-brand-text shadow-[0_0_20px_rgba(255,107,0,0.1)]"
                        : "border-white/[0.05] bg-white/[0.01] text-brand-muted hover:border-white/[0.15]"
                    }`}
                  >
                    <span className="text-3xl mb-3">{type.icon}</span>
                    <span className="text-xs font-bold font-sans tracking-wide">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Timeline */}
            <div>
              <label className="block text-xs font-mono text-brand-muted uppercase tracking-widest mb-4">
                2. Target Launch Timeline
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIMELINES.map((time) => (
                  <button
                    key={time.id}
                    type="button"
                    onClick={() => setTimeline(time.id)}
                    className={`p-4 rounded-xl border text-center text-xs font-bold transition-all duration-300 cursor-pointer ${
                      timeline === time.id
                        ? "border-brand-orange bg-brand-orange/10 text-brand-text shadow-[0_0_20px_rgba(255,107,0,0.1)]"
                        : "border-white/[0.05] bg-white/[0.01] text-brand-muted hover:border-white/[0.15]"
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Budget Range */}
            <div>
              <label className="block text-xs font-mono text-brand-muted uppercase tracking-widest mb-4">
                3. Target Budget Scope
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {BUDGETS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBudget(bg.id)}
                    className={`p-4 rounded-xl border text-center text-xs font-bold transition-all duration-300 cursor-pointer ${
                      budget === bg.id
                        ? "border-brand-orange bg-brand-orange/10 text-brand-text shadow-[0_0_20px_rgba(255,107,0,0.1)]"
                        : "border-white/[0.05] bg-white/[0.01] text-brand-muted hover:border-white/[0.15]"
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: User Info */}
            <div>
              <label className="block text-xs font-mono text-brand-muted uppercase tracking-widest mb-4">
                4. Dispatch Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="calc-name" className="block text-[10px] font-mono text-brand-muted uppercase mb-2">
                    Name *
                  </label>
                  <input
                    id="calc-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-brand-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-orange focus:bg-brand-black/60 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="calc-email" className="block text-[10px] font-mono text-brand-muted uppercase mb-2">
                    Email Address *
                  </label>
                  <input
                    id="calc-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@domain.com"
                    className="w-full bg-brand-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-orange focus:bg-brand-black/60 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="calc-company" className="block text-[10px] font-mono text-brand-muted uppercase mb-2">
                    Company Name
                  </label>
                  <input
                    id="calc-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-brand-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-orange focus:bg-brand-black/60 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Details */}
            <div>
              <label htmlFor="calc-details" className="block text-[10px] font-mono text-brand-muted uppercase mb-2">
                Project Scope Details
              </label>
              <textarea
                id="calc-details"
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Briefly explain what you want to build (key integrations, APIs, schemas, pages)..."
                className="w-full bg-brand-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-sm text-brand-text focus:outline-none focus:border-brand-orange focus:bg-brand-black/60 transition-colors resize-none"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-white/[0.05]">
              <div>
                <AnimatePresence mode="wait">
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`flex items-center gap-2 text-sm ${
                        status.type === "success" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {status.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span>{status.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative group overflow-hidden flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-orange text-brand-black font-semibold tracking-wide transition-all duration-300 hover:bg-brand-dark-orange cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    Calculate Investment <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
