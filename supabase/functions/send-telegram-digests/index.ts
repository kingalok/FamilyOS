import { createClient } from "npm:@supabase/supabase-js@2";

type DigestType = "daily" | "weekly" | "monthly";

type DigestWindow = {
  digest_type: DigestType;
  period_start: string;
  period_end: string;
};

type DigestTask = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  priority: string;
  due_at: string | null;
};

type DigestEvent = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  event_start: string | null;
  event_end: string | null;
  location: string | null;
};

type NotificationLogRow = {
  id: string;
  status: "pending" | "sent" | "failed" | "skipped";
};

type RequestPayload = {
  force?: boolean;
  runAt?: string;
  digestTypes?: DigestType[];
};

const BUSINESS_TIMEZONE = "Europe/London";
const DIGEST_HOUR = 7;

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

if (!telegramBotToken || !telegramChatId) {
  throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function getLondonTimeParts(now: Date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "long",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number(value("year")),
    month: Number(value("month")),
    day: Number(value("day")),
    hour: Number(value("hour")),
    minute: Number(value("minute")),
    weekday: value("weekday"),
    formatted: formatter.format(now),
  };
}

function getDueDigests(now: Date, force = false): DigestType[] {
  const london = getLondonTimeParts(now);
  if (!force && london.hour !== DIGEST_HOUR) {
    return [];
  }

  const dueDigests: DigestType[] = ["daily"];

  if (london.weekday === "Saturday") {
    dueDigests.push("weekly");
  }

  if (london.day === 1) {
    dueDigests.push("monthly");
  }

  return dueDigests;
}

function normalizeDigestTypes(input: unknown): DigestType[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const allowed = new Set<DigestType>(["daily", "weekly", "monthly"]);
  const normalized = input.filter(
    (value): value is DigestType => typeof value === "string" && allowed.has(value as DigestType),
  );

  return Array.from(new Set(normalized));
}

async function getDigestWindow(digestType: DigestType, runAtIso: string): Promise<DigestWindow> {
  const functionName = `${digestType}_digest_window`;
  const { data, error } = await supabase.rpc(functionName, {
    p_run_at: runAtIso,
    p_timezone: BUSINESS_TIMEZONE,
  });

  if (error) {
    throw new Error(`Failed to get ${digestType} window: ${error.message}`);
  }

  const row = data?.[0];
  if (!row) {
    throw new Error(`No ${digestType} window returned.`);
  }

  return row as DigestWindow;
}

async function getDigestTasks(window: DigestWindow): Promise<DigestTask[]> {
  const { data, error } = await supabase.rpc("digest_tasks_in_window", {
    p_period_start: window.period_start,
    p_period_end: window.period_end,
  });

  if (error) {
    throw new Error(`Failed to fetch tasks for ${window.digest_type}: ${error.message}`);
  }

  return (data ?? []) as DigestTask[];
}

async function getDigestEvents(window: DigestWindow): Promise<DigestEvent[]> {
  const { data, error } = await supabase.rpc("digest_events_in_window", {
    p_period_start: window.period_start,
    p_period_end: window.period_end,
  });

  if (error) {
    throw new Error(`Failed to fetch events for ${window.digest_type}: ${error.message}`);
  }

  return (data ?? []) as DigestEvent[];
}

