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
      // Reset form
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } else {
      setStatus({ type: "error", message: result.error || "Message submission failed." });
    }
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 lg:px-24 bg-brand-black w-full overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-brand-orange/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Direct info & context */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-orange/20 bg-brand-surface text-xs font-mono text-brand-orange mb-4 uppercase tracking-wider"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Get In Touch
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-5xl font-extrabold text-brand-text mb-6 leading-tight"
              >
                Let&apos;s Build Something Resilient
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-brand-muted leading-relaxed"
              >
                Have a project or general query? Send our engineers a message. We usually respond within 12 hours with deep technical feedback.
              </motion.p>
            </div>

            <div className="space-y-6">
              {/* Contact card 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-brand-text/5 bg-brand-surface/30">
                <div className="p-3 rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text mb-1">Direct Channels</h4>
                  <p className="text-xs text-brand-muted mb-1">For secure proposals & operations:</p>
                  <a href="mailto:optify360@protonmail.com" className="block text-sm text-brand-orange hover:underline font-mono">
                    optify360@protonmail.com
                  </a>
                  <a href="mailto:optify360official@gmail.com" className="block text-sm text-brand-orange hover:underline font-mono">
                    optify360official@gmail.com
                  </a>
                </div>
              </div>

              {/* Contact card 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-brand-text/5 bg-brand-surface/30">
                <div className="p-3 rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-brand-text mb-1">Privacy & Architecture</h4>
                  <p className="text-xs text-brand-muted leading-normal">
                    All communications and database records are hosted on secure, encrypted Firestore servers adhering to modern zero-trust standards.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-brand-surface/50 border border-brand-text/5 rounded-2xl p-6 md:p-8 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-brand-muted uppercase mb-2">
                    Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-brand-muted uppercase mb-2">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@domain.com"
                    className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-company" className="block text-xs font-mono text-brand-muted uppercase mb-2">
                    Company Name
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="contact-service" className="block text-xs font-mono text-brand-muted uppercase mb-2">
                    Primary Service Need
                  </label>
                  <select
                    id="contact-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors appearance-none cursor-pointer"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id} className="bg-brand-surface text-brand-text">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-brand-muted uppercase mb-2">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your project requirements, challenges, or goals..."
                  className="w-full bg-brand-black/50 border border-brand-text/10 rounded-lg px-4 py-3 text-brand-text focus:outline-none focus:border-brand-orange transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
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
                      Initiating Link...
                    </>
                  ) : (
                    <>
                      Transmit Message <Send className="w-4 h-4" />
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
