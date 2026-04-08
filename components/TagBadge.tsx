interface TagBadgeProps {
  tag: string;
  active?: boolean;
  href?: string;
}

export const TAG_COLORS: Record<string, string> = {
  "Next.js": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  React: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  TypeScript: "bg-blue-600/10 text-blue-300 border-blue-600/20",
  JavaScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Docker: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  DevOps: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Performance: "bg-green-500/10 text-green-400 border-green-500/20",
  SEO: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Node.js": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Web Dev": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Best Practices": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function getTagColor(tag: string): string {
  return (
    TAG_COLORS[tag] ??
    "bg-zinc-700/40 text-zinc-400 border-zinc-700/60"
  );
}

export default function TagBadge({ tag, active, href }: TagBadgeProps) {
  const colorClass = getTagColor(tag);
  const baseClass = `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-opacity ${colorClass} ${
    active ? "opacity-100" : "opacity-80 hover:opacity-100"
  }`;

  if (href) {
    return (
      <a href={href} className={baseClass}>
        {tag}
      </a>
    );
  }

  return <span className={baseClass}>{tag}</span>;
}

