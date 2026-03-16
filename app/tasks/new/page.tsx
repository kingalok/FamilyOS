import { FormPageChrome, TaskForm } from "@/components/forms";
import { getEvents, getPeople } from "@/lib/data";

export default async function NewTaskPage() {
  const [people, events] = await Promise.all([getPeople(), getEvents()]);

  return (
    <FormPageChrome backHref="/tasks" backLabel="Back to tasks">
      <TaskForm people={people} events={events} />
    </FormPageChrome>
  );
}
