import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth/require-admin";
import AdminPanelClient from "./AdminPanelClient";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 sm:px-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h1 className="mb-1 text-2xl font-semibold text-zinc-100">Admin</h1>
          <p className="mb-5 text-sm text-zinc-500">Sign in to manage posts.</p>
          <LoginForm />
        </div>
      </div>
    );
  }

  const posts = await db.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <AdminPanelClient
      initialPosts={posts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }))}
      adminUsername={session.username}
    />
  );
}
