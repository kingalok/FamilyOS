export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-40 animate-pulse rounded-[2rem] bg-white/70" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-36 animate-pulse rounded-[2rem] bg-white/70" />
        <div className="h-36 animate-pulse rounded-[2rem] bg-white/70" />
        <div className="h-36 animate-pulse rounded-[2rem] bg-white/70" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-72 animate-pulse rounded-[2rem] bg-white/70" />
        <div className="h-72 animate-pulse rounded-[2rem] bg-white/70" />
      </div>
    </div>
  );
}
