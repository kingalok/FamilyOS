export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-clay bg-sand/80 px-6 py-10 text-center">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/65">{description}</p>
    </div>
  );
}
