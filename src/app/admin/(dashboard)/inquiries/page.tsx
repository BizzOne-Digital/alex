import { listInquiries } from "@/actions/admin/inquiries";
import { InquiriesManager } from "@/components/admin/InquiriesManager";

export default async function AdminInquiriesPage() {
  const contacts = await listInquiries();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">Inquiries</h2>
        <p className="text-sm text-neutral-500">
          Contact form messages from website visitors.
        </p>
      </div>
      <InquiriesManager
        contactRows={contacts.map((c) => ({
          _id: c._id,
          name: c.name,
          email: c.email,
          phone: c.phone ?? "",
          subject: c.subject ?? "",
          message: c.message,
          status: c.status,
          internalNotes: c.internalNotes ?? "",
          createdAt: c.createdAt,
        }))}
      />
    </div>
  );
}
