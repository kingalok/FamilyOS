import type { Route } from "next";
import Link from "next/link";
import { CalendarDays, ClipboardList, NotebookPen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import type { SearchResult } from "@/lib/types";

const typeConfig = {
  event: { label: "Event", icon: CalendarDays, accent: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  task: { label: "Task", icon: ClipboardList, accent: "bg-amber-50 text-amber-700 border-amber-200" },
  knowledge: { label: "Knowledge", icon: NotebookPen, accent: "bg-sky-50 text-sky-700 border-sky-200" }
};

export function SearchResults({
  query,
  results
}: {
  query: string;
  results: SearchResult[];
}) {
  if (!query) {
    return (
      <EmptyState
        title="Start with a keyword"
        description="Search across tasks, events, and knowledge items from one place."
      />
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        title="No matches found"
        description={`No FamilyOS records matched "${query}". Try a broader keyword or search for a title instead.`}
      />
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => {
        const config = typeConfig[result.type];
        const Icon = config.icon;

        return (
          <Link
            key={`${result.type}-${result.id}`}
            href={result.href as Route}
            className="block rounded-[1.75rem] border border-clay/60 bg-white/85 p-5 shadow-panel transition hover:border-pine/40 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${config.accent}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {config.label}
                  </span>
                  <p className="truncate text-sm text-ink/55">{result.subtitle}</p>
                </div>
                <h3 className="mt-3 text-xl font-semibold">{result.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/65">{result.preview}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
