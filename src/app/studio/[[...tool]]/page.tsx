'use client'
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

// *** export { metadata, viewport } from "next-sanity/studio";

// The Studio is a fully client-rendered SPA; there is nothing to prerender
// and every request should get the same static shell.
export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
