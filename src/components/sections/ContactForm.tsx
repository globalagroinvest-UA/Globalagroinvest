"use client";

import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/dictionaries";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { createContactFormSchema, type ContactFormErrors } from "@/lib/validations/contact";

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-sm border border-neutral-300 bg-base-white px-4 py-2.5 text-body text-graphite-900 placeholder:text-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

const errorInputClasses = "border-accent-500";

/**
 * The site's only form (CLAUDE.md §9): name, phone/email, message. Client
 * validates for instant feedback; the server (src/app/api/contact/route.ts)
 * re-validates everything independently and never trusts this component's
 * checks alone. Validation and status copy come from the active locale's
 * dictionary so an English-browsing visitor sees English errors.
 */
export function ContactForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const schema = useMemo(() => createContactFormSchema(dict), [dict]);

  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    company: "", // honeypot
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [renderedAt] = useState(() => Date.now());

  function updateField(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const candidate = { ...values, renderedAt };
    const parsed = schema.safeParse(candidate);

    if (!parsed.success) {
      const nextErrors: ContactFormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in nextErrors)) {
          nextErrors[key as keyof typeof values] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    setStatusMessage(null);

    try {
      const response = await fetch(`/api/contact?locale=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: ContactFormErrors;
      } | null;

      if (!response.ok || !result?.ok) {
        setStatus("error");
        setStatusMessage(result?.message ?? dict.contactForm.genericSubmitError);
        if (result?.fieldErrors) {
          setErrors(result.fieldErrors);
        }
        return;
      }

      setStatus("success");
      setStatusMessage(dict.contactForm.successMessage);
      setValues({ name: "", phone: "", email: "", message: "", company: "" });
    } catch {
      setStatus("error");
      setStatusMessage(dict.contactForm.networkError);
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-md border border-brand-200 bg-brand-50 p-6 text-body text-graphite-900"
      >
        {statusMessage}
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-body font-medium">
          {dict.contactForm.nameLabel}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(e) => updateField("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cn(inputClasses, errors.name && errorInputClasses)}
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-caption text-accent-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-body font-medium">
            {dict.contactForm.phoneLabel}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={cn(inputClasses, errors.phone && errorInputClasses)}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-body font-medium">
            {dict.contactForm.emailLabel}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(inputClasses, errors.email && errorInputClasses)}
          />
        </div>
      </div>
      {errors.phone && (
        <p id="phone-error" className="-mt-3 text-caption text-accent-600">
          {errors.phone}
        </p>
      )}

      <div>
        <label htmlFor="message" className="mb-1.5 block text-body font-medium">
          {dict.contactForm.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(inputClasses, "resize-y", errors.message && errorInputClasses)}
        />
        {errors.message && (
          <p id="message-error" className="mt-1.5 text-caption text-accent-600">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from sighted and keyboard users, real bots fill it. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => updateField("company", e.target.value)}
        />
      </div>

      {status === "error" && statusMessage && (
        <p role="alert" className="text-body text-accent-600">
          {statusMessage}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"} className="self-start">
        {status === "submitting" ? dict.contactForm.submitting : dict.contactForm.submit}
      </Button>
    </form>
  );
}
