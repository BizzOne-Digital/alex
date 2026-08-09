/**
 * Plain constant re-exports safe to import from client components.
 * The canonical source of truth lives on each Mongoose model, but those
 * files pull in the `mongoose`/`mongodb` packages (Node-only) which must
 * never end up in a client bundle. Keep these arrays in sync manually.
 */

export const BOOKING_STATUSES = [
  "New",
  "Contacted",
  "Confirmed",
  "Reschedule Requested",
  "Completed",
  "Cancelled",
] as const;

export const CONTACT_STATUSES = ["New", "In Progress", "Resolved", "Archived"] as const;

export const QUOTE_STATUSES = ["New", "Contacted", "Quoted", "Closed", "Archived"] as const;

export const STOCK_STATUSES = [
  "in_stock",
  "low_stock",
  "out_of_stock",
  "made_to_order",
  "discontinued",
] as const;
