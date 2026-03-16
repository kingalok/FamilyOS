import { FormPageChrome, KnowledgeForm } from "@/components/forms";
import { getPeople } from "@/lib/data";

export default async function NewKnowledgePage() {
  const people = await getPeople();

  return (
    <FormPageChrome backHref="/knowledge" backLabel="Back to knowledge">
      <KnowledgeForm people={people} />
    </FormPageChrome>
  );
}
