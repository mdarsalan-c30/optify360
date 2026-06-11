import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllCombinedPosts } from "@/lib/blogs";
import { Calendar, User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Insiders | Digital Engineering, SEO & AI Strategy Blog | Optify360",
  description: "In-depth technical articles, actionable SEO strategies, and custom AI integration guides for modern product teams and founders.",
};

export default async function BlogPage() {
  const posts = await getAllCombinedPosts();

  if (posts.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-32 pb-24 text-center">
          <h1 className="text-2xl font-bold">No articles published yet.</h1>
        </main>
        <Footer />
      </>
    );
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  // Helper gradients for styling thumbnail placeholders
  const gradients = [
    "from-orange-600/20 to-purple-900/40",
    "from-blue-600/20 to-emerald-900/40",
    "from-amber-600/20 to-rose-900/40"
  ];

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-primary-orange text-xs md:text-sm font-semibold tracking-wider uppercase bg-primary-orange/10 border border-primary-orange/20 px-4 py-1.5 rounded-full">
              Optify360 Insiders
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading text-text-main tracking-tight mt-2">
              Digital Engineering & <span className="text-gradient">Acquisition Playbooks</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg leading-relaxed">
              Actionable software guides, programmatic technical SEO breakdowns, and custom AI integration architectures written directly by Md Arsalan and team.
            </p>
          </div>

          {/* Featured Post Card */}
          <div className="mb-16">
            <Link 
              href={`/blog/${featuredPost.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-surface border border-white/[0.05] rounded-3xl overflow-hidden hover:border-primary-orange/20 transition-all duration-300 relative"
            >
              {/* Cover placeholder gradient */}
              <div className="lg:col-span-7 h-[280px] lg:h-auto min-h-[300px] relative bg-gradient-to-br from-orange-600/20 via-purple-900/10 to-black/40 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <span className="text-center font-heading font-extrabold text-3xl text-text-main/20 select-none uppercase tracking-widest border border-white/5 px-6 py-4 rounded-xl backdrop-blur-[2px]">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Copy details */}
              <div className="lg:col-span-5 p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs uppercase text-primary-orange font-bold tracking-widest">
                    Featured Article &bull; {featuredPost.category}
                  </span>
                  
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-text-main leading-snug group-hover:text-primary-orange transition-colors">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-sm text-text-muted leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between text-xs text-text-muted font-mono mt-6">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {featuredPost.date}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {featuredPost.author}</span>
                  </div>
                  <span className="text-primary-orange font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Post <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Remaining Posts Grid */}
          {remainingPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {remainingPosts.map((post, idx) => {
                const gradient = gradients[idx % gradients.length];
                return (
                  <Link 
                    key={`${post.slug}-${idx}`}
                    href={`/blog/${post.slug}`}
                    className="group bg-surface border border-white/[0.05] rounded-3xl overflow-hidden hover:border-primary-orange/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Mini thumbnail */}
                      <div className={`h-48 relative bg-gradient-to-br ${gradient} overflow-hidden`}>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                        <div className="absolute bottom-4 left-4">
                          <span className="bg-black/60 border border-white/[0.06] backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] font-bold text-text-main font-mono uppercase tracking-wider">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-6 space-y-3">
                        <h2 className="text-lg md:text-xl font-bold font-heading text-text-main group-hover:text-primary-orange transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-text-muted font-mono mt-auto">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                      <span className="text-primary-orange font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Post <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
