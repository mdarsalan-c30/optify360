"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitBudgetCalculator } from "@/app/actions";
import { Calculator, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const PROJECT_TYPES = [
  { id: "webapp", label: "Web Application", icon: "🌐" },
  { id: "mobile", label: "Mobile App", icon: "📱" },
  { id: "ai", label: "AI & Automation", icon: "🤖" },
  { id: "design", label: "Design System / UI/UX", icon: "🎨" },
];

const TIMELINES = [
  { id: "fast", label: "1-2 Months" },
  { id: "medium", label: "3-6 Months" },
  { id: "flexible", label: "Flexible Timeline" },
];

const BUDGETS = [
  { id: "tier1", label: "$5,000 - $10,000" },
  { id: "tier2", label: "$10,000 - $25,000" },
  { id: "tier3", label: "$25,000 - $50,000" },
  { id: "tier4", label: "$50,000+" },
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
      // Reset form
      setName("");
      setEmail("");
      setCompany("");
      setDetails("");
    } else {
      setStatus({ type: "error", message: result.error || "Submission failed." });
    }
  };

  return (
    <section id="calculator" className="relative py-24 px-6 md:px-12 lg:px-24 bg-brand-black w-full overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-surface text-xs font-mono text-brand-orange mb-4 uppercase tracking-wider"
          >
            <Calculator className="w-3.5 h-3.5" />
            Estimate Your System
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-brand-text mb-4"
          >
            Budget & Project Calculator
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-brand-muted max-w-xl mx-auto"
          >
            Configure your development requirements and get an instant estimation for your digital systems.
          </motion.p>
        </div>

        <div className="bg-brand-surface/50 border border-brand-text/5 rounded-2xl p-6 md:p-10 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Project Type */}
            <div>
              <label className="block text-sm font-mono text-brand-muted uppercase tracking-wider mb-4">
                1. Select Project Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setProjectType(type.id)}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                      projectType === type.id
                        ? "border-brand-orange bg-brand-orange/5 text-brand-text"
                        : "border-brand-text/10 bg-brand-black/30 text-brand-muted hover:border-brand-text/20"
                    }`}
                  >
                    <span className="text-3xl mb-2">{type.icon}</span>
                    <span className="text-sm font-semibold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Target Timeline */}
            <div>
              <label className="block text-sm font-mono text-brand-muted uppercase tracking-wider mb-4">
                2. Target Launch Timeline
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIMELINES.map((time) => (
                  <button
                    key={time.id}
                    type="button"
                    onClick={() => setTimeline(time.id)}
                    className={`p-4 rounded-xl border text-center font-semibold transition-all duration-300 cursor-pointer ${
                      timeline === time.id
                        ? "border-brand-orange bg-brand-orange/5 text-brand-text"
                        : "border-brand-text/10 bg-brand-black/30 text-brand-muted hover:border-brand-text/20"
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Estimated Budget */}
            <div>
              <label className="block text-sm font-mono text-brand-muted uppercase tracking-wider mb-4">
                3. Approximate Budget Range
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {BUDGETS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBudget(bg.id)}
                    className={`p-4 rounded-xl border text-center font-semibold transition-all duration-300 cursor-pointer ${
                      budget === bg.id
                        ? "border-brand-orange bg-brand-orange/5 text-brand-text"
                        : "border-brand-text/10 bg-brand-black/30 text-brand-muted hover:border-brand-text/20"
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Contact & Project Info */}
            <div>
              <label className="block text-sm font-mono text-brand-muted uppercase tracking-wider mb-4">
                4. Lead Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="calc-name" className="block text-xs text-brand-muted mb-2">
                    Your Name *
                  </label>
                  <input
                    id="calc-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Satoshi Nakamoto"
                    className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="calc-email" className="block text-xs text-brand-muted mb-2">
                    Email Address *
                  </label>
                  <input
                    id="calc-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="satoshi@domain.com"
                    className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="calc-company" className="block text-xs text-brand-muted mb-2">
                    Company Name
                  </label>
                  <input
                    id="calc-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Step 5: Details */}
            <div>
              <label htmlFor="calc-details" className="block text-xs text-brand-muted mb-2">
                Project Scope / Key Features
              </label>
              <textarea
                id="calc-details"
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what you want to build (e.g. database schema, payment system, integrations, page structures, dashboard designs...)"
                className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors resize-none"
              />
            </div>

            {/* Submit & Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-brand-text/5">
              <div>
                <AnimatePresence mode="wait">
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
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
                className="relative group overflow-hidden flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-brand-orange text-brand-black font-semibold tracking-wide transition-all duration-300 hover:bg-brand-dark-orange cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Systems...
                  </>
                ) : (
                  <>
                    Submit Lead System <Sparkles className="w-4 h-4" />
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
