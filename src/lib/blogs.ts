import fs from "fs";
import path from "path";
import { db } from "./firebase";
import { collection, query, getDocs, orderBy, where, limit } from "firebase/firestore";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  contentHtml: string;
}

export function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Replace code blocks
  html = html.replace(/```(.*?)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-surface border border-white/10 rounded-lg p-4 my-6 overflow-x-auto text-sm text-text-main font-mono"><code class="language-${lang}">${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
  });

  // Replace horizontal rules
  html = html.replace(/^---$/gm, "<hr class='border-white/10 my-8' />");

  // Replace headers (H3)
  html = html.replace(/^### (.*?)$/gm, "<h3 class='text-xl font-bold font-heading text-text-main mt-8 mb-4'>$1</h3>");
  // Replace headers (H2)
  html = html.replace(/^## (.*?)$/gm, "<h2 class='text-2xl font-bold font-heading text-primary-orange mt-10 mb-4'>$1</h2>");
  // Replace headers (H1)
  html = html.replace(/^# (.*?)$/gm, "<h1 class='text-3xl font-bold font-heading text-text-main mt-12 mb-6'>$1</h1>");

  // Replace bold text
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-text-main'>$1</strong>");

  // Replace inline code
  html = html.replace(/`(.*?)`/g, "<code class='bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono text-sm text-primary-orange'>$1</code>");

  // Replace lists
  // Unordered list items
  html = html.replace(/^\* (.*?)$/gm, "<li class='list-disc ml-6 my-1.5 text-text-muted'>$1</li>");
  html = html.replace(/^- (.*?)$/gm, "<li class='list-disc ml-6 my-1.5 text-text-muted'>$1</li>");
  
  // Ordered list items
  html = html.replace(/^\d+\.\s+(.*?)$/gm, "<li class='list-decimal ml-6 my-1.5 text-text-muted'>$1</li>");

  // Replace quotes
  html = html.replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-primary-orange bg-white/[0.02] p-4 my-6 italic text-text-muted'>$1</blockquote>");

  // Replace links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-primary-orange hover:underline'>$1</a>");

  // Parse paragraphs (any lines that aren't html elements or empty)
  const lines = html.split("\n");
  const parsedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("<h") || 
        trimmed.startsWith("<pre") || 
        trimmed.startsWith("<code") || 
        trimmed.startsWith("</pre>") || 
        trimmed.startsWith("</code") || 
        trimmed.startsWith("<hr") || 
        trimmed.startsWith("<li") || 
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("</blockquote") ||
        trimmed.startsWith("<a") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol")) {
      return line;
    }
    return `<p class="my-4 text-text-muted leading-relaxed">${line}</p>`;
  });

  return parsedLines.join("\n");
}

export function getAllPosts(): BlogPost[] {
  const blogsDirectory = path.join(process.cwd(), "src/content/blogs");
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(blogsDirectory);
  const posts = fileNames
    .filter(fileName => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Simple frontmatter parsing
      const match = fileContents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!match) {
        return null;
      }

      const frontmatterText = match[1];
      const content = match[2];

      const frontmatter: Record<string, string> = {};
      frontmatterText.split("\n").forEach(line => {
        const index = line.indexOf(":");
        if (index > -1) {
          const key = line.slice(0, index).trim();
          const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
          frontmatter[key] = value;
        }
      });

      const contentHtml = parseMarkdown(content);

      return {
        slug,
        title: frontmatter.title || "",
        date: frontmatter.date || "",
        excerpt: frontmatter.excerpt || "",
        coverImage: frontmatter.coverImage || "",
        category: frontmatter.category || "",
        author: frontmatter.author || "",
        contentHtml,
      } as BlogPost;
    })
    .filter(Boolean) as BlogPost[];

  // Sort posts by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Fetch dynamic blogs from Firestore
 */
export async function getDbPosts(): Promise<BlogPost[]> {
  try {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const contentHtml = parseMarkdown(data.content || "");
      posts.push({
        slug: data.slug || doc.id,
        title: data.title || "",
        date: data.date || (data.createdAt?.toDate()?.toLocaleDateString() || new Date().toLocaleDateString()),
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || "",
        category: data.category || "General",
        author: data.author || "Md Arsalan",
        contentHtml,
      });
    });
    return posts;
  } catch (error) {
    console.error("Failed to query Firestore blogs:", error);
    return [];
  }
}

/**
 * Returns both filesystem and Firestore blogs, sorted by date descending
 */
export async function getAllCombinedPosts(): Promise<BlogPost[]> {
  try {
    const localPosts = getAllPosts();
    const dbPosts = await getDbPosts();
    const combined = [...dbPosts, ...localPosts];
    // Remove duplicate posts by slug (prefer DB version)
    const unique = new Map<string, BlogPost>();
    combined.forEach(post => {
      if (!unique.has(post.slug)) {
        unique.set(post.slug, post);
      }
    });
    return Array.from(unique.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Failed to merge combined blog posts:", error);
    return getAllPosts();
  }
}

/**
 * Searches both filesystem and Firestore for a post matching the slug
 */
export async function getCombinedPostBySlug(slug: string): Promise<BlogPost | null> {
  const localPost = getPostBySlug(slug);
  if (localPost) return localPost;

  try {
    const q = query(collection(db, "blogs"), where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      const contentHtml = parseMarkdown(data.content || "");
      return {
        slug: data.slug || doc.id,
        title: data.title || "",
        date: data.date || (data.createdAt?.toDate()?.toLocaleDateString() || new Date().toLocaleDateString()),
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || "",
        category: data.category || "General",
        author: data.author || "Md Arsalan",
        contentHtml,
      };
    }
  } catch (error) {
    console.error("Failed to retrieve combined blog by slug:", error);
  }
  return null;
}

