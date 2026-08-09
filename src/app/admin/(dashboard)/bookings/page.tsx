import { listBookings } from "@/actions/admin/bookings";
import { BookingsTable } from "@/components/admin/BookingsTable";

export default async function AdminBookingsPage() {
  const bookings = await listBookings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">Bookings</h2>
        <p className="text-sm text-neutral-500">Consultation requests submitted from the booking form.</p>
      </div>
      <BookingsTable
        initialRows={bookings.map((b) => ({
          _id: b._id,
          firstName: b.firstName,
          lastName: b.lastName,
          email: b.email,
          phone: b.phone,
          serviceName: b.serviceName ?? "",
          preferredDate: b.preferredDate ?? "",
          status: b.status,
          createdAt: b.createdAt,
        }))}
      />
    </div>
  );
}
