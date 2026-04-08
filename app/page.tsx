import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import TagBadge from "@/components/TagBadge";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "ByteFeed — Real-world web dev notes",
  description:
    "Practical engineering notes on Next.js, TypeScript, Docker, and backend — written from production experience, not documentation.",
};

export default async function Home() {
  const posts = await getAllPosts();
  const tags = await getAllTags();
  const featured = posts.slice(0, 3);
  const recent = posts.slice(3, 7);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://blog.hribal.dev";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ByteFeed",
    description: "Practical engineering notes on Next.js, TypeScript, Docker, and backend.",
    url: baseUrl,
    author: { "@type": "Person", name: "Karel Hribal", url: baseUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <section className="mb-16">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-widest text-emerald-400">
              Engineering blog
            </span>
          </div>

          <h1 className="mb-5 text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            What works in production
            <span className="block text-emerald-400">gets written here.</span>
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            Practical notes on Next.js, TypeScript, Docker, and backend engineering.
            No fluff — just things that actually work.
          </p>

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                />
              ))}
            </div>
          )}
        </section>

        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Latest posts
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((post) => (
                <PostCard key={post.slug} post={post} featured />
              ))}
            </div>
          </section>
        )}

        {recent.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              More posts
            </h2>
            <div className="flex flex-col gap-2">
              {recent.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-zinc-800 bg-linear-to-br from-zinc-900 to-zinc-900/40 p-10 text-center">
          <h2 className="mb-2 text-2xl font-semibold text-zinc-100">Want to keep reading?</h2>
          <p className="mb-6 text-zinc-400">
            Browse the full archive and find exactly what you&rsquo;re working on.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
          >
            All posts
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                suppressHydrationWarning
              />
            </svg>
          </Link>
        </section>
      </div>
    </>
  );
}
