"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  toolbarExtra?: ReactNode;
  emptyState?: ReactNode;
  rowClassName?: (row: T) => string;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  searchPlaceholder = "Search…",
  searchFilter,
  toolbarExtra,
  emptyState,
  rowClassName,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim() || !searchFilter) return rows;
    return rows.filter((row) => searchFilter(row, query.trim().toLowerCase()));
  }, [rows, query, searchFilter]);

  return (
    <div className="flex flex-col gap-3">
      {(searchFilter || toolbarExtra) && (
        <div className="flex flex-wrap items-center gap-3">
          {searchFilter ? (
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 py-2 pl-9 pr-3 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600/40"
              />
            </div>
          ) : null}
          {toolbarExtra}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 font-label text-[0.68rem] tracking-[0.14em] text-neutral-500",
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-neutral-500">
                  {emptyState ?? "No records found."}
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={getRowId(row)}
                  className={cn("bg-neutral-950/40 transition-colors hover:bg-neutral-900/60", rowClassName?.(row))}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 align-middle text-neutral-200", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral-500">
        {filtered.length} of {rows.length} record{rows.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
