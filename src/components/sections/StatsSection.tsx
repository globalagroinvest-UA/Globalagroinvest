import { Section } from "@/components/ui/Section";
import type { StatValue } from "@/types/content";

export function StatsSection({ stats }: { stats: StatValue[] }) {
  if (stats.length === 0) return null;

  return (
    <Section tone="dark">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={`${stat.label}-${index}`} className="text-center lg:text-left">
            <p className="text-display font-bold text-brand-300">
              {stat.value}
              {stat.suffix}
            </p>
            <p className="mt-2 text-body text-neutral-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
