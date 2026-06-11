import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies } from "@/content/caseStudies";
import { CaseStudySchema } from "@/components/json-ld";
import { AnimatedCounter } from "@/components/animated-counter";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);
  if (!study) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: `${study.title} | BLACKHOLE Case Study`,
    description: study.summary,
    openGraph: {
      title: `${study.title} | BLACKHOLE Case Study`,
      description: study.summary,
      url: `https://optify360.com/case-studies/${study.slug}`,
      type: "article",
      images: [
        {
          url: `https://optify360.com/og-${study.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: study.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${study.title} | BLACKHOLE Case Study`,
      description: study.summary,
      images: [`https://optify360.com/og-${study.slug}.jpg`],
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50">
      {/* Schema Injection */}
      <CaseStudySchema
        title={study.title}
        description={study.summary}
        url={`https://optify360.com/case-studies/${study.slug}`}
        clientName={study.clientName}
        industry={study.industry}
        datePublished={study.datePublished}
      />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 w-full">
        <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <Link href="/case-studies" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            &larr; Back to Case Studies
          </Link>
          <div className="flex items-center gap-3 mt-6 mb-2">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 bg-zinc-150 dark:bg-zinc-800 rounded">
              {study.industry}
            </span>
            <span className="text-xs text-zinc-400">
              Published: {study.datePublished}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            {study.title}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light">
            {study.subtitle}
          </p>
        </header>

        {/* Animated Metrics */}
        <section className="mb-16">
          <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-500 mb-6">
            Key Impact Metrics
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {study.metrics.map((metric, idx) => (
              <AnimatedCounter
                key={idx}
                value={metric.value}
                suffix={metric.suffix}
                label={metric.label}
              />
            ))}
          </div>
        </section>

        {/* Core Content */}
        <section className="space-y-12">
          {/* Summary */}
          <div className="p-6 bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
            <h3 className="text-md font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
              Executive Summary
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-md">
              {study.summary}
            </p>
          </div>

          {/* Challenge */}
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              The Challenge
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-md whitespace-pre-line">
              {study.challenge}
            </p>
          </div>

          {/* Solution */}
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Our Solution
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-md whitespace-pre-line">
              {study.solution}
            </p>
          </div>

          {/* Results */}
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              The Result
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-md whitespace-pre-line">
              {study.result}
            </p>
          </div>
        </section>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-between">
          <Link href="/case-studies" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 text-sm">
            &larr; Back to Case Studies
          </Link>
          <span className="text-zinc-400 text-sm">
            Client: {study.clientName}
          </span>
        </div>
      </main>

      <footer className="py-10 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Md Arsalan &amp; optify360. All rights reserved.</p>
      </footer>
    </div>
  );
}