function formatUtcAsLondon(value?: string | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TIMEZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function digestHeading(digestType: DigestType, window: DigestWindow) {
  const start = formatUtcAsLondon(window.period_start);
  const end = formatUtcAsLondon(window.period_end);

  if (digestType === "daily") {
    return `FamilyOS daily digest\nFor tomorrow\n${start} -> ${end}`;
  }

  if (digestType === "weekly") {
    return `FamilyOS weekly digest\nSaturday to Friday\n${start} -> ${end}`;
  }

  return `FamilyOS monthly digest\nThis month\n${start} -> ${end}`;
}

function formatTaskLine(task: DigestTask) {
  const due = formatUtcAsLondon(task.due_at);
  const bits = [due, task.priority, task.status].filter(Boolean).join(" | ");
  return `- ${task.title} (${bits})`;
}

function formatEventLine(event: DigestEvent) {
  const when = formatUtcAsLondon(event.event_start);
  const location = event.location ? ` @ ${event.location}` : "";
  return `- ${event.title} (${when})${location}`;
}

function formatDigestMessage(
  digestType: DigestType,
  window: DigestWindow,
  tasks: DigestTask[],
  events: DigestEvent[],
) {
  const lines: string[] = [digestHeading(digestType, window), ""];

  if (events.length > 0) {
    lines.push(`Events (${events.length})`);
    lines.push(...events.slice(0, 20).map(formatEventLine));
    lines.push("");
  }

  if (tasks.length > 0) {
    lines.push(`Tasks (${tasks.length})`);
    lines.push(...tasks.slice(0, 20).map(formatTaskLine));
    lines.push("");
  }

  if (events.length === 0 && tasks.length === 0) {
    lines.push("No upcoming tasks or events for this digest window.");
  }

  if (events.length > 20 || tasks.length > 20) {
    lines.push("Some items were omitted to keep the Telegram message concise.");
  }

  return lines.join("\n").trim();
}

async function findExistingDigest(window: DigestWindow) {
  const { data, error } = await supabase
    .from("notification_log")
    .select("id, status")
    .eq("provider", "telegram")
    .eq("recipient_key", telegramChatId!)
    .eq("digest_type", window.digest_type)
    .eq("period_start", window.period_start)
    .eq("period_end", window.period_end)
    .in("status", ["pending", "sent", "skipped"])
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check notification log: ${error.message}`);
  }

  return data as NotificationLogRow | null;
}

async function createLogRow(
  window: DigestWindow,
  status: NotificationLogRow["status"],
  metadata: Record<string, unknown> = {},
  errorMessage?: string,
) {
  const payload = {
    provider: "telegram",
    recipient_key: telegramChatId!,
    digest_type: window.digest_type,
    period_start: window.period_start,
    period_end: window.period_end,
    status,
    sent_at: status === "sent" ? new Date().toISOString() : null,
    error_message: errorMessage ?? null,
    metadata,
  };

  const { data, error } = await supabase
    .from("notification_log")
    .insert(payload)
    .select("id, status")
    .single();

  if (error) {
    throw new Error(`Failed to create notification log row: ${error.message}`);
  }

  return data as NotificationLogRow;
}

async function updateLogRow(
  id: string,
  status: NotificationLogRow["status"],
  metadata: Record<string, unknown> = {},
  errorMessage?: string,
) {
  const { error } = await supabase
    .from("notification_log")
    .update({
      status,
      sent_at: status === "sent" ? new Date().toISOString() : null,
      metadata,
      error_message: errorMessage ?? null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update notification log row: ${error.message}`);
  }
}

async function sendTelegramMessage(text: string) {
  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram send failed: ${response.status} ${errorText}`);
  }
}

async function processDigest(digestType: DigestType, now: Date) {
  const window = await getDigestWindow(digestType, now.toISOString());
  const existing = await findExistingDigest(window);
  if (existing) {
    return {
      digestType,
      status: "duplicate_skipped",
      reason: `Existing ${existing.status} log found for this period.`,
      window,
    };
  }

  const logRow = await createLogRow(window, "pending", { source: "edge_function" });

  try {
    const [tasks, events] = await Promise.all([getDigestTasks(window), getDigestEvents(window)]);
    if (tasks.length === 0 && events.length === 0) {
      await updateLogRow(logRow.id, "skipped", {
        source: "edge_function",
        reason: "no_items",
      });

      return {
        digestType,
        status: "skipped",
        reason: "No tasks or events in the digest window.",
        window,
      };
    }

    const message = formatDigestMessage(digestType, window, tasks, events);
    await sendTelegramMessage(message);

    await updateLogRow(logRow.id, "sent", {
      source: "edge_function",
      task_count: tasks.length,
      event_count: events.length,
      telegram_chat_id: telegramChatId,
    });

    return {
      digestType,
      status: "sent",
      taskCount: tasks.length,
      eventCount: events.length,
      window,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await updateLogRow(logRow.id, "failed", { source: "edge_function" }, message);
    throw error;
  }
}

Deno.serve(async (request) => {
  try {
    const body: RequestPayload =
      request.method === "POST" ? await request.json().catch(() => ({} as RequestPayload)) : {};
    const force = Boolean(body.force);
    const requestedDigestTypes = normalizeDigestTypes(body.digestTypes);
    const runAt = typeof body.runAt === "string" ? new Date(body.runAt) : new Date();

    if (Number.isNaN(runAt.getTime())) {
      return Response.json({ error: "Invalid runAt value." }, { status: 400 });
    }

    const london = getLondonTimeParts(runAt);
    const dueDigests =
      force && requestedDigestTypes.length > 0
        ? requestedDigestTypes
        : getDueDigests(runAt, force);

    if (dueDigests.length === 0) {
      return Response.json({
        status: "noop",
        message: "No digests are due at this London-local time.",
        londonTime: london.formatted,
        requestedDigestTypes,
      });
    }

    const results = [];
    for (const digestType of dueDigests) {
      results.push(await processDigest(digestType, runAt));
    }

    return Response.json({
      status: "ok",
      londonTime: london.formatted,
      force,
      requestedDigestTypes,
      dueDigests,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
});
