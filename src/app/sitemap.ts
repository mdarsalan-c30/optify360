import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://optify360.vercel.app";

  // Static routes
  const routes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic blog routes
  try {
    const posts = await getAllPosts();
    const blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date).toISOString() || new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    return [...routes, ...blogRoutes];
  } catch (error) {
    console.error("Failed to generate sitemap for blog routes:", error);
    return routes;
  }
}
