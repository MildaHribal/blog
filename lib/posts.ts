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

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

function parseDateSafe(dateStr: string): Date {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date(0) : d;
}

function getAllPostsFromFiles(includeDrafts = false): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
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
      source: "mdx",
      status: "PUBLISHED",
    } satisfies PostMeta & { status: "PUBLISHED" };
  });

  const visiblePosts = includeDrafts
    ? posts
    : posts.filter((post) => post.status === "PUBLISHED");

  return visiblePosts.sort(
    (a, b) =>
      parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime()
  );
}

function getPostBySlugFromFiles(slug: string): Post | null {
  const extensions = [".mdx", ".md"];
  for (const ext of extensions) {
    const filePath = path.join(POSTS_DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
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
        content,
        source: "mdx",
        status: "PUBLISHED",
      };
    }
  }
  return null;
}

export async function getAllPosts(options: QueryOptions = {}): Promise<PostMeta[]> {
  const includeDrafts = options.includeDrafts ?? false;

  if (!hasDatabaseUrl) {
    return getAllPostsFromFiles(includeDrafts);
  }

  try {
    const dbPosts = await db.post.findMany({
      where: includeDrafts ? undefined : { status: PostStatus.PUBLISHED },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    if (dbPosts.length > 0) {
      return dbPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: (post.publishedAt ?? post.createdAt).toISOString(),
        tags: post.tags,
        coverImage: post.coverImage ?? undefined,
        author: post.author,
        readingTime: estimateReadingLabel(post.content),
        source: "db",
      }));
    }
  } catch {
    // DB unavailable — fall back to MDX files.
  }

  return getAllPostsFromFiles(includeDrafts);
}

export async function getPostBySlug(
  slug: string,
  options: QueryOptions = {}
): Promise<Post | null> {
  const includeDrafts = options.includeDrafts ?? false;

  if (!hasDatabaseUrl) {
    return getPostBySlugFromFiles(slug);
  }

  try {
    const post = await db.post.findUnique({ where: { slug } });

    if (post) {
      if (!includeDrafts && post.status !== PostStatus.PUBLISHED) {
        return null;
      }

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: (post.publishedAt ?? post.createdAt).toISOString(),
        tags: post.tags,
        coverImage: post.coverImage ?? undefined,
        author: post.author,
        readingTime: estimateReadingLabel(post.content),
        content: post.content,
        source: "db",
        status: post.status,
      };
    }
  } catch {
    // fall through to MDX
  }

  return getPostBySlugFromFiles(slug);
}

export async function getAllTags(options: QueryOptions = {}): Promise<string[]> {
  const posts = await getAllPosts(options);
  const tags = new Set<string>();
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

