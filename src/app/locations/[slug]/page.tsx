import React from "react";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getLocationBySlug, getAllLocations } from "@/lib/locations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Process from "@/sections/Process";
import Portfolio from "@/sections/Portfolio";
import Testimonials from "@/sections/Testimonials";

// ISR Configuration (revalidate every 60 seconds to prevent cached 404s on new locations)
export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const locations = await getAllLocations();
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await getLocationBySlug(slug);
  if (!loc) return {};

  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    alternates: {
      canonical: `https://optify360.vercel.app/locations/${loc.slug}`,
    },
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loc = await getLocationBySlug(slug);

  if (!loc) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Optify360",
    "image": "https://optify360.vercel.app/og-image.jpg",
    "@id": `https://optify360.vercel.app/locations/${loc.slug}`,
    "url": `https://optify360.vercel.app/locations/${loc.slug}`,
    "telephone": "+918178125890",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": loc.localAddress || "New Delhi",
      "addressLocality": loc.city,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <SmoothScroll>
      <Navbar />
      <main className="min-h-screen bg-[#050505] text-white">
        <Script
          id={`schema-${loc.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-[#FF6B00]/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                Now Serving Clients in {loc.city}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-[1.1]">
                {loc.hasSpecificService && loc.specificServiceName ? (
                  <>Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8B3D]">{loc.specificServiceName}</span> in {loc.city}.</>
                ) : (
                  <>Elite Custom Web & App Development in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8B3D]">{loc.city}</span>.</>
                )}
              </h1>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
                {loc.metaDescription} Outrank competitors, engage users, and scale faster. We are {loc.city}'s premier choice for ambitious brands seeking undeniable digital authority.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/contact" className="px-8 py-4 bg-[#FF6B00] hover:bg-[#FF8B3D] text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  Start Your Project in {loc.city}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5" id="services">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                {loc.hasSpecificService && loc.specificServiceName ? `Why Choose Us for ${loc.specificServiceName} in ${loc.city}?` : `Top-Rated Digital Agency in ${loc.city}`}
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
                We don't just build websites; we engineer revenue-generating assets. Our local presence in {loc.city} ensures we understand your market perfectly.
              </p>
            </div>

            {loc.hasSpecificService && loc.specificServiceName && (loc.serviceDisplayMode === "specific_only" || loc.serviceDisplayMode === "both") && (
              <div className="mb-20 bg-gradient-to-br from-[#111] to-[#0a0a0a] p-10 md:p-16 rounded-[2.5rem] border border-[#FF6B00]/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#FF6B00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="text-[#FF6B00] font-bold tracking-wider uppercase text-sm mb-4">Specialized Local Expertise</div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{loc.specificServiceName} tailored for {loc.city}</h3>
                    <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                      Dominate your local market. Our specialized {loc.specificServiceName} solutions are engineered specifically for businesses operating in {loc.city}. We combine psychological design, cutting-edge tech, and local SEO dominance to guarantee unmatched ROI.
                    </p>
                    <a href="/contact" className="inline-flex items-center gap-2 text-[#FF6B00] font-bold hover:gap-4 transition-all">
                      Let's discuss your {loc.specificServiceName} needs <span>→</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
                        <div className="text-3xl mb-4">🚀</div>
                        <h4 className="text-white font-bold mb-2">Lightning Fast</h4>
                        <p className="text-zinc-500 text-sm">Optimized for maximum speed and conversion.</p>
                     </div>
                     <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
                        <div className="text-3xl mb-4">🎯</div>
                        <h4 className="text-white font-bold mb-2">Local SEO Dominance</h4>
                        <p className="text-zinc-500 text-sm">Engineered to outrank {loc.city} competitors.</p>
                     </div>
                     <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
                        <div className="text-3xl mb-4">💎</div>
                        <h4 className="text-white font-bold mb-2">Premium Aesthetic</h4>
                        <p className="text-zinc-500 text-sm">Psychology-driven UI/UX design.</p>
                     </div>
                     <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
                        <div className="text-3xl mb-4">🛡️</div>
                        <h4 className="text-white font-bold mb-2">Scalable Tech</h4>
                        <p className="text-zinc-500 text-sm">Built to grow with your {loc.city} business.</p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {(!loc.hasSpecificService || loc.serviceDisplayMode === "all_default" || loc.serviceDisplayMode === "both") && (
              <>
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-white mb-4">Our Comprehensive Services in {loc.city}</h3>
                  <div className="w-24 h-1 bg-[#FF6B00] mx-auto rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-[#FF6B00]/30 transition-all hover:-translate-y-2">
                    <h3 className="text-2xl font-bold mb-4 text-white">Custom Web Design</h3>
                    <p className="text-zinc-400 leading-relaxed">We build stunning, conversion-focused websites tailored for the {loc.city} market to help your brand stand out instantly.</p>
                  </div>
                  <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-[#FF6B00]/30 transition-all hover:-translate-y-2">
                    <h3 className="text-2xl font-bold mb-4 text-white">App Development</h3>
                    <p className="text-zinc-400 leading-relaxed">High-performance native iOS, Android, and cross-platform applications designed to scale {loc.city} businesses massively.</p>
                  </div>
                  <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-[#FF6B00]/30 transition-all hover:-translate-y-2">
                    <h3 className="text-2xl font-bold mb-4 text-white">SEO & Marketing</h3>
                    <p className="text-zinc-400 leading-relaxed">Dominate Google search rankings, crush local {loc.city} competitors, and attract an influx of high-paying customers.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Portfolio />
        <Process />
        <Testimonials />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
