import "server-only";

import { unstable_cache } from "next/cache";

import type { Locale } from "@/i18n/config";
import type { PortableTextBlock } from "@/types/content";

const AZURE_TRANSLATOR_KEY = process.env.AZURE_TRANSLATOR_KEY;
const AZURE_TRANSLATOR_ENDPOINT =
  process.env.AZURE_TRANSLATOR_ENDPOINT?.replace(/\/+$/, "") ??
  "https://api.cognitive.microsofttranslator.com";
// Only "Global" Azure Translator resources need no region header. A
// resource created in a specific Azure region requires this — see
// .env.example for the exact setting to check in the Azure portal.
const AZURE_TRANSLATOR_REGION = process.env.AZURE_TRANSLATOR_REGION;

export const isTranslationConfigured = Boolean(AZURE_TRANSLATOR_KEY);

/** Azure caps a single request at 100 array elements / ~50,000 characters
 *  combined. Content pages are far smaller than that, but batching in
 *  fixed-size chunks keeps this correct even for an unusually long page. */
const MAX_BATCH_SIZE = 100;

type AzureTranslateResult = { translations: { text: string }[] }[];

async function translateBatchViaAzure(
  texts: string[],
  targetLocale: string,
): Promise<string[]> {
  if (!isTranslationConfigured || texts.length === 0) return texts;

  const chunks: string[][] = [];
  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    chunks.push(texts.slice(i, i + MAX_BATCH_SIZE));
  }

  try {
    const translatedChunks = await Promise.all(
      chunks.map(async (chunk) => {
        const url = `${AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&from=uk&to=${targetLocale}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": AZURE_TRANSLATOR_KEY!,
            ...(AZURE_TRANSLATOR_REGION
              ? { "Ocp-Apim-Subscription-Region": AZURE_TRANSLATOR_REGION }
              : {}),
            "Content-Type": "application/json",
          },
          // Empty strings confuse the Azure API (and cost quota for
          // nothing) — substitute a single space and restore it below.
          body: JSON.stringify(chunk.map((text) => ({ text: text || " " }))),
        });

        if (!response.ok) {
          const body = await response.text().catch(() => "");
          throw new Error(`Azure Translator ${response.status}: ${body.slice(0, 500)}`);
        }

        const data = (await response.json()) as AzureTranslateResult;
        return chunk.map((original, index) => {
          if (!original) return "";
          return data[index]?.translations[0]?.text ?? original;
        });
      }),
    );
    return translatedChunks.flat();
  } catch (error) {
    // Never let a translation-provider outage break the page — fall back
    // to the Ukrainian source text, which is always correct, just not
    // localized. This is the same "fail soft, never fail silent-success"
    // principle the contact form uses.
    console.error("[translate] Azure Translator request failed, falling back to source text:", error);
    return texts;
  }
}

/**
 * Translates a batch of Ukrainian source strings to `targetLocale`, cached
 * by exact text + locale (`unstable_cache`, per Next.js's documented
 * pattern of defining the cache wrapper per-call with closured values in
 * `keyParts`). `tags` should include the same Sanity document-type tags
 * used by src/lib/sanity/fetch.ts — e.g. ["homePage"] — so that
 * /api/revalidate, triggered by a Sanity Studio publish, also invalidates
 * any cached translation of the content that changed. No separate
 * invalidation plumbing is needed.
 */
export async function translateTexts(
  texts: string[],
  targetLocale: Locale,
  tags: string[],
): Promise<string[]> {
  if (targetLocale === "uk" || texts.length === 0) return texts;

  const cached = unstable_cache(
    () => translateBatchViaAzure(texts, targetLocale),
    ["translate", targetLocale, ...texts],
    {
      tags: tags.map((tag) => `translate:${tag}`),
      // Machine translations of stable source text don't need frequent
      // re-fetching; 30 days is a reasonable ceiling even without a
      // revalidateTag firing in the meantime.
      revalidate: 60 * 60 * 24 * 30,
    },
  );
  return cached();
}

export async function translateText(
  text: string,
  targetLocale: Locale,
  tags: string[],
): Promise<string> {
  if (!text) return text;
  const [translated] = await translateTexts([text], targetLocale, tags);
  return translated ?? text;
}

type PortableTextSpan = { _type: string; text?: string };
type PortableTextBlockWithChildren = PortableTextBlock & {
  children?: PortableTextSpan[];
};

function isSpan(child: unknown): child is PortableTextSpan {
  return (
    typeof child === "object" &&
    child !== null &&
    (child as { _type?: unknown })._type === "span"
  );
}

/**
 * Translates the human-readable text inside a Portable Text (Sanity rich
 * text) document, preserving all structure: block keys, styles, mark
 * definitions, and non-span children are left untouched — only
 * `children[]._type === "span"` text nodes are replaced.
 */
export async function translatePortableText(
  blocks: PortableTextBlock[],
  targetLocale: Locale,
  tags: string[],
): Promise<PortableTextBlock[]> {
  if (targetLocale === "uk" || blocks.length === 0) return blocks;

  const typedBlocks = blocks as PortableTextBlockWithChildren[];
  const spanLocations: { blockIndex: number; childIndex: number }[] = [];
  const texts: string[] = [];

  typedBlocks.forEach((block, blockIndex) => {
    block.children?.forEach((child, childIndex) => {
      if (isSpan(child) && child.text) {
        spanLocations.push({ blockIndex, childIndex });
        texts.push(child.text);
      }
    });
  });

  if (texts.length === 0) return blocks;

  const translated = await translateTexts(texts, targetLocale, tags);

  const result = typedBlocks.map((block) => ({
    ...block,
    children: block.children ? [...block.children] : block.children,
  }));

  spanLocations.forEach(({ blockIndex, childIndex }, i) => {
    const children = result[blockIndex].children;
    if (!children) return;
    children[childIndex] = { ...children[childIndex], text: translated[i] };
  });

  return result as PortableTextBlock[];
}
