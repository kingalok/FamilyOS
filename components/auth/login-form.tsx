import { LockKeyhole, Mail } from "lucide-react";
import { signInWithPassword } from "@/app/auth/actions";

export function LoginForm({ error }: { error?: string }) {
  return (
    <form action={signInWithPassword} className="space-y-5">
      <div>
        <label htmlFor="email">Email</label>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-clay/70 bg-white/90 px-4 py-3">
          <Mail className="h-4 w-4 text-pine/60" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="border-0 bg-transparent p-0 shadow-none focus:ring-0"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-clay/70 bg-white/90 px-4 py-3">
          <LockKeyhole className="h-4 w-4 text-pine/60" />
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="border-0 bg-transparent p-0 shadow-none focus:ring-0"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-pine px-5 py-3 text-sm font-medium text-white"
      >
        Sign in
      </button>
    </form>
  );
}
