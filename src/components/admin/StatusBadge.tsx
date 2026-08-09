import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  label: string;
  tone?: "green" | "grey" | "red" | "amber" | "blue";
  className?: string;
};

const tones: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  green: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/30",
  grey: "bg-neutral-700/40 text-neutral-300 ring-1 ring-inset ring-neutral-600/40",
  red: "bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/30",
  amber: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/30",
  blue: "bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/30",
};

export function StatusBadge({ label, tone = "grey", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export function PublishedBadge({ published }: { published: boolean }) {
  return published ? (
    <StatusBadge label="Published" tone="green" />
  ) : (
    <StatusBadge label="Draft" tone="grey" />
  );
}

export function ActiveBadge({ active, label = "Active", offLabel = "Inactive" }: { active: boolean; label?: string; offLabel?: string }) {
  return active ? (
    <StatusBadge label={label} tone="green" />
  ) : (
    <StatusBadge label={offLabel} tone="grey" />
  );
}

const BOOKING_TONE: Record<string, StatusBadgeProps["tone"]> = {
  New: "blue",
  Contacted: "amber",
  Confirmed: "green",
  "Reschedule Requested": "amber",
  Completed: "green",
  Cancelled: "red",
};

export function BookingStatusBadge({ status }: { status: string }) {
  return <StatusBadge label={status} tone={BOOKING_TONE[status] ?? "grey"} />;
}

const CONTACT_TONE: Record<string, StatusBadgeProps["tone"]> = {
  New: "blue",
  "In Progress": "amber",
  Resolved: "green",
  Archived: "grey",
  Quoted: "green",
  Closed: "grey",
};

export function InquiryStatusBadge({ status }: { status: string }) {
  return <StatusBadge label={status} tone={CONTACT_TONE[status] ?? "grey"} />;
}
