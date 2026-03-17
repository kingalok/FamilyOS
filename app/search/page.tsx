import { PageHeader } from "@/components/page-header";
import { SearchResults } from "@/components/search/search-results";
import { SectionCard } from "@/components/section-card";
import { getGlobalSearchResults } from "@/lib/data";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const results = await getGlobalSearchResults(query);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Search"
        title="Find anything fast"
        description="Search across events, tasks, and shared knowledge from a single FamilyOS view."
      />

      <SectionCard
        title={query ? `Results for "${query}"` : "Global search"}
        subtitle={query ? `${results.length} match${results.length === 1 ? "" : "es"} across FamilyOS.` : "Search by title, description, category, or source."}
      >
        <SearchResults query={query} results={results} />
      </SectionCard>
    </div>
  );
}
