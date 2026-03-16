import { notFound } from "next/navigation";
import { FormPageChrome, PersonForm } from "@/components/forms";
import { getPerson } from "@/lib/data";

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) {
    notFound();
  }

  return (
    <FormPageChrome backHref="/people" backLabel="Back to people">
      <PersonForm person={person} />
    </FormPageChrome>
  );
}
