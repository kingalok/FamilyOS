import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { getKnowledgeItems } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function KnowledgePage() {
  const items = await getKnowledgeItems();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Knowledge"
        title="Family knowledge base"
        description="Capture recurring instructions, household context, and useful notes in a structured long-lived store."
        actionHref="/knowledge/new"
        actionLabel="Add item"
      />

      <SectionCard
        title="Knowledge items"
        subtitle="Reference material that stays queryable for both the app interface and future agent workflows."
      >
        <DataTable
          data={items}
          columns={[
            { key: "title", label: "Title", render: (item) => item.title },
            { key: "category", label: "Category", render: (item) => item.category ?? "General" },
            { key: "owner", label: "Owner", render: (item) => item.owner?.full_name ?? "—" },
            { key: "updated_at", label: "Updated", render: (item) => formatDateTime(item.updated_at) }
          ]}
          emptyTitle="No knowledge items yet"
          emptyDescription="Add the first note, routine, or family reference so the system has something reusable to retrieve later."
          editHref={(item) => `/knowledge/${item.id}`}
        />
      </SectionCard>
    </div>
  );
}
