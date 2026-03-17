import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardData, Event, KnowledgeItem, Person, SearchResult, Task } from "@/lib/types";

export async function getPeople() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Person[];
}

export async function getPerson(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("people").select("*").eq("id", id).single();

  if (error) {
    return null;
  }

  return data as Person;
}

export async function getEvents() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, owner:people(id, full_name)")
    .order("event_start", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Event[];
}

export async function getEvent(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*, owner:people(id, full_name)")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Event;
}

export async function getTasks() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*, owner:people(id, full_name), related_event:events(id, title)")
    .order("due_at", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Task[];
}

export async function getTask(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*, owner:people(id, full_name), related_event:events(id, title)")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as Task;
}

export async function getKnowledgeItems() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*, owner:people(id, full_name)")
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as KnowledgeItem[];
}

export async function getKnowledgeItem(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*, owner:people(id, full_name)")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as KnowledgeItem;
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();
  const now = new Date().toISOString();

  const [peopleResult, upcomingEventsResult, openTasksResult, overdueTasksResult, knowledgeResult] =
    await Promise.all([
      supabase.from("people").select("id", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("*, owner:people(id, full_name)")
        .gte("event_start", now)
        .order("event_start", { ascending: true })
        .limit(5),
      supabase
        .from("tasks")
        .select("*, owner:people(id, full_name), related_event:events(id, title)")
        .eq("status", "open")
        .order("due_at", { ascending: true, nullsFirst: false })
        .limit(6),
      supabase
        .from("tasks")
        .select("*, owner:people(id, full_name), related_event:events(id, title)")
        .eq("status", "open")
        .lt("due_at", now)
        .order("due_at", { ascending: true })
        .limit(6),
      supabase
        .from("knowledge_items")
        .select("*, owner:people(id, full_name)")
        .order("updated_at", { ascending: false })
        .limit(5)
    ]);

  const errors = [
    peopleResult.error,
    upcomingEventsResult.error,
    openTasksResult.error,
    overdueTasksResult.error,
    knowledgeResult.error
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(errors[0]?.message ?? "Failed to load dashboard data.");
  }

  return {
    peopleCount: peopleResult.count ?? 0,
    upcomingEvents: (upcomingEventsResult.data ?? []) as Event[],
    openTasks: (openTasksResult.data ?? []) as Task[],
    overdueTasks: (overdueTasksResult.data ?? []) as Task[],
    recentKnowledgeItems: (knowledgeResult.data ?? []) as KnowledgeItem[]
  };
}

function snippet(value?: string | null, fallback = "No additional details yet.") {
  const text = value?.trim();
  if (!text) {
    return fallback;
  }

  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

export async function getGlobalSearchResults(query: string): Promise<SearchResult[]> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const pattern = `%${normalizedQuery}%`;

  const [eventsResult, tasksResult, knowledgeResult] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, description, category, location, status, event_start, updated_at")
      .or(`title.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern},location.ilike.${pattern}`)
      .order("event_start", { ascending: true, nullsFirst: false })
      .limit(8),
    supabase
      .from("tasks")
      .select("id, title, description, category, status, priority, due_at, updated_at")
      .or(`title.ilike.${pattern},description.ilike.${pattern},category.ilike.${pattern},status.ilike.${pattern}`)
      .order("due_at", { ascending: true, nullsFirst: false })
      .limit(8),
    supabase
      .from("knowledge_items")
      .select("id, title, content, category, status, source, updated_at")
      .or(`title.ilike.${pattern},content.ilike.${pattern},category.ilike.${pattern},source.ilike.${pattern}`)
      .order("updated_at", { ascending: false })
      .limit(8)
  ]);

  const errors = [eventsResult.error, tasksResult.error, knowledgeResult.error].filter(Boolean);
  if (errors.length > 0) {
    throw new Error(errors[0]?.message ?? "Failed to search FamilyOS.");
  }

  const events = (eventsResult.data ?? []).map((event) => ({
    id: event.id,
    type: "event" as const,
    title: event.title,
    subtitle: [event.category ?? "Event", event.location ?? event.status ?? "Planned"].join(" • "),
    preview: snippet(event.description, "No event description yet."),
    href: `/events/${event.id}`,
    updatedAt: event.updated_at
  }));

  const tasks = (tasksResult.data ?? []).map((task) => ({
    id: task.id,
    type: "task" as const,
    title: task.title,
    subtitle: [task.category ?? "Task", task.priority ?? "medium", task.status ?? "open"].join(" • "),
    preview: snippet(task.description, "No task description yet."),
    href: `/tasks/${task.id}`,
    updatedAt: task.updated_at
  }));

  const knowledge = (knowledgeResult.data ?? []).map((item) => ({
    id: item.id,
    type: "knowledge" as const,
    title: item.title,
    subtitle: [item.category ?? "Knowledge", item.source ?? item.status ?? "active"].join(" • "),
    preview: snippet(item.content, "No knowledge content yet."),
    href: `/knowledge/${item.id}`,
    updatedAt: item.updated_at
  }));

  return [...events, ...tasks, ...knowledge].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
