import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blogs";
import { getAllLocations } from "@/lib/locations";

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
  let blogRoutes: any[] = [];
  try {
    const posts = await getAllPosts();
    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date).toISOString() || new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Failed to generate sitemap for blog routes:", error);
  }

  // Dynamic location routes
  let locationRoutes: any[] = [];
  try {
    const locations = await getAllLocations();
    locationRoutes = locations.map((loc) => ({
      url: `${baseUrl}/locations/${loc.slug}`,
      lastModified: loc.updatedAt ? new Date(loc.updatedAt.toDate()).toISOString() : new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.9, // High priority for local SEO
    }));
  } catch (error) {
    console.error("Failed to generate sitemap for location routes:", error);
  }

  return [...routes, ...blogRoutes, ...locationRoutes];
}
