"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/75 backdrop-blur-md border-b border-white/[0.05] shadow-lg shadow-black/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-heading font-extrabold text-2xl tracking-tight text-text-main flex items-center">
            Optify<span className="text-primary-orange">360</span>
            <span className="w-1.5 h-1.5 bg-primary-orange rounded-full ml-1 animate-pulse"></span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative py-2 ${
                  isActive ? "text-primary-orange" : "text-text-muted hover:text-text-main"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-orange rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center bg-primary-orange hover:bg-primary-orange/95 text-text-main text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-orange/20 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1">
              Book Consultation <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-text-muted hover:text-text-main focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-b border-white/[0.05] bg-bg/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg font-medium py-2 transition-colors ${
                      isActive ? "text-primary-orange" : "text-text-muted hover:text-text-main"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <hr className="border-white/[0.05] my-2" />
              <Link
                href="/contact"
                className="w-full text-center bg-primary-orange hover:bg-primary-orange/90 text-text-main font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                Book Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
