type SectionHeadingProps = {
  label?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ label, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {label && (
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-aqua">
          {label}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-bold text-brand-navy">{title}</h2>
      {subtitle && (
        <p className="mt-3 leading-relaxed text-brand-navy/70">{subtitle}</p>
      )}
    </div>
  );
}
