import { CircleCheck } from "lucide-react";

import { Section } from "@/components/ui/Section";
import type { Advantage } from "@/types/content";

export function AdvantagesSection({
  title,
  advantages,
}: {
  title: string;
  advantages: Advantage[];
}) {
  if (advantages.length === 0) return null;

  return (
    <Section>
      <h2 className="text-h2 font-semibold text-balance">{title}</h2>
      <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {advantages.map((advantage) => (
          <div key={advantage._id} className="flex gap-4">
            <CircleCheck
              size={24}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-brand-600"
              aria-hidden="true"
            />
            <div>
              <h3 className="text-h3 font-semibold">{advantage.title}</h3>
              <p className="mt-2 text-body text-neutral-600">{advantage.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
