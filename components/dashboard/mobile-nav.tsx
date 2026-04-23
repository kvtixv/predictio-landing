// components/dashboard/mobile-nav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Menu,
  X,
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

export function MobileNav({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 h-14 bg-background/90 backdrop-blur border-b border-border/40 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-lg font-black tracking-tight text-primary">Predictio</span>
        </Link>
        <button onClick={() => setOpen(true)} className="p-2 -mr-2">
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur">
          <div className="h-14 flex items-center justify-between px-4 border-b border-border/40">
            <span className="text-lg font-black tracking-tight text-primary">Predictio</span>
            <button onClick={() => setOpen(false)} className="p-2 -mr-2">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent/40"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/15 text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="border-t border-border/40 my-4" />
            <div className="px-4 py-2 text-xs text-muted-foreground">{userEmail}</div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:bg-accent/40"
            >
              <LogOut className="w-4 h-4" />
              Wyloguj
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
