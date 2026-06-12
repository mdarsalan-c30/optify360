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

// ISR Configuration (revalidate every 24 hours)
export const revalidate = 86400;

export async function generateStaticParams() {
  const locations = await getAllLocations();
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const loc = await getLocationBySlug(params.slug);
  if (!loc) return {};

  return {
    title: loc.metaTitle,
    description: loc.metaDescription,
    alternates: {
      canonical: `https://optify360.vercel.app/locations/${loc.slug}`,
    },
  };
}

export default async function LocationPage({ params }: { params: { slug: string } }) {
  const loc = await getLocationBySlug(params.slug);

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
        <Hero city={loc.city} />
        
        <div className="py-20 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Top-Rated Web & App Development Agency in {loc.city}
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto">
                {loc.metaDescription} Looking for the best digital agency in {loc.city}? Optify360 brings world-class custom web development, scalable SaaS applications, and dominant local SEO right to {loc.city}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:bg-[#151515] transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-white">Custom Web Design in {loc.city}</h3>
                <p className="text-zinc-400 leading-relaxed">We build stunning, conversion-focused websites and high-end WordPress platforms tailored for the {loc.city} market to help your brand stand out.</p>
              </div>
              <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:bg-[#151515] transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-white">App Development in {loc.city}</h3>
                <p className="text-zinc-400 leading-relaxed">High-performance native iOS, Android, and cross-platform applications designed to scale businesses across {loc.city} and beyond.</p>
              </div>
              <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:bg-[#151515] transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-white">Local SEO in {loc.city}</h3>
                <p className="text-zinc-400 leading-relaxed">Dominate Google search rankings, outrank your local competitors, and attract more high-paying customers in the {loc.city} area.</p>
              </div>
            </div>
          </div>
        </div>

        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
