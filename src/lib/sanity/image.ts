/**
 * Sanity's asset CDN accepts resize/format query params directly on the raw
 * asset URL (https://www.sanity.io/docs/image-urls) — no need for the
 * @sanity/image-url builder package once GROQ has already resolved
 * `asset->url` for us (see IMAGE_FIELDS in queries.ts). This one helper
 * covers both the custom next/image loader and fixed-size OG image URLs.
 */
export function sanityImageUrl(
  url: string,
  params: { w?: number; h?: number; q?: number; fit?: "max" | "crop" } = {},
): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("fit", params.fit ?? "max");
    if (params.w) parsed.searchParams.set("w", String(Math.round(params.w)));
    if (params.h) parsed.searchParams.set("h", String(Math.round(params.h)));
    parsed.searchParams.set("q", String(params.q ?? 75));
    return parsed.href;
  } catch {
    return url;
  }
}
