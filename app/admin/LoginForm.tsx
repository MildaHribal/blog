"use client";

import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(json.error ?? "Login failed.");
      } else {
        window.location.reload();
      }
    } catch {
      setError("Unexpected error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        name="username"
        type="text"
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        placeholder="Username"
        autoComplete="username"
        required
      />
      <input
        name="password"
        type="password"
        className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        placeholder="Password"
        autoComplete="current-password"
        required
      />
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </form>
  );
}
