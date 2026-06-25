import Image from "next/image";

type PageHeroProps = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative px-4 py-12 sm:py-16">
      <Image
        src="/images/backgrounds/activites-bg.webp"
        alt=""
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-brand-navy/75" />
      <div className="relative mx-auto max-w-6xl text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
