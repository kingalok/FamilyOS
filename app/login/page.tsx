import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white/85 p-8 shadow-panel">
          <p className="text-xs uppercase tracking-[0.28em] text-pine/65">FamilyOS</p>
          <h1 className="mt-3 text-4xl font-semibold">Sign in to your family workspace.</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink/65">
            Email and password access for the private FamilyOS dashboard connected to your Supabase
            project.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-sand/90 p-8 shadow-panel">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-ink/65">Use your Supabase email/password account to continue.</p>
          <div className="mt-8">
            <LoginForm error={params.error} />
          </div>
        </div>
      </div>
    </div>
  );
}
