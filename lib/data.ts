import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardData, Event, KnowledgeItem, Person, Task } from "@/lib/types";

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
