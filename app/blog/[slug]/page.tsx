import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TagBadge from "@/components/TagBadge";
import { getAllPosts, getPostBySlug } from "@/lib/posts";


interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://blog.hribal.dev";

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author ?? "Karel" }],
    openGraph: {
      type: "article",
      url: `${baseUrl}/blog/${slug}`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author ?? "Karel"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://blog.hribal.dev";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author ?? "Karel",
      url: baseUrl,
    },
    url: `${baseUrl}/blog/${slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M11 7H3M3 7L6.5 3.5M3 7L6.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              suppressHydrationWarning
            />
          </svg>
          Back to blog
        </Link>

        <header className="mb-10">
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                />
              ))}
            </div>
          )}

          <h1 className="mb-4 text-3xl font-bold leading-snug tracking-tight text-zinc-50 sm:text-4xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="mb-6 text-lg leading-relaxed text-zinc-400">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 pb-6 text-sm text-zinc-500">
            {post.author && (
              <span className="font-medium text-zinc-400">{post.author}</span>
            )}
            <span>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </header>

        <article className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>

        <div className="mt-16 border-t border-zinc-800 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2 text-sm text-zinc-400 transition-colors hover:border-emerald-500 hover:text-emerald-400"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M11 7H3M3 7L6.5 3.5M3 7L6.5 10.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                suppressHydrationWarning
              />
            </svg>
            All posts
          </Link>
        </div>
      </div>
    </>
  );
}
