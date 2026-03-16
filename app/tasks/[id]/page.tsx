import { notFound } from "next/navigation";
import { FormPageChrome, TaskForm } from "@/components/forms";
import { getEvents, getPeople, getTask } from "@/lib/data";

export default async function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [task, people, events] = await Promise.all([getTask(id), getPeople(), getEvents()]);

  if (!task) {
    notFound();
  }

  return (
    <FormPageChrome backHref="/tasks" backLabel="Back to tasks">
      <TaskForm task={task} people={people} events={events} />
    </FormPageChrome>
  );
}
