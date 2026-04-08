"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { estimateReadingLabel } from "@/lib/reading-time";

type PostStatus = "DRAFT" | "PUBLISHED";

interface AdminPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  author: string;
  coverImage: string | null;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  initialPosts: AdminPost[];
  adminUsername: string;
}

export default function AdminPanelClient({ initialPosts, adminUsername }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [message, setMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [posts]
  );

  async function refreshPosts() {
    const response = await fetch("/api/admin/posts", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to refresh posts");
    }
    const data = (await response.json()) as { posts: AdminPost[] };
    setPosts(data.posts);
  }

  async function removePost(id: string) {
    if (!confirm("Delete this post?")) return;

    setBusyId(id);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        setMessage(json.error ?? "Delete failed.");
      } else {
        await refreshPosts();
        setMessage("Post deleted.");
      }
    } catch {
      setMessage("An unexpected error occurred.");
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Post management</h1>
          <p className="text-sm text-zinc-500">Signed in as {adminUsername}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/new"
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black"
          >
            New post
          </Link>
          <button
            onClick={logout}
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">All posts</h2>

        <div className="space-y-2">
          {sortedPosts.map((post) => (
            <div key={post.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-medium text-zinc-100">{post.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">/blog/{post.slug}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {post.status} · {estimateReadingLabel(post.content)} · {post.tags.join(", ") || "No tags"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/${post.id}`}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => removePost(post.id)}
                    disabled={busyId === post.id}
                    className="rounded-full border border-rose-800 px-3 py-1 text-xs text-rose-300 disabled:opacity-60"
                  >
                    {busyId === post.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {sortedPosts.length === 0 && <p className="text-sm text-zinc-500">No posts yet.</p>}
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-zinc-400">{message}</p> : null}
    </div>
  );
}
