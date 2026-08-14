"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectAuthStatus,
  selectCurrentUser,
  selectUserRole,
} from "@/redux/features/auth/authSlice";
import { PANEL_ROLES, roleHome } from "@/lib/auth-routing";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import {
  BookOpen,
  CalendarClock,
  CalendarPlus,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import NotificationBell from "@/components/notifications/NotificationBell";

/**
 * The single care panel — SRS §2.5.2, and the standing decision in the
 * implementation plan that counsellor and mentor are *nav variants of one
 * shell*, not two route trees.
 *
 * Everything role-specific on this screen is one line in NAV below. When
 * editor, moderator and author panels land in Phase 6 they belong here too,
 * with their own `roles` entries — not in a fifth copy of this file.
 */

type PanelRole = "SYSTEM_ADMIN" | "SUPER_ADMIN" | "ADMIN" | "COUNSELLOR" | "MENTOR";

const NAV: {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  roles?: PanelRole[];
}[] = [
  {
    href: "/panel",
    label: "Overview",
    icon: <LayoutDashboard className="h-4 w-4" />,
    exact: true,
  },
  {
    href: "/panel/caseload",
    label: "My Students",
    icon: <Users className="h-4 w-4" />,
  },
  {
    href: "/panel/sessions",
    label: "Sessions",
    icon: <CalendarClock className="h-4 w-4" />,
  },
  {
    href: "/panel/messages",
    label: "Messages",
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    href: "/panel/availability",
    label: "My Availability",
    icon: <CalendarPlus className="h-4 w-4" />,
    roles: ["COUNSELLOR", "MENTOR"],
  },
  {
    href: "/panel/operations",
    label: "Daily Task Book",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    href: "/panel/finance",
    label: "Financial Work Book",
    icon: <Wallet className="h-4 w-4" />,
  },
  {
    href: "/panel/settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useSelector(selectAuthStatus);
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);
  const [logout] = useLogoutMutation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (status === "authenticated" && role && !PANEL_ROLES.has(role)) {
      router.replace(roleHome(role));
    }
  }, [status, role, pathname, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (status === "idle" || status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (status === "unauthenticated") return null;
  if (role && !PANEL_ROLES.has(role)) return null;

  const items = NAV.filter(
    (item) => !item.roles || (role && item.roles.includes(role as PanelRole))
  );

  const sidebar = (
    <SidebarContent items={items} user={user} role={role} onLogout={() => logout()} />
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border bg-card/40 flex-col h-screen sticky top-0">
        {sidebar}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-60 border-r border-border bg-card flex flex-col md:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute top-2.5 right-2.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden -ml-1.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="md:hidden flex items-center gap-3 min-w-0">
            <Image
              src="/images/ss-logo.png"
              alt="Student Square"
              width={100}
              height={28}
              className="h-7 w-auto"
            />
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs font-semibold text-muted-foreground truncate">Care Panel</span>
          </div>
          <div className="hidden md:block text-sm font-semibold text-foreground">Care Panel</div>
          <div className="ml-auto">
            <NotificationBell />
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full">{children}</div>
      </div>
    </div>
  );
}

function SidebarContent({
  items,
  user,
  role,
  onLogout,
}: {
  items: typeof NAV;
  user: { fullName: string; email: string; profile: { avatarUrl: string | null } | null } | null;
  role: string | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className="px-4 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/ss-logo.png"
            alt="Student Square"
            width={140}
            height={38}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="mt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">
            {role ? role.replace("_", " ") : "Care"} Panel
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 text-sm overflow-y-auto">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors group ${
                active
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-foreground hover:bg-muted hover:text-emerald-600"
              }`}
            >
              <span
                className={
                  active
                    ? "text-white"
                    : "text-muted-foreground group-hover:text-emerald-600 transition-colors"
                }
              >
                {item.icon}
              </span>
              <span className="font-medium flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border">
              {user.profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profile.avatarUrl}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="h-full w-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {user.fullName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="mt-1 w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </>
  );
}
