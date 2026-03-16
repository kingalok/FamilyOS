import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-panel">
      <p className="text-xs uppercase tracking-[0.24em] text-pine/65">Not found</p>
      <h2 className="mt-2 text-3xl font-semibold">This record does not exist.</h2>
      <p className="mt-3 text-sm text-ink/65">
        The item may have been removed, or the seed data has not been loaded into your Supabase project yet.
      </p>
      <Link href="/" className="mt-6 inline-flex rounded-full bg-pine px-5 py-3 text-sm font-medium text-white">
        Return home
      </Link>
    </div>
  );
}
