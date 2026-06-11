import { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/content/caseStudies";
import { OrganizationSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Case Studies | optify360",
  description: "Read real-world case studies for ClimateVerse, PDFVerse, Mynra AI, and StudyCubs. See how Md Arsalan and the optify360 team drive engineering and SEO success.",
  openGraph: {
    title: "Case Studies | optify360",
    description: "Read real-world case studies for ClimateVerse, PDFVerse, Mynra AI, and StudyCubs.",
    url: "https://optify360.vercel.app/case-studies",
    type: "website",
    images: [
      {
        url: "https://optify360.vercel.app/og-case-studies.jpg",
        width: 1200,
        height: 630,
        alt: "optify360 Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies | optify360",
    description: "Read real-world case studies for ClimateVerse, PDFVerse, Mynra AI, and StudyCubs.",
    images: ["https://optify360.vercel.app/og-case-studies.jpg"],
  },
};

export default function CaseStudiesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50">
      {/* Schema Injection */}
      <OrganizationSchema />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-20 w-full">
        <header className="mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-10">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-3">
            Case Studies
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A showcase of deep engineering, high-fidelity visualizations, semantic AI, low-latency edge computing, and gamified learning platforms designed and shipped by optify360 under the leadership of Md Arsalan.
          </p>
        </header>

        <section className="grid gap-12 sm:grid-cols-2">
          {caseStudies.map((study) => (
            <article 
              key={study.id} 
              className="flex flex-col justify-between p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold block mb-2">
                  {study.industry}
                </span>
                <h2 className="text-2xl font-bold mb-3 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <Link href={`/case-studies/${study.slug}`}>
                    {study.title}
                  </Link>
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 line-clamp-3">
                  {study.summary}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  href={`/case-studies/${study.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50 hover:underline"
                >
                  View full case study &rarr;
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="py-10 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Md Arsalan &amp; optify360. All rights reserved.</p>
      </footer>
    </div>
  );
}
