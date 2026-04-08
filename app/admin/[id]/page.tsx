import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { getAllTags } from "@/lib/posts";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

interface EditAdminPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAdminPostPage({ params }: EditAdminPostPageProps) {
  await requireAdminPage();
  const { id } = await params;

  const post = await db.post.findUnique({ where: { id } });
  if (!post) {
    notFound();
  }

  const tags = await getAllTags({ includeDrafts: true });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-100">Edit post</h1>
        <Link
          href="/admin"
          className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
        >
          Back to overview
        </Link>
      </div>

      <PostEditor
        mode="edit"
        availableTags={tags}
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          description: post.description,
          content: post.content,
          tags: post.tags,
          author: post.author,
          coverImage: post.coverImage ?? "",
          status: post.status,
        }}
      />
    </div>
  );
}

