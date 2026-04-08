"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getTagColor } from "@/components/TagBadge";
import { estimateReadingMinutes } from "@/lib/reading-time";

type PostStatus = "DRAFT" | "PUBLISHED";

export interface AdminPostFormData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  tags: string[];
  author: string;
  coverImage: string;
  status: PostStatus;
}

interface PostEditorProps {
  mode: "create" | "edit";
  initialData?: AdminPostFormData;
  availableTags: string[];
}

const EMPTY_STATE: AdminPostFormData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  tags: [],
  author: "Karel",
  coverImage: "",
  status: "DRAFT",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function uniqueTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags) {
    const normalized = tag.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

export default function PostEditor({ mode, initialData, availableTags }: PostEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState<AdminPostFormData>(initialData ?? EMPTY_STATE);
  const [newTag, setNewTag] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const allTagOptions = useMemo(
    () => uniqueTags([...availableTags, ...form.tags]),
    [availableTags, form.tags]
  );

  const readingMinutes = useMemo(() => estimateReadingMinutes(form.content), [form.content]);

  function toggleTag(tag: string) {
    setForm((prev) => {
      const exists = prev.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t.toLowerCase() !== tag.toLowerCase())
          : uniqueTags([...prev.tags, tag]),
      };
    });
  }

  function addNewTag() {
    const next = newTag.trim();
    if (!next) return;
    setForm((prev) => ({ ...prev, tags: uniqueTags([...prev.tags, next]) }));
    setNewTag("");
  }

  function insertSnippet(snippet: string) {
    const input = textareaRef.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const before = form.content.slice(0, start);
    const selected = form.content.slice(start, end);
    const after = form.content.slice(end);
    const nextContent = `${before}${snippet.replace("$SELECTION$", selected)}${after}`;

    setForm((prev) => ({ ...prev, content: nextContent }));

    requestAnimationFrame(() => {
      input.focus();
      const cursor = before.length + snippet.indexOf("$SELECTION$");
      if (snippet.includes("$SELECTION$")) {
        const fallback = cursor >= before.length ? cursor : before.length + snippet.length;
        input.setSelectionRange(fallback, fallback);
      }
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      content: form.content,
      tags: uniqueTags(form.tags),
      author: form.author.trim() || "Karel",
      coverImage: form.coverImage.trim(),
      status: form.status,
    };

    const endpoint = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${form.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as {
        error?: string;
        details?: { fieldErrors?: Record<string, string[]> };
      };

      if (!response.ok) {
        const fieldErrors = json.details?.fieldErrors
          ? Object.values(json.details.fieldErrors).flat().filter(Boolean)
          : [];
        const detailText = fieldErrors.length > 0 ? fieldErrors.join(" ") : "";
        setMessage([json.error ?? "Failed to save post.", detailText].filter(Boolean).join(" "));
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setMessage("An unexpected error occurred while saving.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              title: e.target.value,
              slug: prev.slug || slugify(e.target.value),
            }))
          }
          placeholder="Post title"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          required
        />
        <input
          value={form.slug}
          onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
          placeholder="post-slug"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          required
        />
      </div>

      <input
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        placeholder="Short description"
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        required
      />

      <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => insertSnippet("## $SELECTION$\n")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">H2</button>
          <button type="button" onClick={() => insertSnippet("### $SELECTION$\n")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">H3</button>
          <button type="button" onClick={() => insertSnippet("**$SELECTION$**")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">Bold</button>
          <button type="button" onClick={() => insertSnippet("- $SELECTION$\n- \n- \n")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">List</button>
          <button
            type="button"
            onClick={() => insertSnippet("```ts\n$SELECTION$\n```\n")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
          >
            Code
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("![Image description](https://)\n")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
          >
            Image
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={form.content}
          onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Markdown content"
          className="h-80 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm"
          required
        />
        <p className="mt-2 text-xs text-zinc-500">Estimated reading time: {readingMinutes} min</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Tags</p>
        <div className="flex flex-wrap gap-2">
          {allTagOptions.map((tag) => {
            const selected = form.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
            const color = getTagColor(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${color} ${selected ? "opacity-100 ring-1 ring-emerald-400/60" : "opacity-70 hover:opacity-100"}`}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag"
            className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addNewTag}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <input
          value={form.author}
          onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
          placeholder="Author"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />
        <input
          value={form.coverImage}
          onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
          placeholder="Cover image URL"
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:col-span-2"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={form.status}
          onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as PostStatus }))}
          className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>

        <button
          disabled={busy}
          type="submit"
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
        >
          {busy ? "Saving…" : mode === "create" ? "Create post" : "Save changes"}
        </button>
      </div>

      {message ? <p className="text-sm text-rose-300">{message}</p> : null}
    </form>
  );
}

