/**
 * Sanity Studio configuration, embedded into the Next.js app at /studio
 * (see src/app/studio/[[...tool]]/page.tsx). This file also doubles as the
 * config the `sanity` CLI reads (see sanity.cli.ts) for tasks like dataset
 * import/export.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema, SINGLETON_TYPES } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Агрокомпанія — керування сайтом",

  projectId,
  dataset,
  basePath: "/studio",

  schema,

  plugins: [
    structureTool({ structure }),
    // Vision lets a developer run raw GROQ queries from the Studio UI.
    // Harmless to ship, but only add it in non-production if you'd rather
    // keep the manager's UI minimal.
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  document: {
    // Singletons (site settings + one-off pages) can be edited and
    // published, but never duplicated or deleted from the UI — there must
    // always be exactly one of each.
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action),
          )
        : input,
    // Hide singleton types from the global "Create new document" menu —
    // they're only reachable via the pinned links in structure.ts.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((item) => !SINGLETON_TYPES.has(item.templateId))
        : prev,
  },
});
