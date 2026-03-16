import { EventForm, FormPageChrome } from "@/components/forms";
import { getPeople } from "@/lib/data";

export default async function NewEventPage() {
  const people = await getPeople();

  return (
    <FormPageChrome backHref="/events" backLabel="Back to events">
      <EventForm people={people} />
    </FormPageChrome>
  );
}
