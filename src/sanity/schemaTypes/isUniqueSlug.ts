import type { SlugIsUniqueValidator } from "sanity";

/**
 * /products/[slug] is a single dynamic route that resolves, at request time,
 * either a `category` or a `product` document by matching slug (see
 * src/app/products/[slug]/page.tsx for the resolver). For that to be
 * unambiguous, a slug must be unique across BOTH document types, not just
 * within one — otherwise a category and a product could collide on the same
 * URL. This validator is shared by both schemas.
 */
export const isUniqueSlugAcrossCategoryAndProduct: SlugIsUniqueValidator = async (
  slug,
  context,
) => {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: "2025-01-01" });
  const id = document?._id.replace(/^drafts\./, "");

  const query = `!defined(*[
    !(_id in [$draft, $published]) &&
    (_type == "product" || _type == "category") &&
    slug.current == $slug
  ][0]._id)`;

  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
  };

  return await client.fetch(query, params);
};
