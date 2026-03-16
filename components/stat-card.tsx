export function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-panel">
      <p className="text-xs uppercase tracking-[0.24em] text-pine/65">{label}</p>
      <p className="mt-4 text-4xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-ink/65">{detail}</p>
    </div>
  );
}
