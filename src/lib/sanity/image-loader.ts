"use client";

import { sanityImageUrl } from "./image";

/**
 * Custom next/image loader: lets Sanity's own global CDN resize/re-encode
 * images (the documented "Sanity" loader pattern — see
 * node_modules/next/dist/docs/.../images.md) instead of round-tripping
 * through Next's built-in Image Optimization API. Configured globally in
 * next.config.ts, so every <Image>/<SmartImage> in the app uses it
 * automatically for real Sanity photography. Placeholder art never reaches
 * this loader — SmartImage renders it separately (see SmartImage.tsx).
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return sanityImageUrl(src, { w: width, q: quality });
}
