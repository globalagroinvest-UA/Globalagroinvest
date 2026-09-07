import Link from "next/link";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium text-button transition-colors duration-200 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-base-white hover:bg-brand-700 active:bg-brand-800",
  secondary:
    "border border-neutral-300 bg-transparent text-graphite-900 hover:border-brand-600 hover:text-brand-700",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5 text-body-lg",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
};

type ButtonAsButton = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Renders a styled <Link> when `href` is given, otherwise a native
 * <button> — covers every CTA in the site (CMS-driven `cta` objects and
 * the contact form's submit button) with one consistent look.
 */
export function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const classes = cn(base, variants[variant], sizes[size], props.className);

  if ("href" in props && props.href) {
    const { href, children } = props;
    const isExternal = /^https?:\/\//.test(href);
    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  const { children, type = "button", disabled, onClick, ...rest } =
    props as ButtonAsButton;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      aria-label={rest["aria-label"]}
    >
      {children}
    </button>
  );
}
