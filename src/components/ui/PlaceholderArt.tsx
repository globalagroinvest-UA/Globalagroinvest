import {
  Award,
  Building2,
  Droplet,
  Factory,
  Fuel,
  Globe,
  Handshake,
  Leaf,
  Newspaper,
  Package,
  Route,
  ShieldCheck,
  Sparkles,
  Sprout,
  Tractor,
  Truck,
  Users,
  Warehouse,
  Wheat,
  type LucideIcon,
} from "lucide-react";

import type { PlaceholderIcon, PlaceholderSpec } from "@/types/content";

const ICONS: Record<PlaceholderIcon, LucideIcon> = {
  wheat: Wheat,
  sprout: Sprout,
  tractor: Tractor,
  fuel: Fuel,
  leaf: Leaf,
  droplet: Droplet,
  package: Package,
  building: Building2,
  warehouse: Warehouse,
  truck: Truck,
  factory: Factory,
  users: Users,
  award: Award,
  handshake: Handshake,
  sparkles: Sparkles,
  shieldCheck: ShieldCheck,
  newspaper: Newspaper,
  globe: Globe,
  route: Route,
};

const TONES: Record<PlaceholderSpec["tone"], { from: string; to: string }> = {
  brand: { from: "var(--color-brand-700)", to: "var(--color-brand-900)" },
  graphite: { from: "var(--color-graphite-700)", to: "var(--color-graphite-900)" },
  accent: { from: "var(--color-accent-600)", to: "var(--color-brand-800)" },
};

/**
 * Deterministic, dependency-free "photograph" stand-in for demo content.
 * Renders a duotone brand-color gradient with a large restrained line icon
 * and a subtle diagonal texture — deliberately abstract rather than a fake
 * photo, so nobody mistakes it for real company imagery (see
 * PROJECT_PLAN.md §11 and CLAUDE.md §12/§34 on demo content). Swapping in a
 * real photo later is just replacing the image field in Sanity; components
 * consuming SmartImage don't need to change.
 */
export function PlaceholderArt({
  icon,
  tone,
  className,
}: PlaceholderSpec & { className?: string }) {
  const Icon = ICONS[icon];
  const { from, to } = TONES[tone];

  return (
    <div
      className={className}
      role="img"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1.5px, transparent 1.5px, transparent 26px)",
        }}
      />
      <Icon
        aria-hidden="true"
        strokeWidth={1}
        style={{
          width: "38%",
          height: "38%",
          minWidth: 48,
          minHeight: 48,
          color: "rgba(255,255,255,0.5)",
        }}
      />
    </div>
  );
}
