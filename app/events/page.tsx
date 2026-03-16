import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { getEvents } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Events"
        title="Shared calendar"
        description="Plan family logistics, school dates, and special moments in one structured event stream."
        actionHref="/events/new"
        actionLabel="Add event"
      />

      <SectionCard title="Events" subtitle="Upcoming and historical records backed directly by Supabase.">
        <DataTable
          data={events}
          columns={[
            { key: "title", label: "Title", render: (event) => event.title },
            { key: "when", label: "When", render: (event) => formatDateTime(event.event_start) },
            { key: "owner", label: "Owner", render: (event) => event.owner?.full_name ?? "—" },
            { key: "status", label: "Status", render: (event) => event.status ?? "planned" }
          ]}
          emptyTitle="No events yet"
          emptyDescription="Add the first event to populate the dashboard and connect tasks to upcoming plans."
          editHref={(event) => `/events/${event.id}`}
        />
      </SectionCard>
    </div>
  );
}
