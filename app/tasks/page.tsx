import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { getTasks } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tasks"
        title="Household work queue"
        description="Track what needs to happen, who owns it, and how it connects to events or routines."
        actionHref="/tasks/new"
        actionLabel="Add task"
      />

      <SectionCard title="Tasks" subtitle="A practical task model that is immediately useful and easy to expand later.">
        <DataTable
          data={tasks}
          columns={[
            { key: "title", label: "Title", render: (task) => task.title },
            { key: "due_at", label: "Due", render: (task) => formatDate(task.due_at) },
            { key: "owner", label: "Owner", render: (task) => task.owner?.full_name ?? "—" },
            { key: "status", label: "Status", render: (task) => task.status ?? "open" },
            { key: "priority", label: "Priority", render: (task) => task.priority ?? "medium" }
          ]}
          emptyTitle="No tasks yet"
          emptyDescription="Add the first task to start turning family plans into trackable work."
          editHref={(task) => `/tasks/${task.id}`}
        />
      </SectionCard>
    </div>
  );
}
