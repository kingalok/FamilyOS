export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Person {
  id: string;
  full_name: string;
  role: string | null;
  relationship: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string | null;
  event_start: string | null;
  event_end: string | null;
  location: string | null;
  owner_person_id: string | null;
  tags: string[] | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
  owner?: Pick<Person, "id" | "full_name"> | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string | null;
  priority: string | null;
  due_at: string | null;
  owner_person_id: string | null;
  related_event_id: string | null;
  tags: string[] | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
  owner?: Pick<Person, "id" | "full_name"> | null;
  related_event?: Pick<Event, "id" | "title"> | null;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string | null;
  category: string | null;
  status: string | null;
  source: string | null;
  owner_person_id: string | null;
  tags: string[] | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
  owner?: Pick<Person, "id" | "full_name"> | null;
}

export interface DashboardData {
  peopleCount: number;
  upcomingEvents: Event[];
  openTasks: Task[];
  overdueTasks: Task[];
  recentKnowledgeItems: KnowledgeItem[];
}

export type SearchResultType = "event" | "task" | "knowledge";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  preview: string;
  href: string;
  updatedAt: string;
}
