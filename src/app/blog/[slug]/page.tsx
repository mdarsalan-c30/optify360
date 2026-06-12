import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCombinedPostBySlug, getAllCombinedPosts } from "@/lib/blogs";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllCombinedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCombinedPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Optify360 Insiders",
    };
  }

  return {
    title: `${post.title} | Optify360 Insiders`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Optify360 Insiders`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getCombinedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Generate FAQ JSON-LD if faqs exist
  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <article className="max-w-4xl mx-auto px-6">
          {/* Back button */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary-orange transition-colors group mb-8 font-mono"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to blog list
          </Link>

          {/* Heading */}
          <div className="space-y-6 mb-12 border-b border-white/[0.05] pb-10">
            <span className="bg-primary-orange/15 border border-primary-orange/20 text-primary-orange rounded-full px-3 py-1 text-xs font-bold font-heading uppercase tracking-wider inline-block">
              {post.category}
            </span>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-text-main leading-tight">
              {post.title}
            </h1>

            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted font-mono pt-2">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary-orange" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-primary-orange" /> Written by {post.author}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary-orange" /> 5 min read</span>
            </div>
          </div>

          {/* Article Cover Placeholder Gradient */}
          <div className="w-full h-[320px] md:h-[450px] relative bg-gradient-to-br from-orange-600/10 via-purple-900/5 to-black/90 rounded-3xl overflow-hidden border border-white/[0.05] mb-12 flex items-center justify-center p-8 select-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <span className="font-heading font-extrabold text-5xl md:text-6xl text-text-main/5 uppercase tracking-widest text-center select-none">
              {post.category}
            </span>
          </div>

          {/* Markdown Content Output */}
          <div 
            className="prose prose-invert max-w-none prose-p:my-4 prose-p:leading-relaxed prose-headings:font-heading"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* FAQs Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/[0.05]">
              <h2 className="text-3xl font-bold font-heading mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faqs.map((faq, index) => (
                  <div key={index} className="bg-surface border border-white/[0.05] rounded-2xl p-6">
                    <h3 className="text-xl font-bold font-heading mb-3">{faq.question}</h3>
                    <p className="text-text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Call to Action */}
          <div className="mt-20 p-8 border border-white/[0.08] bg-surface rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-orange/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-2 relative z-10 max-w-xl">
              <h3 className="text-xl font-bold font-heading text-text-main">
                Need high-performance engineering for your platform?
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Connect with Md Arsalan and the Optify360 team to scope your application development, technical search positioning, or workflow automation.
              </p>
            </div>
            <Link 
              href="/contact"
              className="bg-primary-orange hover:bg-primary-orange/90 text-text-main font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 shrink-0 relative z-10 whitespace-nowrap"
            >
              Get in Touch
            </Link>
          </div>

        </article>
      </main>
      <Footer />
    </>
  );
}
