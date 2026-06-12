import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/agency-admin/", "/client-portal/"],
      },
      {
        // Explicitly welcome AI & LLM Crawlers for maximum visibility in ChatGPT, Perplexity, Claude, etc.
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "ClaudeBot", "Anthropic-ai", "PerplexityBot", "CCBot", "OmgiliBot"],
        allow: "/",
        disallow: ["/api/", "/admin/", "/agency-admin/", "/client-portal/"],
      }
    ],
    sitemap: "https://optify360.vercel.app/sitemap.xml",
  };
}
