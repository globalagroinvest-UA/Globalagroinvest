import { z } from "zod";

import type { Dictionary } from "@/dictionaries";

/**
 * Shared between the client form (src/components/sections/ContactForm.tsx)
 * and the server route handler (src/app/api/contact/route.ts) — the server
 * re-validates independently and never trusts client-side checks alone.
 *
 * A factory rather than a static schema so validation messages come from
 * the active locale's dictionary — the visitor sees errors in whichever
 * language they're browsing in, uk or en.
 */
export function createContactFormSchema(dict: Dictionary) {
  const v = dict.contactForm.validation;
  return z
    .object({
      name: z.string().trim().min(2, v.nameRequired).max(100, v.nameTooLong),
      phone: z.string().trim().max(30, v.phoneTooLong).optional().or(z.literal("")),
      email: z.union([z.email(v.emailInvalid), z.literal("")]).optional(),
      message: z.string().trim().min(10, v.messageTooShort).max(2000, v.messageTooLong),
      // Honeypot: real visitors never see or fill this field (hidden via CSS).
      company: z.string().max(0).optional().or(z.literal("")),
      // Client-side timestamp (ms since page load) — a submission faster than
      // a human could plausibly type is treated as spam. See route.ts.
      renderedAt: z.number(),
    })
    .superRefine((data, ctx) => {
      if (!data.phone && !data.email) {
        ctx.addIssue({ code: "custom", path: ["phone"], message: v.phoneOrEmailRequired });
      }
    });
}

export type ContactFormSchema = ReturnType<typeof createContactFormSchema>;
export type ContactFormValues = z.infer<ContactFormSchema>;
export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
