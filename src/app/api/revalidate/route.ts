import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook target (Studio -> API -> Webhooks): fires on every publish
 * and revalidates exactly the ISR cache tag for the document type that
 * changed. Every data-fetching function in src/lib/sanity/fetch.ts tags its
 * `fetch()` call with the document `_type`(s) it depends on (including
 * referenced types — e.g. `homePage` also tags `brand`/`advantage`/
 * `businessDirection`), so invalidating one tag transparently invalidates
 * every cached query that reads that type, direct or referenced.
 *
 * Configure in Sanity: Manage -> API -> Webhooks ->
 *   URL: https://<your-domain>/api/revalidate
 *   Secret: same value as SANITY_REVALIDATE_SECRET
 *   Trigger on: Create, Update, Delete
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not configured.");
    return NextResponse.json(
      { revalidated: false, message: "Webhook secret is not configured." },
      { status: 503 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { revalidated: false, message: "Invalid signature." },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { revalidated: false, message: "Missing document _type in payload." },
        { status: 400 },
      );
    }

    // { expire: 0 } forces immediate expiration rather than the default
    // stale-while-revalidate window — a webhook call happens outside a
    // Server Action (where `updateTag` would apply), and an editor who just
    // clicked "Publish" expects the change live on next request, not stale
    // content served for up to the `max` profile's window. See Next's own
    // revalidateTag docs, "outside a Server Action" example.
    revalidateTag(body._type, { expire: 0 });

    return NextResponse.json({ revalidated: true, tag: body._type, now: Date.now() });
  } catch (error) {
    console.error("[revalidate] Failed to process webhook:", error);
    return NextResponse.json(
      { revalidated: false, message: "Unexpected error." },
      { status: 500 },
    );
  }
}
