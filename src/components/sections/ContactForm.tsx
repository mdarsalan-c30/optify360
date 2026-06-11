"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactForm } from "@/app/actions";
import { Mail, Shield, MessageSquare, CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";

const SERVICES = [
  { id: "webdev", label: "Web Development" },
  { id: "ai", label: "AI & Automation Workflows" },
  { id: "design", label: "Design Systems & UI/UX" },
  { id: "general", label: "General Inquiry" },
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("general");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus({ type: "error", message: "Please fill out all required fields." });
      return;
    }

    setLoading(true);
    setStatus(null);

    const serviceLabel = SERVICES.find((s) => s.id === service)?.label || service;

    const result = await submitContactForm({
      name,
      email,
      company,
      service: serviceLabel,
      message,
    });

    setLoading(false);

    if (result.success) {
      setStatus({ type: "success", message: result.message || "Message sent successfully." });
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } else {
      setStatus({ type: "error", message: result.error || "Message submission failed." });
    }
  };

  return (
    <section id="contact" className="relative py-32 px-6 md:px-12 lg:px-24 bg-brand-black w-full overflow-hidden border-t border-white/[0.04]">
      {/* Background Glow */}
      <div className="absolute bottom-1/3 left-0 w-[450px] h-[450px] bg-brand-orange/[0.02] blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 select-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Context Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-[10px] font-mono text-brand-orange mb-6 uppercase tracking-widest"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Secure Lead Dispatch
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-6 font-heading tracking-tighter leading-none">
                Let&apos;s Build Something Resilient
              </h2>
              <p className="text-brand-muted leading-relaxed font-sans text-xs sm:text-sm max-w-md">
                Have an ambitious system design or an indexation scale requirement? Transmit your metrics to our founder **Md Arsalan** directly.
              </p>
            </div>

            <div className="space-y-6">
              {/* Contact Card 1 */}
              <div className="flex items-start gap-5 p-5 rounded-2xl border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl shadow-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text mb-1 font-sans">Direct System Channels</h4>
                  <p className="text-[10px] text-[#8E8E93] leading-relaxed mb-2 font-mono">For direct project logs:</p>
                  <a href="mailto:optify360@protonmail.com" className="block text-sm text-brand-orange hover:underline font-mono">
                    optify360@protonmail.com
                  </a>
                  <a href="mailto:optify360official@gmail.com" className="block text-sm text-brand-orange hover:underline font-mono mt-1">
                    optify360official@gmail.com
                  </a>
                </div>
              </div>

              {/* Contact Card 2 */}
              <div className="flex items-start gap-5 p-5 rounded-2xl border border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl shadow-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text mb-1 font-sans">Zero-Trust Infrastructure</h4>
                  <p className="text-[10px] text-brand-muted leading-relaxed font-sans max-w-xs">
                    Leads logs are stored in Firestore databases behind secure authentication rules, ensuring your technical metadata is isolated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Form */}
          <div className="lg:col-span-7 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 md:p-10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label htmlFor="contact-name" className="text-[10px] font-mono text-brand-muted uppercase mb-1">
                    Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-transparent border-b border-white/10 py-3.5 text-base text-brand-text focus:outline-none focus:border-brand-orange transition-colors rounded-none placeholder:text-white/20 font-sans"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="contact-email" className="text-[10px] font-mono text-brand-muted uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full bg-transparent border-b border-white/10 py-3.5 text-base text-brand-text focus:outline-none focus:border-brand-orange transition-colors rounded-none placeholder:text-white/20 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label htmlFor="contact-company" className="text-[10px] font-mono text-brand-muted uppercase mb-1">
                    Company Name
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company (optional)"
                    className="w-full bg-transparent border-b border-white/10 py-3.5 text-base text-brand-text focus:outline-none focus:border-brand-orange transition-colors rounded-none placeholder:text-white/20 font-sans"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="contact-service" className="text-[10px] font-mono text-brand-muted uppercase mb-1">
                    System Category
                  </label>
                  <div className="relative">
                    <select
                      id="contact-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-3.5 text-base text-brand-text focus:outline-none focus:border-brand-orange transition-colors rounded-none appearance-none cursor-pointer font-sans"
                    >
                      {SERVICES.map((s) => (
                        <option key={s.id} value={s.id} className="bg-brand-surface text-brand-text">
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-xs">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="contact-message" className="text-[10px] font-mono text-brand-muted uppercase mb-1">
                  System Requirements / Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your design specifications or traffic objectives..."
                  className="w-full bg-transparent border-b border-white/10 py-3.5 text-base text-brand-text focus:outline-none focus:border-brand-orange transition-colors rounded-none placeholder:text-white/20 resize-none font-sans"
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6">
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
                      Transmitting...
                    </>
                  ) : (
                    <>
                      Transmit Metadata <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
