import Image from "next/image";

import { cn } from "@/lib/utils";
import type { SanityImage } from "@/types/content";

import { PlaceholderArt } from "./PlaceholderArt";

type SmartImageProps = {
  image: SanityImage;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** object-fit: defaults to cover, which suits nearly every use in this site. */
  objectFit?: "cover" | "contain";
};

/**
 * Renders a SanityImage in "fill" mode — the parent element must be
 * `position: relative` with a defined size (typically an aspect-ratio
 * utility class). This is the only image component used across the site so
 * that real Sanity photography and offline placeholder art are always
 * interchangeable — see src/types/content.ts.
 */
export function SmartImage({
  image,
  sizes = "100vw",
  className,
  priority,
  objectFit = "cover",
}: SmartImageProps) {
  if (image.placeholder) {
    return <PlaceholderArt {...image.placeholder} className={className} />;
  }

  return (
    <Image
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={image.lqip ? "blur" : undefined}
      blurDataURL={image.lqip}
      className={cn(
        objectFit === "cover" ? "object-cover" : "object-contain",
        className,
      )}
    />
  );
}
