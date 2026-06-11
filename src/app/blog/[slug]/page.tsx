import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/utils/blog";
import { BlogPostingSchema } from "@/components/json-ld";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: `${post.title} | BLACKHOLE Blog`,
    description: post.description,
    openGraph: {
      title: `${post.title} | BLACKHOLE Blog`,
      description: post.description,
      url: `https://optify360.com/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: post.image || `https://optify360.com/og-${post.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | BLACKHOLE Blog`,
      description: post.description,
      images: [post.image || `https://optify360.com/og-${post.slug}.jpg`],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50">
      {/* Schema Injection */}
      <BlogPostingSchema
        title={post.title}
        description={post.description}
        datePublished={post.date}
        image={post.image || `https://optify360.com/og-${post.slug}.jpg`}
        url={`https://optify360.com/blog/${post.slug}`}
        authorName={post.author}
      />

      <main className="flex-grow max-w-5xl mx-auto px-6 py-20 w-full">
        {/* Header */}
        <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            &larr; Back to Blog
          </Link>
          <div className="flex items-center gap-3 mt-6 mb-2">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold px-2 py-0.5 bg-zinc-150 dark:bg-zinc-800 rounded">
              {post.category}
            </span>
            <span className="text-xs text-zinc-400">
              Published: {post.date}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="text-sm text-zinc-500">
            By <span className="font-semibold text-zinc-700 dark:text-zinc-300">{post.author}</span>
          </div>
        </header>

        {/* Content & Table of Contents layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Article Content */}
          <article className="lg:col-span-8 blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />

          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto border-l border-zinc-200 dark:border-zinc-850 pl-6 py-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
              Table of Contents
            </h2>
            {post.toc.length === 0 ? (
              <p className="text-xs text-zinc-400">No headings in this post.</p>
            ) : (
              <nav className="space-y-3">
                {post.toc.map((item, index) => {
                  // Indent based on heading level (h2, h3, h4)
                  const indentClass =
                    item.level === 3 ? "pl-4 text-xs" : item.level === 4 ? "pl-8 text-[11px]" : "text-xs font-medium";
                  return (
                    <a
                      key={index}
                      href={`#${item.id}`}
                      className={`block text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors ${indentClass}`}
                    >
                      {item.text}
                    </a>
                  );
                })}
              </nav>
            )}
          </aside>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Link href="/blog" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 text-sm">
            &larr; Back to Blog
          </Link>
        </div>
      </main>

      <footer className="py-10 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Md Arsalan &amp; optify360. All rights reserved.</p>
      </footer>
    </div>
  );
}
