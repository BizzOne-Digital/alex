import Link from "next/link";
import {
  CalendarClock,
  ExternalLink,
  FileText,
  HelpCircle,
  Images,
  Inbox,
  LayoutTemplate,
  MessageSquareQuote,
  Plus,
  Tag,
  Wrench,
} from "lucide-react";
import { getDashboardStats } from "@/actions/admin/dashboard";
import { BookingStatusBadge } from "@/components/admin/StatusBadge";
import { formatPhone } from "@/lib/utils";

function StatCard({
  label,
  total,
  detail,
  href,
  icon: Icon,
}: {
  label: string;
  total: number;
  detail?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 transition-colors hover:border-neutral-700 hover:bg-neutral-900"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-red-600/10 text-red-500">
          <Icon className="h-5 w-5" />
        </span>
        <ExternalLink className="h-3.5 w-3.5 text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div>
        <p className="font-heading text-2xl text-neutral-100">{total}</p>
        <p className="text-sm text-neutral-400">{label}</p>
        {detail ? <p className="mt-0.5 text-xs text-neutral-500">{detail}</p> : null}
      </div>
    </Link>
  );
}

const QUICK_ACTIONS = [
  { label: "New Service", href: "/admin/services/new", icon: Wrench },
  { label: "New Offer", href: "/admin/offers", icon: Tag },
  { label: "New FAQ", href: "/admin/faqs", icon: HelpCircle },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl text-neutral-100">Overview</h2>
          <p className="text-sm text-neutral-500">
            Real-time snapshot of your Ikasa Renovations content and leads.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition-colors hover:bg-neutral-900"
        >
          <ExternalLink className="h-4 w-4" />
          Preview website
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pages"
          total={stats.pages.published}
          detail={`${stats.pages.total} configured`}
          href="/admin/pages"
          icon={LayoutTemplate}
        />
        <StatCard
          label="Published Services"
          total={stats.services.published}
          detail={`${stats.services.draft} draft`}
          href="/admin/services"
          icon={Wrench}
        />
        <StatCard
          label="Gallery Projects"
          total={stats.gallery.published}
          detail={`${stats.gallery.draft} draft`}
          href="/admin/gallery"
          icon={Images}
        />
        <StatCard
          label="Published Testimonials"
          total={stats.testimonials.published}
          detail={`${stats.testimonials.draft} draft`}
          href="/admin/testimonials"
          icon={MessageSquareQuote}
        />
        <StatCard
          label="FAQs"
          total={stats.faqs.published}
          detail={`${stats.faqs.draft} draft`}
          href="/admin/faqs"
          icon={HelpCircle}
        />
        <StatCard
          label="Active Offers"
          total={stats.offers.active}
          detail={`${stats.offers.total} total`}
          href="/admin/offers"
          icon={Tag}
        />
        <StatCard
          label="New Bookings"
          total={stats.bookings.new}
          detail={`${stats.bookings.total} total`}
          href="/admin/bookings"
          icon={CalendarClock}
        />
        <StatCard
          label="New Inquiries"
          total={stats.inquiries.new}
          detail={`${stats.inquiries.total} total`}
          href="/admin/inquiries"
          icon={Inbox}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-neutral-800 bg-neutral-900/40">
          <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
            <h3 className="font-heading text-sm text-neutral-100">Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-xs text-red-500 hover:text-red-400">
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-800/80">
            {stats.recentBookings.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-neutral-500">No bookings yet.</p>
            ) : (
              stats.recentBookings.map((booking) => (
                <Link
                  key={booking._id}
                  href={`/admin/bookings/${booking._id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-neutral-900/60"
                >
                  <div>
                    <p className="text-sm text-neutral-200">
                      {booking.firstName} {booking.lastName}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {booking.serviceName || "General inquiry"} · {formatPhone(booking.email)}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
            <h3 className="mb-3 font-heading text-sm text-neutral-100">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex flex-col items-start gap-2 rounded-md border border-neutral-800 p-3 text-xs text-neutral-300 transition-colors hover:border-red-600/40 hover:bg-red-600/5"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-neutral-800 text-neutral-300">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="flex items-center gap-1">
                      <Plus className="h-3 w-3" />
                      {action.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-5">
            <h3 className="mb-3 font-heading text-sm text-neutral-100">Recently Updated</h3>
            {stats.recentlyUpdated.length === 0 ? (
              <p className="text-sm text-neutral-500">Nothing updated yet.</p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {stats.recentlyUpdated.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-2 text-sm text-neutral-300 hover:text-red-400"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      <span className="shrink-0 text-xs text-neutral-500">{item.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
