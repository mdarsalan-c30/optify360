import React from "react";
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Hero city={loc.city} />
        
        <div className="py-12 text-center max-w-4xl mx-auto px-4 mt-16 border-t border-white/5">
          <h2 className="text-2xl md:text-4xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Top-Rated Agency in {loc.city}
          </h2>
          <p className="text-zinc-400 text-lg">
            {loc.metaDescription}
          </p>
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
