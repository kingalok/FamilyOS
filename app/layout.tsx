import type { Metadata } from "next";
import { headers } from "next/headers";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "FamilyOS",
  description: "Private AI-native family operating system built on Supabase."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/";

  return (
    <html lang="en">
      <body>
        <AppShell pathname={pathname}>{children}</AppShell>
      </body>
    </html>
  );
}
