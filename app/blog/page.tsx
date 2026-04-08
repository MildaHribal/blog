import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import TagBadge from "@/components/TagBadge";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "ByteFeed",
  description:
    "Browse all posts on Next.js, TypeScript, Docker, backend engineering, and web performance.",
};

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams;
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();

  const posts = tag ? allPosts.filter((p) => p.tags.includes(tag)) : allPosts;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
          {tag ? (
            <>
              Posts in <span className="text-emerald-400">#{tag}</span>
            </>
          ) : (
            "All posts"
          )}
        </h1>
        <p className="text-zinc-400">
          {posts.length === 0
              ? "Nothing here yet."
              : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Post list */}
        <div className="min-w-0 flex-1">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 py-20 text-center">
              <p className="text-zinc-500">No posts in this category yet.</p>
              <Link
                href="/blog"
                className="mt-4 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
              >
                View all posts →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} featured />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 lg:sticky lg:top-20">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {tag && (
                <Link
                  href="/blog"
                  className="mb-1 inline-flex items-center gap-1 rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition-colors hover:text-zinc-200"
                >
                  × Clear filter
                </Link>
              )}
              {allTags.map((t) => (
                <TagBadge
                  key={t}
                  tag={t}
                  active={t === tag}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
