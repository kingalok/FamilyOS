import type { Route } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

export function GlobalSearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  return (
    <form action={"/search" satisfies Route} className="flex flex-1 items-center gap-3 rounded-[1.5rem] border border-clay/70 bg-white/90 px-4 py-3 shadow-sm">
      <Search className="h-4 w-4 text-pine/60" />
      <input
        name="q"
        type="search"
        defaultValue={initialQuery}
        placeholder="Search tasks, events, and knowledge..."
        className="border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0"
      />
      <button type="submit" className="rounded-full bg-pine px-4 py-2 text-sm font-medium text-white">
        Search
      </button>
    </form>
  );
}

export function SearchShortcut() {
  return (
    <Link
      href={"/search" satisfies Route}
      className="inline-flex items-center rounded-full border border-clay/70 bg-white px-4 py-2 text-sm font-medium text-ink/70 hover:border-pine hover:text-pine"
    >
      Open search
    </Link>
  );
}
