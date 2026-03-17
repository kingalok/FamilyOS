"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getField(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

function getRedirectTarget(formData: FormData) {
  const redirectTo = getField(formData, "redirectTo");
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/";
  }

  return redirectTo;
}

export async function signInWithPassword(formData: FormData) {
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const redirectTo = getRedirectTarget(formData);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent("Invalid email or password.")}&redirectTo=${encodeURIComponent(redirectTo)}`
    );
  }

  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
