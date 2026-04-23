// components/dashboard/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Calendar,
  Radio,
  Sparkles,
  BarChart3,
  PenLine,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/dashboard/predykcje-ai", label: "Predykcje AI", icon: Sparkles, badge: "5/dzień" },
  { href: "/dashboard/mecze", label: "Mecze", icon: Calendar },
  { href: "/dashboard/live", label: "Na żywo", icon: Radio },
  { href: "/dashboard/predykcje", label: "Predykcje", icon: TrendingUp },
  { href: "/dashboard/analiza", label: "Nowa analiza", icon: PenLine },
  { href: "/dashboard/statystyki", label: "Statystyki", icon: BarChart3 },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="hidden lg:flex lg:flex-col w-60 h-screen sticky top-0 border-r border-border/40 bg-card/30 backdrop-blur">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border/40">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-xl font-black tracking-tight text-primary group-hover:opacity-80 transition">
            Predictio
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60 ml-1 mt-2 animate-pulse" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground px-3 py-2">
          Nawigacja
        </div>
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
              )}
              <Icon className={cn("w-4 h-4 shrink-0", active && "text-primary")} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/20">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-border/40 p-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-background font-bold text-sm shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate">{userEmail}</div>
            <div className="text-[10px] text-muted-foreground">Free plan</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Wyloguj
        </button>
      </div>
    </aside>
  );
}
