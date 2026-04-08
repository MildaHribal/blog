import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-100 transition-colors hover:text-emerald-400"
        >
          <span className="text-emerald-400 font-mono text-lg font-bold">&lt;</span>
          <span className="font-semibold tracking-tight">ByteFeed</span>
          <span className="text-emerald-400 font-mono text-lg font-bold">/&gt;</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/blog"
            className="rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            Blog
          </Link>
          <a
            href="https://hribal.site"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            Portfolio
          </a>
          <a
            href="https://github.com/miloslavhribal"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-medium text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
