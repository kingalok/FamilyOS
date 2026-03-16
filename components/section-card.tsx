import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  subtitle,
  children,
  className
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-panel", className)}>
      <div className="mb-5">
        <h3 className="text-xl font-semibold">{title}</h3>
        {subtitle ? <p className="mt-2 text-sm text-ink/65">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
