import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { getDashboardData } from "@/lib/data";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Family pulse"
        description="Track the important moving parts of home life from one shared data layer that both the web app and future AI agents can use."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="People"
          value={String(dashboard.peopleCount)}
          detail="Core family members and primary household roles."
        />
        <StatCard
          label="Open Tasks"
          value={String(dashboard.openTasks.length)}
          detail="Tasks that still need attention across the family."
        />
        <StatCard
          label="Overdue"
          value={String(dashboard.overdueTasks.length)}
          detail="Open tasks with a due date already behind us."
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Upcoming events"
          subtitle="The next scheduled moments across school, home, and personal plans."
        >
          <div className="space-y-3">
            {dashboard.upcomingEvents.length === 0 ? (
              <p className="text-sm text-ink/65">No upcoming events yet.</p>
            ) : (
              dashboard.upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-[1.5rem] border border-clay/60 bg-sand/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="mt-1 text-sm text-ink/65">{formatDateTime(event.event_start)}</p>
                      {event.location ? (
                        <p className="mt-1 text-sm text-ink/55">{event.location}</p>
                      ) : null}
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-pine/70">
                      {event.status ?? "planned"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/events" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-pine">
            Explore events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionCard>

        <SectionCard
          title="Open tasks"
          subtitle="Household work, school logistics, and personal follow-through."
        >
          <div className="space-y-3">
            {dashboard.openTasks.length === 0 ? (
              <p className="text-sm text-ink/65">No open tasks right now.</p>
            ) : (
              dashboard.openTasks.map((task) => (
                <div key={task.id} className="rounded-[1.5rem] border border-clay/60 bg-sand/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="mt-1 text-sm text-ink/65">
                        {task.owner?.full_name ?? "Unassigned"} • {formatDate(task.due_at)}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-pine/70">
                      {task.priority ?? "medium"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/tasks" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-pine">
            Explore tasks
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <SectionCard
          title="Overdue tasks"
          subtitle="Items that would benefit from rescheduling or immediate action."
        >
          <div className="space-y-3">
            {dashboard.overdueTasks.length === 0 ? (
              <p className="text-sm text-ink/65">Nothing overdue.</p>
            ) : (
              dashboard.overdueTasks.map((task) => (
                <div key={task.id} className="rounded-[1.5rem] border border-rose-200 bg-rose-50/90 p-4">
                  <p className="font-semibold">{task.title}</p>
                  <p className="mt-1 text-sm text-ink/65">
                    Due {formatDate(task.due_at)} • {task.owner?.full_name ?? "Unassigned"}
                  </p>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Recently updated knowledge"
          subtitle="Reference material the household is actively using."
        >
          <div className="space-y-3">
            {dashboard.recentKnowledgeItems.length === 0 ? (
              <p className="text-sm text-ink/65">No knowledge items yet.</p>
            ) : (
              dashboard.recentKnowledgeItems.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-clay/60 bg-sand/70 p-4">
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-ink/65">{item.category ?? "General"}</p>
                  <p className="mt-2 max-h-12 overflow-hidden text-sm leading-6 text-ink/60">
                    {item.content ?? "No content provided yet."}
                  </p>
                </div>
              ))
            )}
          </div>
          <Link
            href="/knowledge"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-pine"
          >
            Explore knowledge
            <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionCard>
      </section>
    </div>
  );
}
