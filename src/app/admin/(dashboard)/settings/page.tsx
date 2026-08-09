import { getSiteSettings } from "@/actions/admin/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">Settings</h2>
        <p className="text-sm text-neutral-500">
          Global site configuration. Changes here affect the whole public website.
        </p>
      </div>
      <SettingsForm
        initial={{
          companyName: settings.companyName,
          shortDescription: settings.shortDescription ?? "",
          email: settings.email ?? "",
          primaryPhone: settings.primaryPhone ?? "",
          phoneTel: settings.phoneTel ?? "",
          secondaryPhone: settings.secondaryPhone ?? "",
          address: settings.address ?? "",
          serviceArea: settings.serviceArea ?? "",
          businessHours: settings.businessHours ?? "",
          instagramUrl: settings.instagramUrl ?? "",
          facebookUrl: settings.facebookUrl ?? "",
          tiktokUrl: settings.tiktokUrl ?? "",
          youtubeUrl: settings.youtubeUrl ?? "",
          headerLogo: settings.headerLogo ?? "",
          footerLogo: settings.footerLogo ?? "",
          favicon: settings.favicon ?? "",
          headerCtaLabel: settings.headerCtaLabel ?? "",
          headerCtaLink: settings.headerCtaLink ?? "",
          footerCtaLabel: settings.footerCtaLabel ?? "",
          footerCtaLink: settings.footerCtaLink ?? "",
          bookingMessage: settings.bookingMessage ?? "",
          defaultSeoTitle: settings.defaultSeoTitle ?? "",
          defaultSeoDescription: settings.defaultSeoDescription ?? "",
          googleMapsUrl: settings.googleMapsUrl ?? "",
          copyright: settings.copyright ?? "",
          timelineDisclaimer: settings.timelineDisclaimer ?? "",
          offerDisclaimer: settings.offerDisclaimer ?? "",
        }}
      />
    </div>
  );
}
