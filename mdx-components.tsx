import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-zinc-50">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-zinc-100 scroll-mt-20"
    >
      <a href={`#${id}`} className="hover:text-emerald-400 transition-colors">
        {children}
      </a>
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="mt-6 mb-3 text-xl font-semibold text-zinc-200 scroll-mt-20"
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-zinc-300">{children}</p>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "/"}
        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
      >
        {children}
      </Link>
    );
  },
  code: ({ children, className }) => {
    if (className) {
      return (
        <code className={`${className} text-sm`}>{children}</code>
      );
    }
    return (
      <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm font-mono text-emerald-300">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-emerald-500 pl-4 italic text-zinc-400">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-zinc-300">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-zinc-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  hr: () => <hr className="my-8 border-zinc-800" />,
  img: (props) => (
    <Image
      sizes="(max-width: 768px) 100vw, 800px"
      className="rounded-lg border border-zinc-800 my-6"
      style={{ width: "100%", height: "auto" }}
      {...(props as ImageProps)}
      alt={props.alt ?? ""}
    />
  ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-zinc-300">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-zinc-700 bg-zinc-800 px-4 py-2 text-left font-semibold text-zinc-100">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-zinc-800 px-4 py-2">{children}</td>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}

