import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyTitle,
  emptyDescription,
  editHref
}: {
  columns: Column<T>[];
  data: T[];
  emptyTitle: string;
  emptyDescription: string;
  editHref: (item: T) => string;
}) {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-clay/60">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-clay/60 text-left text-sm">
          <thead className="bg-sand/80">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium text-ink/70">
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-ink/70">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-clay/50 bg-white/70">
            {data.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 align-top text-ink/80">
                    {column.render(item)}
                  </td>
                ))}
                <td className="px-4 py-4 align-top">
                  <Link
                    href={editHref(item)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-pine"
                  >
                    Open
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
