import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { getPeople } from "@/lib/data";

export default async function PeoplePage() {
  const people = await getPeople();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Family directory"
        description="The people table is the anchor for ownership, relationships, and the household context used across other domains."
        actionHref="/people/new"
        actionLabel="Add person"
      />

      <SectionCard
        title="People"
        subtitle="A simple, reusable person model that other tables can reference without coupling the app to a rigid family structure."
      >
        <DataTable
          data={people}
          columns={[
            { key: "full_name", label: "Name", render: (person) => person.full_name },
            { key: "role", label: "Role", render: (person) => person.role ?? "—" },
            {
              key: "relationship",
              label: "Relationship",
              render: (person) => person.relationship ?? "—"
            },
            { key: "email", label: "Email", render: (person) => person.email ?? "—" }
          ]}
          emptyTitle="No people yet"
          emptyDescription="Add the first family member to start assigning tasks, events, and knowledge ownership."
          editHref={(person) => `/people/${person.id}`}
        />
      </SectionCard>
    </div>
  );
}
