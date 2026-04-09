"use client";

import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      username: String(data.get("username") ?? ""),
      password: String(data.get("password") ?? ""),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Login failed.");
      } else {
        window.location.href = "/admin";
      }
    } catch {
      setError("Unexpected error, try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        name="username"
        type="text"
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
        placeholder="Username"
        autoComplete="username"
        required
      />
      <input
        name="password"
        type="password"
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
        placeholder="Password"
        autoComplete="current-password"
        required
      />
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-emerald-400 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      {error && <p className="text-sm text-rose-400">{error}</p>}
    </form>
  );
}
