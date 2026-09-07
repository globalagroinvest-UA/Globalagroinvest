import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app has two independent root layouts — the marketing site under
  // app/(site) and the Sanity Studio under app/studio (see
  // src/app/studio/layout.tsx for why they can't share one). That means
  // there's no single root layout to compose a catch-all 404 from, which is
  // exactly the case `global-not-found` exists for — see
  // node_modules/next/dist/docs/.../not-found.md.
  experimental: {
    globalNotFound: true,
  },
  images: {
    // Sanity's own CDN resizes/re-encodes images (see
    // src/lib/sanity/image-loader.ts) instead of Next's built-in Image
    // Optimization API — avoids a second resize hop and works unmodified
    // on $0-tier hosting that doesn't run the optimizer.
    loader: "custom",
    loaderFile: "./src/lib/sanity/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  // Next.js 16 removed the `eslint` config key and the `next lint` command —
  // `next build` no longer runs lint at all. Linting is a separate,
  // explicit `pnpm lint` step (see package.json + eslint.config.mjs).

  // `swr` (a transitive dependency of `sanity`'s Studio UI, used only inside
  // "use client" components) ships a "react-server" conditional export that
  // has no default export — only the browser build does. Next's RSC bundler
  // resolves that condition while building the client-reference graph for
  // /studio, which crashes with "export default doesn't exist" even though
  // swr never actually runs on the server. Opting it out of Server
  // Components bundling makes Next `require()` it natively instead, which
  // resolves the real (browser) build and sidesteps the broken condition.
  serverExternalPackages: ["swr", "sanity", "@sanity/vision"],
};

export default nextConfig;
