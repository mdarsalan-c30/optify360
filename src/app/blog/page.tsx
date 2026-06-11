import { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/utils/blog";
import { OrganizationSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Blog | BLACKHOLE & optify360",
  description: "Read the latest engineering articles, low-latency API walkthroughs, and Next.js SEO guides written by Md Arsalan and the optify360 team.",
  openGraph: {
    title: "Blog | BLACKHOLE & optify360",
    description: "Read the latest engineering articles, low-latency API walkthroughs, and Next.js SEO guides.",
    url: "https://optify360.com/blog",
    type: "website",
    images: [
      {
        url: "https://optify360.com/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "BLACKHOLE Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | BLACKHOLE & optify360",
    description: "Read the latest engineering articles, low-latency API walkthroughs, and Next.js SEO guides.",
    images: ["https://optify360.com/og-blog.jpg"],
  },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50">
      {/* Schema Injection */}
      <OrganizationSchema />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-20 w-full">
        <header className="mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-10">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-4 mb-3">
            The BLACKHOLE Blog
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Technical writing on SEO growth, high-performance web development, Rust edge computing, and AI architectures compiled by the optify360 team.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="py-10 text-center text-zinc-500">
            No blog posts found. Check back soon!
          </div>
        ) : (
          <section className="space-y-12">
            {posts.map((post) => (
              <article 
                key={post.slug} 
                className="group border-b border-zinc-200 dark:border-zinc-800 pb-10 flex flex-col md:flex-row gap-6 justify-between items-start"
              >
                <div className="flex-grow max-w-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {post.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                    {post.description}
                  </p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-zinc-950 dark:text-zinc-50 hover:underline inline-flex items-center gap-1"
                  >
                    Read article &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="py-10 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Md Arsalan &amp; optify360. All rights reserved.</p>
      </footer>
    </div>
  );
}
