import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Portfolio from "@/sections/Portfolio";
import Process from "@/sections/Process";
import Testimonials from "@/sections/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Optify360",
    "image": "https://optify360.vercel.app/images/office-cover.jpg",
    "@id": "https://optify360.vercel.app/#localbusiness",
    "url": "https://optify360.vercel.app",
    "telephone": "+1-800-555-0199",
    "priceRange": "$$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Suite 100, Tech District",
      "addressLocality": "New Delhi",
      "addressRegion": "DL",
      "postalCode": "110001",
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does Optify360 provide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Optify360 provides custom SaaS and web development, advanced data-driven SEO, AI workflow automation engineering, brand identity design systems, and conversion-focused growth marketing."
        }
      },
      {
        "@type": "Question",
        "name": "How does Optify360 approach SaaS development?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We build custom, cloud-native applications from scratch using Next.js, TypeScript, and high-performance serverless or VPS architectures. We avoid templates to ensure custom designs and maximum load speeds."
        }
      },
      {
        "@type": "Question",
        "name": "Why is Optify360's SEO service different?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unlike standard agencies, we use technical optimization (Core Web Vitals, programmatic architectures, schema tags) and intent-driven semantic structures. This ensures organic traffic directly translates to demo sign-ups and sales."
        }
      }
    ]
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
      </main>
      <Footer />

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
