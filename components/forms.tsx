import Link from "next/link";
import {
  upsertEvent,
  upsertKnowledgeItem,
  upsertPerson,
  upsertTask
} from "@/app/actions";
import type { Event, KnowledgeItem, Person, Task } from "@/lib/types";
import { EntityForm } from "@/components/entity-form";
import { stringifyTags } from "@/lib/utils";

function FormLayout({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

function JsonInput({ defaultValue }: { defaultValue?: unknown }) {
  return (
    <textarea
      name="metadata"
      defaultValue={defaultValue ? JSON.stringify(defaultValue, null, 2) : "{}"}
      className="font-mono text-xs"
    />
  );
}

export function PersonForm({ person }: { person?: Person | null }) {
  return (
    <form action={upsertPerson}>
      <EntityForm
        title={person ? "Edit person" : "Add person"}
        description="Store the core details that make family coordination easier later for both humans and agents."
        submitLabel={person ? "Save changes" : "Create person"}
      >
        {person ? <input type="hidden" name="id" defaultValue={person.id} /> : null}
        <FormLayout>
          <div>
            <label htmlFor="full_name">Full name</label>
            <input id="full_name" name="full_name" required defaultValue={person?.full_name ?? ""} />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <input id="role" name="role" defaultValue={person?.role ?? ""} />
          </div>
          <div>
            <label htmlFor="relationship">Relationship</label>
            <input id="relationship" name="relationship" defaultValue={person?.relationship ?? ""} />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" defaultValue={person?.email ?? ""} />
          </div>
          <div>
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" defaultValue={person?.phone ?? ""} />
          </div>
        </FormLayout>

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" defaultValue={person?.notes ?? ""} />
        </div>
        <div>
          <label htmlFor="metadata">Metadata (JSON)</label>
          <JsonInput defaultValue={person?.metadata} />
        </div>
      </EntityForm>
    </form>
  );
}

export function EventForm({
  event,
  people
}: {
  event?: Event | null;
  people: Person[];
}) {
  return (
    <form action={upsertEvent}>
      <EntityForm
        title={event ? "Edit event" : "Add event"}
        description="Capture plans with enough structure for the dashboard today and agent workflows later."
        submitLabel={event ? "Save changes" : "Create event"}
      >
        {event ? <input type="hidden" name="id" defaultValue={event.id} /> : null}
        <FormLayout>
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required defaultValue={event?.title ?? ""} />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <input id="category" name="category" defaultValue={event?.category ?? ""} />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={event?.status ?? "planned"}>
              <option value="planned">Planned</option>
              <option value="confirmed">Confirmed</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label htmlFor="owner_person_id">Owner</label>
            <select id="owner_person_id" name="owner_person_id" defaultValue={event?.owner_person_id ?? ""}>
              <option value="">No owner</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="event_start">Start</label>
            <input
              id="event_start"
              name="event_start"
              type="datetime-local"
              defaultValue={event?.event_start?.slice(0, 16) ?? ""}
            />
          </div>
          <div>
            <label htmlFor="event_end">End</label>
            <input
              id="event_end"
              name="event_end"
              type="datetime-local"
              defaultValue={event?.event_end?.slice(0, 16) ?? ""}
            />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input id="location" name="location" defaultValue={event?.location ?? ""} />
          </div>
          <div>
            <label htmlFor="tags">Tags</label>
            <input id="tags" name="tags" defaultValue={stringifyTags(event?.tags)} />
          </div>
        </FormLayout>

        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" defaultValue={event?.description ?? ""} />
        </div>
        <div>
          <label htmlFor="metadata">Metadata (JSON)</label>
          <JsonInput defaultValue={event?.metadata} />
        </div>
      </EntityForm>
    </form>
  );
}

export function TaskForm({
  task,
  people,
  events
}: {
  task?: Task | null;
  people: Person[];
  events: Event[];
}) {
  return (
    <form action={upsertTask}>
      <EntityForm
        title={task ? "Edit task" : "Add task"}
        description="Represent household work as structured records the dashboard and future tools can share."
        submitLabel={task ? "Save changes" : "Create task"}
      >
        {task ? <input type="hidden" name="id" defaultValue={task.id} /> : null}
        <FormLayout>
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required defaultValue={task?.title ?? ""} />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <input id="category" name="category" defaultValue={task?.category ?? ""} />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={task?.status ?? "open"}>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" defaultValue={task?.priority ?? "medium"}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label htmlFor="due_at">Due at</label>
            <input id="due_at" name="due_at" type="datetime-local" defaultValue={task?.due_at?.slice(0, 16) ?? ""} />
          </div>
          <div>
            <label htmlFor="owner_person_id">Owner</label>
            <select id="owner_person_id" name="owner_person_id" defaultValue={task?.owner_person_id ?? ""}>
              <option value="">No owner</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="related_event_id">Related event</label>
            <select id="related_event_id" name="related_event_id" defaultValue={task?.related_event_id ?? ""}>
              <option value="">No related event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tags">Tags</label>
            <input id="tags" name="tags" defaultValue={stringifyTags(task?.tags)} />
          </div>
        </FormLayout>

        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" defaultValue={task?.description ?? ""} />
        </div>
        <div>
          <label htmlFor="metadata">Metadata (JSON)</label>
          <JsonInput defaultValue={task?.metadata} />
        </div>
      </EntityForm>
    </form>
  );
}

export function KnowledgeForm({
  item,
  people
}: {
  item?: KnowledgeItem | null;
  people: Person[];
}) {
  return (
    <form action={upsertKnowledgeItem}>
      <EntityForm
        title={item ? "Edit knowledge item" : "Add knowledge item"}
        description="Keep structured notes, routines, and reference material in one durable shared knowledge base."
        submitLabel={item ? "Save changes" : "Create item"}
      >
        {item ? <input type="hidden" name="id" defaultValue={item.id} /> : null}
        <FormLayout>
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required defaultValue={item?.title ?? ""} />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <input id="category" name="category" defaultValue={item?.category ?? ""} />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={item?.status ?? "active"}>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label htmlFor="owner_person_id">Owner</label>
            <select id="owner_person_id" name="owner_person_id" defaultValue={item?.owner_person_id ?? ""}>
              <option value="">No owner</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="source">Source</label>
            <input id="source" name="source" defaultValue={item?.source ?? ""} />
          </div>
          <div>
            <label htmlFor="tags">Tags</label>
            <input id="tags" name="tags" defaultValue={stringifyTags(item?.tags)} />
          </div>
        </FormLayout>

        <div>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" defaultValue={item?.content ?? ""} />
        </div>
        <div>
          <label htmlFor="metadata">Metadata (JSON)</label>
          <JsonInput defaultValue={item?.metadata} />
        </div>
      </EntityForm>
    </form>
  );
}

export function FormPageChrome({
  backHref,
  backLabel,
  children
}: {
  backHref: string;
  backLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Link href={backHref} className="inline-flex text-sm font-medium text-pine">
        {backLabel}
      </Link>
      {children}
    </div>
  );
}
