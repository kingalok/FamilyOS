import { notFound } from "next/navigation";
import { EventForm, FormPageChrome } from "@/components/forms";
import { getEvent, getPeople } from "@/lib/data";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, people] = await Promise.all([getEvent(id), getPeople()]);

  if (!event) {
    notFound();
  }

  return (
    <FormPageChrome backHref="/events" backLabel="Back to events">
      <EventForm event={event} people={people} />
    </FormPageChrome>
  );
}
