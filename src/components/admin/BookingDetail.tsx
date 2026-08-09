"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Input, Select, Textarea } from "@/components/admin/FormField";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { deleteBooking, updateBooking } from "@/actions/admin/bookings";
import { BOOKING_STATUSES } from "@/lib/admin/constants";
import { formatPhone } from "@/lib/utils";

export type BookingDetailData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  serviceName: string;
  preferredDate: string;
  preferredTime: string;
  alternateDate: string;
  alternateTime: string;
  propertyType: string;
  projectDetails: string;
  message: string;
  uploadedImages: string[];
  status: string;
  internalNotes: string;
  confirmedDate: string;
  confirmedTime: string;
  createdAt: string;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd className="text-sm text-neutral-200">{value}</dd>
    </div>
  );
}

function fmtDate(value: string): string {
  if (!value) return "";
  try {
    return format(new Date(value), "MMM d, yyyy");
  } catch {
    return value;
  }
}

export function BookingDetail({ booking }: { booking: BookingDetailData }) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState(booking.status);
  const [notes, setNotes] = useState(booking.internalNotes);
  const [confirmedDate, setConfirmedDate] = useState(booking.confirmedDate ? booking.confirmedDate.slice(0, 10) : "");
  const [confirmedTime, setConfirmedTime] = useState(booking.confirmedTime);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateBooking(booking._id, {
        status,
        internalNotes: notes,
        confirmedDate: confirmedDate || null,
        confirmedTime,
      });
      toast(result.ok ? "Booking updated" : result.error, result.ok ? "success" : "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const result = await deleteBooking(booking._id);
    if (result.ok) {
      toast("Booking deleted", "success");
      router.push("/admin/bookings");
    } else {
      toast(result.error, "error");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base text-neutral-100">
              {booking.firstName} {booking.lastName}
            </h3>
            <BookingStatusBadge status={status} />
          </div>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoRow label="Email" value={booking.email} />
            <InfoRow label="Phone" value={formatPhone(booking.phone)} />
            <InfoRow label="Property type" value={booking.propertyType} />
            <InfoRow label="Address" value={booking.address} />
            <InfoRow label="City" value={booking.city} />
            <InfoRow label="Province" value={booking.province} />
            <InfoRow label="Postal code" value={booking.postalCode} />
            <InfoRow label="Service requested" value={booking.serviceName} />
            <InfoRow label="Submitted" value={fmtDate(booking.createdAt)} />
            <InfoRow label="Preferred date" value={`${fmtDate(booking.preferredDate)} ${booking.preferredTime}`.trim()} />
            <InfoRow label="Alternate date" value={`${fmtDate(booking.alternateDate)} ${booking.alternateTime}`.trim()} />
          </dl>
        </div>

        {(booking.projectDetails || booking.message) && (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
            <h3 className="mb-3 font-heading text-sm text-neutral-100">Project Details</h3>
            {booking.projectDetails ? <p className="mb-3 whitespace-pre-wrap text-sm text-neutral-300">{booking.projectDetails}</p> : null}
            {booking.message ? <p className="whitespace-pre-wrap text-sm text-neutral-400">{booking.message}</p> : null}
          </div>
        )}

        {booking.uploadedImages.length > 0 && (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
            <h3 className="mb-3 font-heading text-sm text-neutral-100">Uploaded Photos</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {booking.uploadedImages.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="relative block aspect-square overflow-hidden rounded-md bg-neutral-800">
                  <Image src={url} alt={`Upload ${i + 1}`} fill className="object-cover" sizes="150px" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
          <h3 className="font-heading text-sm text-neutral-100">Manage Booking</h3>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={BOOKING_STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Confirmed date" type="date" value={confirmedDate} onChange={(e) => setConfirmedDate(e.target.value)} />
            <Input label="Confirmed time" value={confirmedTime} onChange={(e) => setConfirmedTime(e.target.value)} placeholder="10:00 AM" />
          </div>
          <Textarea label="Internal notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} hint="Only visible to admin staff." />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-red-900/60 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-950/40"
        >
          <Trash2 className="h-4 w-4" />
          Delete booking
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this booking?"
        description="This will permanently remove the booking request. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
