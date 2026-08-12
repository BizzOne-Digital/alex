import { SiteShell } from "@/components/layout/SiteShell";
import { getPublishedServices, getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, services] = await Promise.all([
    getSettings(),
    getPublishedServices(),
  ]);

  return (
    <SiteShell settings={settings} services={services}>
      {children}
    </SiteShell>
  );
}
