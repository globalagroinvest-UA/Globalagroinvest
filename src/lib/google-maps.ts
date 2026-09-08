/**
 * Google Maps embedding is picky about *which kind* of URL it accepts in an
 * <iframe src>. Google only serves an embeddable response (no
 * `X-Frame-Options` / `frame-ancestors` restriction) for URLs generated via
 * Maps → Share → "Embed a map" (`.../maps/embed?pb=...`) or the legacy
 * `.../maps?...&output=embed` form.
 *
 * A regular "Share" link copied from the address bar or the mobile share
 * sheet (`.../maps/place/...`, `.../maps/@lat,lng,zoom`, or a shortened
 * `https://maps.app.goo.gl/...` link) points at the normal Maps *web app*,
 * which Google explicitly blocks from being framed. Loading one of those in
 * an <iframe> fails with a browser-level "refused to connect" — not a bug in
 * this app's code, but a mismatch between what the CMS field expects and
 * what was pasted into it.
 *
 * Since a non-technical editor can easily paste the wrong kind of link, we
 * never trust `mapEmbedUrl` blindly: we only render an <iframe> when it
 * actually matches an embeddable shape, and otherwise fall back to a plain
 * link (which works with *any* Google Maps URL) so the contacts page never
 * shows a broken, refused iframe.
 */

const EMBED_HOSTS = new Set(["www.google.com", "google.com"]);

/**
 * Returns `url` unchanged if it is safe to put directly into an
 * <iframe src>, otherwise `null`.
 */
export function getEmbeddableMapUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:" || !EMBED_HOSTS.has(parsed.hostname)) {
    return null;
  }

  const isEmbedPath = parsed.pathname === "/maps/embed" || parsed.pathname === "/maps/embed/";
  const hasEmbedOutput = parsed.searchParams.get("output") === "embed";

  return isEmbedPath || hasEmbedOutput ? url : null;
}

/**
 * A plain, always-clickable Google Maps link for an address — safe as an
 * `<a href>` (unlike an <iframe>, opening Maps in a new tab has no framing
 * restriction), used as the fallback when we don't have a valid embed URL.
 */
export function getAddressMapSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Best-effort embeddable map for an address, using the legacy
 * `output=embed` form. Not as precise as a hand-picked embed URL (Google
 * resolves the address via search, so results can vary), but it degrades
 * gracefully — it's built from the same address already trusted elsewhere
 * on the site (footer, JSON-LD) rather than from unpredictable user input.
 */
export function getAddressEmbedUrl(address: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
