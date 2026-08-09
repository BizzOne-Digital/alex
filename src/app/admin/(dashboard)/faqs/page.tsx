import { listFaqs } from "@/actions/admin/faqs";
import { FaqsManager } from "@/components/admin/FaqsManager";

export default async function AdminFaqsPage() {
  const faqs = await listFaqs();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl text-neutral-100">FAQs</h2>
        <p className="text-sm text-neutral-500">Manage frequently asked questions shown on the public site.</p>
      </div>
      <FaqsManager
        initialRows={faqs.map((f) => ({
          _id: f._id,
          question: f.question,
          answer: f.answer,
          category: f.category ?? "general",
          published: f.published,
        }))}
      />
    </div>
  );
}
