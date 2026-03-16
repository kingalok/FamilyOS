import { Save } from "lucide-react";

export function EntityForm({
  title,
  description,
  children,
  submitLabel
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  submitLabel: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-panel">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-ink/65">{description}</p>
      </div>

      <div className="space-y-5">{children}</div>

      <div className="mt-8">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-pine px-5 py-3 text-sm font-medium text-white"
        >
          <Save className="h-4 w-4" />
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
