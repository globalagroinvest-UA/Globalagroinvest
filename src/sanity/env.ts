/**
 * Central place for Sanity-related environment variables.
 *
 * `projectId`/`dataset` are intentionally allowed to be empty at build time:
 * this repository is meant to run (and be reviewed / built / linted) before
 * a real Sanity project has been created for the client. Every consumer of
 * this module must check `isSanityConfigured` and fall back to demo content
 * when it's false — see src/lib/sanity/fetch.ts.
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

export const isSanityConfigured = Boolean(projectId);

export const studioBasePath = "/studio";
