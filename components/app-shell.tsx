import type { Route } from "next";
import Link from "next/link";
import { CalendarDays, ClipboardList, Home, NotebookPen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/" as Route, label: "Dashboard", icon: Home },
  { href: "/people" as Route, label: "People", icon: Users },
  { href: "/events" as Route, label: "Events", icon: CalendarDays },
  { href: "/tasks" as Route, label: "Tasks", icon: ClipboardList },
  { href: "/knowledge" as Route, label: "Knowledge", icon: NotebookPen }
];

export function AppShell({
  children,
  pathname
}: {
  children: React.ReactNode;
  pathname: string;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
        <aside className="w-full rounded-[2rem] border border-white/70 bg-sand/90 p-5 shadow-panel backdrop-blur lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.28em] text-pine/70">FamilyOS</p>
            <h1 className="mt-2 text-3xl font-semibold">One database, two doors.</h1>
            <p className="mt-3 text-sm leading-6 text-ink/70">
              A calm operating system for family plans, tasks, and shared knowledge.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink/70",
                    active
                      ? "bg-pine text-white shadow-lg shadow-pine/15"
                      : "hover:bg-white hover:text-ink"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-clay/70 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-pine/60">Myworld</p>
            <p className="mt-2 text-sm text-ink/75">
              Shared Supabase workspace for the FamilyOS web app and Python agent layer.
            </p>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
