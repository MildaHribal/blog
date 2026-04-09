import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { estimateReadingLabel } from "@/lib/reading-time";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  id?: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage?: string;
  author?: string;
  readingTime: string;
  source: "db" | "mdx";
}

export interface Post extends PostMeta {
  content: string;
  status?: "DRAFT" | "PUBLISHED";
}

interface QueryOptions {
  includeDrafts?: boolean;
}

function parseDateSafe(dateStr: string): Date {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function readMdxPosts(includeDrafts = false): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ? String(data.date) : new Date().toISOString(),
        tags: Array.isArray(data.tags) ? data.tags : [],
        coverImage: data.coverImage ?? undefined,
        author: data.author ?? "Karel",
        readingTime: estimateReadingLabel(content),
        source: "mdx" as const,
      };
    })
    .sort((a, b) => parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime());
}

function readMdxPost(slug: string): Post | null {
  for (const ext of [".mdx", ".md"]) {
    const filePath = path.join(POSTS_DIR, `${slug}${ext}`);
    if (!fs.existsSync(filePath)) continue;
    const { data, content } = matter(fs.readFileSync(filePath, "utf-8"));
    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      date: data.date ? String(data.date) : new Date().toISOString(),
      tags: Array.isArray(data.tags) ? data.tags : [],
      coverImage: data.coverImage ?? undefined,
      author: data.author ?? "Karel",
      readingTime: estimateReadingLabel(content),
      content,
      source: "mdx",
    };
  }
  return null;
}

export async function getAllPosts(options: QueryOptions = {}): Promise<PostMeta[]> {
  const { includeDrafts = false } = options;

  if (!process.env.DATABASE_URL) {
    return readMdxPosts(includeDrafts);
  }

  try {
    const rows = await db.post.findMany({
      where: includeDrafts ? undefined : { status: PostStatus.PUBLISHED },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    if (rows.length > 0) {
      return rows.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        date: (p.publishedAt ?? p.createdAt).toISOString(),
        tags: p.tags,
        coverImage: p.coverImage ?? undefined,
        author: p.author,
        readingTime: estimateReadingLabel(p.content),
        source: "db" as const,
      }));
    }
  } catch {
    // fall through
  }

  return readMdxPosts(includeDrafts);
}

export async function getPostBySlug(slug: string, options: QueryOptions = {}): Promise<Post | null> {
  const { includeDrafts = false } = options;

  if (!process.env.DATABASE_URL) {
    return readMdxPost(slug);
  }

  try {
    const p = await db.post.findUnique({ where: { slug } });
    if (p) {
      if (!includeDrafts && p.status !== PostStatus.PUBLISHED) return null;
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        date: (p.publishedAt ?? p.createdAt).toISOString(),
        tags: p.tags,
        coverImage: p.coverImage ?? undefined,
        author: p.author,
        readingTime: estimateReadingLabel(p.content),
        content: p.content,
        source: "db",
        status: p.status,
      };
    }
  } catch {
    // fall through
  }

  return readMdxPost(slug);
}

export async function getAllTags(options: QueryOptions = {}): Promise<string[]> {
  const posts = await getAllPosts(options);
  return [...new Set(posts.flatMap((p) => p.tags))].sort();
}
