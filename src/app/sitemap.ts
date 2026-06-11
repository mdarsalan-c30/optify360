import { MetadataRoute } from "next";
import { getBlogPosts } from "@/utils/blog";
import { caseStudies } from "@/content/caseStudies";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://optify360.com";

  // Static routes
  const staticRoutes = ["", "/blog", "/case-studies"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  }));

  // Dynamic Case Studies
  const caseStudyRoutes = caseStudies.map((study) => ({
    url: `${baseUrl}/case-studies/${study.slug}`,
    lastModified: new Date(study.datePublished).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Dynamic Blog Posts
  const blogPosts = await getBlogPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...blogRoutes];
}
