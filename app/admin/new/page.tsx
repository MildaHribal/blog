import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { getAllTags } from "@/lib/posts";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function NewAdminPostPage() {
  await requireAdminPage();
  const tags = await getAllTags({ includeDrafts: true });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-100">New post</h1>
        <Link
          href="/admin"
          className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
        >
          Back to overview
        </Link>
      </div>

      <PostEditor mode="create" availableTags={tags} />
    </div>
  );
}

