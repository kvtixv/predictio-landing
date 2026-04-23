// app/(protected)/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar userEmail={user.email ?? ""} />
      <div className="flex-1 min-w-0">
        <MobileNav userEmail={user.email ?? ""} />
        <main>{children}</main>
      </div>
    </div>
  );
}
