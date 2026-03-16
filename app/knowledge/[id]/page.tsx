import { notFound } from "next/navigation";
import { FormPageChrome, KnowledgeForm } from "@/components/forms";
import { getKnowledgeItem, getPeople } from "@/lib/data";

export default async function EditKnowledgePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, people] = await Promise.all([getKnowledgeItem(id), getPeople()]);

  if (!item) {
    notFound();
  }

  return (
    <FormPageChrome backHref="/knowledge" backLabel="Back to knowledge">
      <KnowledgeForm item={item} people={people} />
    </FormPageChrome>
  );
}
