import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-clay/70 bg-white px-4 py-2 text-sm font-medium text-ink/75 hover:border-pine hover:text-pine"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </form>
  );
}
