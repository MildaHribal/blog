import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {year}{" "}
            <Link
              href="/"
              className="text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              ByteFeed
            </Link>
            . Built with Next.js & MDX.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/blog"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Blog
            </Link>
            <a
              href="https://github.com/miloslavhribal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/sitemap.xml"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
