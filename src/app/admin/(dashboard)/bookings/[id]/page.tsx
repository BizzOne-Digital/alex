import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBooking } from "@/actions/admin/bookings";
import { BookingDetail } from "@/components/admin/BookingDetail";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/admin/bookings" className="mb-2 inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Bookings
        </Link>
        <h2 className="font-heading text-xl text-neutral-100">Booking Details</h2>
      </div>

      <BookingDetail
        booking={{
          _id: booking._id,
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
          phone: booking.phone,
          address: booking.address ?? "",
          city: booking.city ?? "",
          province: booking.province ?? "",
          postalCode: booking.postalCode ?? "",
          serviceName: booking.serviceName ?? "",
          preferredDate: booking.preferredDate ?? "",
          preferredTime: booking.preferredTime ?? "",
          alternateDate: booking.alternateDate ?? "",
          alternateTime: booking.alternateTime ?? "",
          propertyType: booking.propertyType ?? "",
          projectDetails: booking.projectDetails ?? "",
          message: booking.message ?? "",
          uploadedImages: booking.uploadedImages ?? [],
          status: booking.status,
          internalNotes: booking.internalNotes ?? "",
          confirmedDate: booking.confirmedDate ?? "",
          confirmedTime: booking.confirmedTime ?? "",
          createdAt: booking.createdAt,
        }}
      />
    </div>
  );
}
