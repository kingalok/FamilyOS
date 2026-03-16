"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseTags } from "@/lib/utils";

function nullable(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();
  return text ? text : null;
}

function parseMetadata(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Invalid metadata JSON", error);
    return {};
  }
}

function parseDateTime(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();
  return text ? new Date(text).toISOString() : null;
}

export async function upsertPerson(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = nullable(formData.get("id"));

  const payload = {
    full_name: formData.get("full_name")?.toString().trim(),
    role: nullable(formData.get("role")),
    relationship: nullable(formData.get("relationship")),
    email: nullable(formData.get("email")),
    phone: nullable(formData.get("phone")),
    notes: nullable(formData.get("notes")),
    metadata: parseMetadata(formData.get("metadata"))
  };

  const query = id
    ? supabase.from("people").update(payload).eq("id", id)
    : supabase.from("people").insert(payload);

  const { error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/people");
  redirect("/people");
}

export async function upsertEvent(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = nullable(formData.get("id"));

  const payload = {
    title: formData.get("title")?.toString().trim(),
    description: nullable(formData.get("description")),
    category: nullable(formData.get("category")),
    status: nullable(formData.get("status")) ?? "planned",
    event_start: parseDateTime(formData.get("event_start")),
    event_end: parseDateTime(formData.get("event_end")),
    location: nullable(formData.get("location")),
    owner_person_id: nullable(formData.get("owner_person_id")),
    tags: parseTags(formData.get("tags")?.toString() ?? ""),
    metadata: parseMetadata(formData.get("metadata"))
  };

  const query = id
    ? supabase.from("events").update(payload).eq("id", id)
    : supabase.from("events").insert(payload);

  const { error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/tasks");
  redirect("/events");
}

export async function upsertTask(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = nullable(formData.get("id"));

  const payload = {
    title: formData.get("title")?.toString().trim(),
    description: nullable(formData.get("description")),
    category: nullable(formData.get("category")),
    status: nullable(formData.get("status")) ?? "open",
    priority: nullable(formData.get("priority")) ?? "medium",
    due_at: parseDateTime(formData.get("due_at")),
    owner_person_id: nullable(formData.get("owner_person_id")),
    related_event_id: nullable(formData.get("related_event_id")),
    tags: parseTags(formData.get("tags")?.toString() ?? ""),
    metadata: parseMetadata(formData.get("metadata"))
  };

  const query = id
    ? supabase.from("tasks").update(payload).eq("id", id)
    : supabase.from("tasks").insert(payload);

  const { error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function upsertKnowledgeItem(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = nullable(formData.get("id"));

  const payload = {
    title: formData.get("title")?.toString().trim(),
    content: nullable(formData.get("content")),
    category: nullable(formData.get("category")),
    status: nullable(formData.get("status")) ?? "active",
    source: nullable(formData.get("source")),
    owner_person_id: nullable(formData.get("owner_person_id")),
    tags: parseTags(formData.get("tags")?.toString() ?? ""),
    metadata: parseMetadata(formData.get("metadata"))
  };

  const query = id
    ? supabase.from("knowledge_items").update(payload).eq("id", id)
    : supabase.from("knowledge_items").insert(payload);

  const { error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/knowledge");
  redirect("/knowledge");
}
