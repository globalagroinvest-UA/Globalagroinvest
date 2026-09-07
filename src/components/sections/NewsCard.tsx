import Link from "next/link";

import { SmartImage } from "@/components/ui/SmartImage";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format-date";
import { localizedHref } from "@/lib/i18n-links";
import type { NewsPost } from "@/types/content";

export function NewsCard({
  post,
  dict,
  locale,
}: {
  post: NewsPost;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <Link
      href={localizedHref(locale, `/news/${post.slug}`)}
      className="group flex flex-col overflow-hidden rounded-md bg-base-white shadow-sm ring-1 ring-neutral-100 transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <SmartImage
          image={post.coverImage}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <time dateTime={post.publishedAt} className="text-caption text-neutral-500">
          {formatDate(post.publishedAt, locale)}
        </time>
        <h3 className="mt-2 text-h3 font-semibold text-balance">{post.title}</h3>
        <p className="mt-3 flex-1 text-body text-neutral-600">{post.excerpt}</p>
        <span className="mt-4 text-body font-medium text-brand-700">{dict.cards.readMore}</span>
      </div>
    </Link>
  );
}
