import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

let cachedClient: SanityClient | null = null;

/**
 * Lazily-constructed Sanity client. Never call this without first checking
 * `isSanityConfigured` — see src/lib/sanity/fetch.ts, the only module
 * allowed to call this directly.
 */
export function getSanityClient(): SanityClient {
  if (!isSanityConfigured) {
    throw new Error(
      "Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID is empty). " +
        "Check isSanityConfigured before calling getSanityClient().",
    );
  }
  if (!cachedClient) {
    cachedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    });
  }
  return cachedClient;
}
