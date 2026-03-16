import { FormPageChrome, PersonForm } from "@/components/forms";

export default function NewPersonPage() {
  return (
    <FormPageChrome backHref="/people" backLabel="Back to people">
      <PersonForm />
    </FormPageChrome>
  );
}
