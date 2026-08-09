import type { LucideIcon } from "lucide-react";
import {
  Gauge,
  HelpCircle,
  Images,
  Inbox,
  LayoutTemplate,
  MessageSquareQuote,
  Settings,
  Tag,
  Wrench,
  CalendarClock,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: Gauge },
  { label: "Pages", href: "/admin/pages", icon: LayoutTemplate },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Offers", href: "/admin/offers", icon: Tag },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarClock },
  { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const ADMIN_PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pages": "Pages",
  "/admin/services": "Services",
  "/admin/gallery": "Gallery",
  "/admin/testimonials": "Testimonials",
  "/admin/faqs": "FAQs",
  "/admin/offers": "Offers",
  "/admin/bookings": "Bookings",
  "/admin/inquiries": "Inquiries",
  "/admin/settings": "Settings",
};
