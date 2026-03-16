import Link from "next/link";
import { Plus } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel
}: {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-panel sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-pine/65">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">{description}</p>
      </div>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-full bg-pine px-5 py-3 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
