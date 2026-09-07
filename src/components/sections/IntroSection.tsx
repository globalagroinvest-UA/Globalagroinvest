import { Section } from "@/components/ui/Section";
import { SmartImage } from "@/components/ui/SmartImage";
import type { SanityImage } from "@/types/content";

export function IntroSection({
  title,
  text,
  image,
}: {
  title: string;
  text: string;
  image: SanityImage;
}) {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="text-h2 font-semibold text-balance">{title}</h2>
          <p className="mt-6 text-body-lg text-neutral-600 text-pretty">{text}</p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-md lg:aspect-[3/4]">
          <SmartImage image={image} sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </div>
    </Section>
  );
}
