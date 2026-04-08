import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import TagBadge from "./TagBadge";

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
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

export default function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            {post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}
            <h2 className="mb-2 text-xl font-semibold leading-snug text-zinc-100 group-hover:text-emerald-400 transition-colors">
              {post.title}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-zinc-400 line-clamp-2">
              {post.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{post.readingTime}</span>
              {post.author && (
                <>
                  <span>·</span>
                  <span>{post.author}</span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex gap-4 rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4 transition-all duration-150 hover:border-zinc-700 hover:bg-zinc-900/60">
        <div className="min-w-0 flex-1">
          {post.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {post.tags.slice(0, 2).map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
          <h3 className="mb-1 font-medium leading-snug text-zinc-200 group-hover:text-emerald-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="mb-2 text-sm text-zinc-500 line-clamp-1">
            {post.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center text-zinc-700 group-hover:text-emerald-500 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              suppressHydrationWarning
            />
          </svg>
        </div>
      </article>
    </Link>
  );
}
