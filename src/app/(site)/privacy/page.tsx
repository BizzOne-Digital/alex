import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Privacy",
  description: "Privacy information for Ikasa Renovations.",
};

export default function PrivacyPage() {
  return (
    <section className="bg-ikasa-warm-white pt-[calc(var(--header-height)+3rem)] pb-20">
      <Container narrow className="space-y-6">
        <p className="font-label text-[0.72rem] tracking-[0.22em] text-ikasa-red">
          Legal
        </p>
        <h1 className="font-heading text-4xl tracking-tight text-ikasa-black">
          Privacy
        </h1>
        <p className="leading-relaxed text-ikasa-medium-grey">
          This is a privacy policy stub. Full privacy practices and data-handling
          details will be published here. For questions, contact us through the
          website contact page or by email.
        </p>
      </Container>
    </section>
  );
}
