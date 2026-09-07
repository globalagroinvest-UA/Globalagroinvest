import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { PortableTextBlock } from "@/types/content";

/**
 * Shared renderer for Sanity's block-content (rich text) fields — used by
 * AboutPage.body and Product.description. Styles every block/mark with the
 * site's own design tokens instead of @portabletext/react's default
 * unstyled HTML, so CMS-authored text always matches the rest of the page.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-body text-neutral-600 [&:not(:first-child)]:mt-4">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-h2 font-semibold text-balance [&:not(:first-child)]:mt-10">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-h3 font-semibold [&:not(:first-child)]:mt-8">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-brand-600 pl-5 text-body-lg text-graphite-800 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-neutral-600">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-body text-neutral-600">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-graphite-900">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <Link
          href={href}
          className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </Link>
      );
    },
  },
};

export function RichText({ value }: { value: PortableTextBlock[] }) {
  if (!value || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
