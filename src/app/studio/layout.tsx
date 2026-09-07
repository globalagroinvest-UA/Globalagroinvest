/**
 * A second, independent root layout for the /studio branch of the app
 * (see Next.js "multiple root layouts" via route groups). Sanity Studio
 * ships its own complete UI (styled-components) and must NOT inherit the
 * marketing site's Tailwind preflight/reset — Tailwind's global element
 * resets (buttons, inputs, box-sizing) would visibly break Studio's UI.
 * This layout therefore does not import "../(site)/globals.css".
 */
export default function StudioRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
