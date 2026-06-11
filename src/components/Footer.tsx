"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "Newsletter Subscription" }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setEmail("");
        setMessage("Thank you for subscribing!");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Connection error. Please try again later.");
    }
  };

  return (
    <footer className="bg-surface border-t border-white/[0.05] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-[80px] grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-text-main">
              Optify<span className="text-primary-orange">360</span>
            </span>
          </Link>
          <p className="text-sm text-text-muted leading-relaxed max-w-xs">
            Architecting elite digital products that fuel hyper-growth. Custom software development, advanced SEO, and AI operations.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary-orange transition-colors">
              LinkedIn
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary-orange transition-colors">
              Twitter
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary-orange transition-colors">
              GitHub
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-text-main tracking-wider uppercase mb-6 font-heading">
            Solutions
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/services" className="text-text-muted hover:text-text-main transition-colors">
                SaaS Development
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-text-muted hover:text-text-main transition-colors">
                Technical SEO
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-text-muted hover:text-text-main transition-colors">
                AI Automation
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-text-muted hover:text-text-main transition-colors">
                Branding & Design
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Contact */}
        <div>
          <h4 className="text-sm font-semibold text-text-main tracking-wider uppercase mb-6 font-heading">
            Get in touch
          </h4>
          <ul className="space-y-4 text-sm text-text-muted">
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 mt-0.5 text-primary-orange shrink-0" />
              <div>
                <a href="mailto:optify360official@gmail.com" className="hover:text-text-main block">
                  optify360official@gmail.com
                </a>
                <a href="mailto:optify360@protonmail.com" className="hover:text-text-main block text-xs mt-1 text-text-muted/70">
                  optify360@protonmail.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 text-primary-orange shrink-0" />
              <span>Suite 100, Tech District,<br />New Delhi, India - 110001</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-sm font-semibold text-text-main tracking-wider uppercase mb-6 font-heading">
            Subscribe to Insiders
          </h4>
          <p className="text-xs text-text-muted mb-4 leading-relaxed">
            Get actionable engineering and marketing guides directly in your inbox. No fluff, just tactics.
          </p>
          <form onSubmit={handleSubscribe} className="relative mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading" || status === "success"}
              suppressHydrationWarning
              className="w-full bg-bg border border-white/[0.08] focus:border-primary-orange/60 rounded-xl px-4 py-3 text-sm text-text-main placeholder-text-muted/60 focus:outline-none pr-12 transition-colors duration-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              suppressHydrationWarning
              className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-primary-orange hover:bg-primary-orange/90 text-text-main flex items-center justify-center rounded-lg transition-all disabled:opacity-50"
              aria-label="Subscribe"
            >
              {status === "success" ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          {message && (
            <p className={`text-xs mt-2.5 font-medium ${status === "success" ? "text-emerald-400" : "text-rose-400"}`}>
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="border-t border-white/[0.05] py-6 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
          <p>© {new Date().getFullYear()} Optify360. All rights reserved. Founded by Md Arsalan.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-text-main">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-text-main">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
