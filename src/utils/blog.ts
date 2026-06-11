import fs from "fs";
import path from "path";
import { marked } from "marked";

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  image?: string;
  tags?: string[];
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string;
  html: string;
  toc: TocItem[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

const blogsDirectory = path.join(process.cwd(), "src/content/blogs");

export function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) return { data: {} as Partial<BlogPostFrontmatter>, content: fileContent };

  const frontmatterBlock = match[1];
  const content = match[2];
  const data: Record<string, any> = {};

  frontmatterBlock.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Clean string quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }

      // Handle arrays like [A, B]
      if (value.startsWith("[") && value.endsWith("]")) {
        data[key] = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim().replace(/^["']|["']$/g, ""));
      } else {
        data[key] = value;
      }
    }
  });

  return { data: data as BlogPostFrontmatter, content };
}

export function generateToc(markdownContent: string): TocItem[] {
  // Matches H2, H3, H4 headings
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdownContent)) !== null) {
    const level = match[1].length;
    const text = match[2].trim().replace(/[*_`]/g, ""); // strip bold/italics markers
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    toc.push({ id, text, level });
  }

  return toc;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const html = await marked.parse(markdown);

  // Inject ID anchors to <h2>, <h3>, <h4> headings matching TOC logic
  return html.replace(/<(h[2-4])>([^<]+)<\/\1>/gi, (match, tag, rawText) => {
    const text = rawText.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return `<${tag} id="${id}" class="anchor-heading scroll-mt-20 group relative">${rawText}<a href="#${id}" class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-zinc-400 absolute dark:text-zinc-600 font-normal">#</a></${tag}>`;
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(blogsDirectory)) {
    fs.mkdirSync(blogsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(blogsDirectory);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx?$/, "");
        const fullPath = path.join(blogsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = parseFrontmatter(fileContents);
        const html = await markdownToHtml(content);
        const toc = generateToc(content);

        return {
          slug,
          content,
          html,
          toc,
          title: data.title || "Untitled Post",
          description: data.description || "",
          date: data.date || new Date().toISOString().split("T")[0],
          author: data.author || "Md Arsalan",
          category: data.category || "General",
          image: data.image,
          tags: data.tags || [],
        };
      })
  );

  // Sort posts by date descending
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!fs.existsSync(blogsDirectory)) return null;

  const mdPath = path.join(blogsDirectory, `${slug}.md`);
  const mdxPath = path.join(blogsDirectory, `${slug}.mdx`);
  let fullPath = "";

  if (fs.existsSync(mdPath)) {
    fullPath = mdPath;
  } else if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parseFrontmatter(fileContents);
  const html = await markdownToHtml(content);
  const toc = generateToc(content);

  return {
    slug,
    content,
    html,
    toc,
    title: data.title || "Untitled Post",
    description: data.description || "",
    date: data.date || new Date().toISOString().split("T")[0],
    author: data.author || "Md Arsalan",
    category: data.category || "General",
    image: data.image,
    tags: data.tags || [],
  };
}
