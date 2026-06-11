"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "SaaS Development",
    message: ""
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "SaaS Development",
          message: ""
        });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column (Information & Trust) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full inline-flex">
                  Get in touch
                </span>
                <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-main tracking-tight leading-none mt-2">
                  Partner with <span className="text-gradient">Optify360</span>
                </h1>
                <p className="text-text-muted text-sm md:text-base leading-relaxed">
                  Ready to scale your organic pipeline, automate manual work, or engineer a cloud-native SaaS application? Set up a scoping call with our engineering team today.
                </p>
              </div>

              {/* Steps/Expectations */}
              <div className="space-y-6 pt-6 border-t border-white/[0.05]">
                <h3 className="text-sm font-bold font-heading uppercase text-text-main tracking-wider">
                  What Happens Next?
                </h3>
                <ol className="space-y-4 text-sm text-text-muted">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-xs text-primary-orange font-bold font-mono shrink-0 mt-0.5">1</span>
                    <span><strong>Technical Audit:</strong> We review your tech stack and growth metrics.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-xs text-primary-orange font-bold font-mono shrink-0 mt-0.5">2</span>
                    <span><strong>Scoping Strategy:</strong> You speak directly with founder Md Arsalan to architect the workflow.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-xs text-primary-orange font-bold font-mono shrink-0 mt-0.5">3</span>
                    <span><strong>Bespoke Proposal:</strong> We deliver a project roadmap outlining milestones and deliverables.</span>
                  </li>
                </ol>
              </div>

              {/* Direct coordinates details */}
              <div className="space-y-3 pt-6 border-t border-white/[0.05] text-xs text-text-muted font-mono">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-primary-orange" />
                  <span>optify360official@gmail.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary-orange" />
                  <span>+1-800-555-0199</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-primary-orange" />
                  <span>Suite 100, Tech District, New Delhi, IN</span>
                </div>
              </div>
            </div>

            {/* Right Column (Form Container) */}
            <div className="lg:col-span-7 relative">
              {/* Backing Ambient Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-orange to-secondary-orange rounded-3xl blur-[80px] opacity-10 pointer-events-none" />

              {/* Form Card */}
              <div className="glass-panel rounded-2xl p-8 border border-white/[0.08] relative">
                {status === "success" ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-text-main">
                      Consultation Request Sent
                    </h2>
                    <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                      Thank you for contacting Optify360. We have successfully registered your inquiry in our database. An email alert has been dispatched to Md Arsalan, and we will get back to you within 24 hours.
                    </p>
                    <button 
                      onClick={() => setStatus("idle")} 
                      className="mt-6 text-xs text-primary-orange font-bold font-mono hover:underline uppercase tracking-wider"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={status === "loading"}
                          placeholder="Sarah Jenkins"
                          className="w-full bg-bg border border-white/[0.08] focus:border-primary-orange/60 rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted/40 focus:outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={status === "loading"}
                          placeholder="sarah@veloceanalytics.com"
                          className="w-full bg-bg border border-white/[0.08] focus:border-primary-orange/60 rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted/40 focus:outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone */}
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={status === "loading"}
                          placeholder="+1 (555) 0199"
                          className="w-full bg-bg border border-white/[0.08] focus:border-primary-orange/60 rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted/40 focus:outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                      
                      {/* Company */}
                      <div className="space-y-2">
                        <label htmlFor="company" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
                          Company Name (Optional)
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          disabled={status === "loading"}
                          placeholder="Veloce Analytics"
                          className="w-full bg-bg border border-white/[0.08] focus:border-primary-orange/60 rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted/40 focus:outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Service selection */}
                    <div className="space-y-2">
                      <label htmlFor="service" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
                        Solution Requested
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        disabled={status === "loading"}
                        className="w-full bg-bg border border-white/[0.08] focus:border-primary-orange/60 rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none transition-colors disabled:opacity-50 appearance-none cursor-pointer"
                      >
                        <option value="SaaS Development">Enterprise SaaS & Web Engineering</option>
                        <option value="Technical SEO">Data-Driven SEO Campaign</option>
                        <option value="AI Automation">Intelligent AI & Workflows</option>
                        <option value="Web Development">Headless CMS & Frontend</option>
                        <option value="Design Systems">Branding & Design Systems</option>
                        <option value="CRO Funnel">Conversion Rate CRO & Funnels</option>
                        <option value="General Inquiry">General Inquiry / Strategy Scoping</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-semibold text-text-muted uppercase tracking-wider font-heading">
                        Project Details / Inquiry Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={status === "loading"}
                        rows={5}
                        placeholder="Tell us about your product goals, timeline, and current scaling bottlenecks..."
                        className="w-full bg-bg border border-white/[0.08] focus:border-primary-orange/60 rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted/40 focus:outline-none transition-colors disabled:opacity-50 resize-none"
                      />
                    </div>

                    {/* Feedback messages */}
                    {status === "error" && (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-400">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{errorMessage}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-primary-orange hover:bg-primary-orange/90 disabled:bg-primary-orange/50 text-text-main font-semibold py-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-primary-orange/20"
                    >
                      {status === "loading" ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-text-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Scoping Details...
                        </>
                      ) : (
                        <>
                          Book Consultation Call <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
