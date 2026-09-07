import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getDictionary } from "@/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { checkRateLimit } from "@/lib/rate-limit";
import { createContactFormSchema } from "@/lib/validations/contact";

// Needs the Node.js runtime (the `resend` SDK is not Edge-compatible).
export const runtime = "nodejs";

/**
 * A submission completed faster than this after the form rendered is
 * treated as a bot, not a human filling in three fields. Combined with
 * the honeypot field below, this needs no CAPTCHA/third-party script.
 */
const MIN_HUMAN_SUBMIT_MS = 3000;

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const rawLocale = new URL(request.url).searchParams.get("locale");
  const locale: Locale = rawLocale && isLocale(rawLocale) ? rawLocale : "uk";
  const dict = await getDictionary(locale);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, message: dict.contactApi.rateLimited },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: dict.contactApi.malformedRequest },
      { status: 400 },
    );
  }

  const contactFormSchema = createContactFormSchema(dict);
  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key] = issue.message;
      }
    }
    return NextResponse.json(
      { ok: false, message: dict.contactApi.invalidFields, fieldErrors },
      { status: 422 },
    );
  }

  const { name, phone, email, message, company, renderedAt } = parsed.data;

  // Honeypot: hidden via CSS, so only bots that fill every field submit
  // a value here. Acknowledge success without sending anything.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (Date.now() - renderedAt < MIN_HUMAN_SUBMIT_MS) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_FORM_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    // A real visitor's message must never be silently dropped — fail
    // loudly server-side and tell the visitor honestly rather than
    // faking a success response.
    console.error(
      "[contact] Missing RESEND_API_KEY / CONTACT_FORM_TO_EMAIL / CONTACT_FORM_FROM_EMAIL — contact form cannot send email.",
    );
    return NextResponse.json(
      { ok: false, message: dict.contactApi.serviceUnavailable },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const contactLine = [phone, email].filter(Boolean).join(" · ") || "не вказано";

  // The email to the manager is always in Ukrainian — that's their working
  // language regardless of which locale the visitor browsed in — but notes
  // the site language when it wasn't the default, since that's useful
  // context (e.g. a lead may expect a reply in English).
  const localeNote = locale !== "uk" ? `\nМова сайту: ${locale}` : "";

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `Нова заявка з сайту — ${name}`,
      replyTo: email || undefined,
      text: [
        `Ім'я: ${name}`,
        `Контакт: ${contactLine}`,
        "",
        "Повідомлення:",
        message,
      ].join("\n") + localeNote,
    });

    if (error) {
      console.error("[contact] Resend API error:", error);
      return NextResponse.json(
        { ok: false, message: dict.contactApi.sendFailed },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error sending email:", err);
    return NextResponse.json(
      { ok: false, message: dict.contactApi.unexpectedError },
      { status: 500 },
    );
  }
}
