"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectAuthStatus,
  selectCurrentUser,
  selectUserRole,
} from "@/redux/features/auth/authSlice";
import { ADMIN_ROLES } from "@/lib/auth-routing";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  UserCircle,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
    // Admin/editor/moderator roles belong in /admin, not here
    if (status === "authenticated" && role && ADMIN_ROLES.has(role)) {
      router.replace("/admin");
    }
  }, [status, role, pathname, router]);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock background scroll while the mobile drawer is open so the page
  // behind the overlay doesn't move under the user's finger.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [mobileOpen]);

  if (status === "idle" || status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    );
  }

  if (status === "unauthenticated") return null;
  if (role && ADMIN_ROLES.has(role)) return null;

  const sidebar = (
    <SidebarContent
      user={user}
      onLogout={() => logout()}
    />
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border bg-card/40 flex-col h-screen sticky top-0">
        {sidebar}
      </aside>

      {/* Mobile drawer overlay */}
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

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="-ml-1.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Image src="/images/ss-logo.png" alt="Student Square" width={100} height={28} className="h-7 w-auto" />
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">Dashboard</span>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Sidebar content (shared desktop + mobile)
───────────────────────────────────────── */
function SidebarContent({
  user,
  onLogout,
}: {
  user: { fullName: string; email: string; profile: { avatarUrl: string | null } | null } | null;
  onLogout: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/ss-logo.png" alt="Student Square" width={140} height={38} className="h-8 w-auto" priority />
        </Link>
        <div className="mt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 dark:bg-sky-900/30 px-2 py-0.5 rounded-full">
            My Dashboard
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 text-sm overflow-y-auto">
        {/* Overview */}
        <NavItem href="/dashboard" label="Overview" icon={<LayoutDashboard className="h-4 w-4" />} exact />

        {/* Account */}
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Account
          </p>
        </div>

        <NavItem
          href="/dashboard/profile"
          label="My Profile"
          icon={<UserCircle className="h-4 w-4" />}
        />

        {/* Activities group */}
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Activities
          </p>
        </div>

        <NavItem
          href="/dashboard/activities/my-blog"
          label="My Blog"
          icon={<Newspaper className="h-4 w-4" />}
        />
        <NavItem
          href="/dashboard/activities/comments"
          label="Comments"
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <NavItem
          href="/dashboard/activities/saved-articles"
          label="Saved Articles"
          icon={<Bookmark className="h-4 w-4" />}
        />

        {/* Donation */}
        <div className="pt-3 pb-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Support
          </p>
        </div>

        <NavItem
          href="/dashboard/donation"
          label="Donation"
          icon={<Heart className="h-4 w-4" />}
          badge="Soon"
        />
      </nav>

      {/* Profile widget */}
      {user && <SidebarProfile user={user} onLogout={onLogout} />}
    </>
  );
}

/* ────────── NavItem ────────── */
function NavItem({
  href,
  label,
  icon,
  badge,
  exact = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : (pathname === href || pathname.startsWith(href + "/"));

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors group ${
        active
          ? "bg-emerald-600 text-white shadow-sm"
          : "text-foreground hover:bg-muted hover:text-emerald-600"
      }`}
    >
      <span className={active ? "text-white" : "text-muted-foreground group-hover:text-emerald-600 transition-colors"}>
        {icon}
      </span>
      <span className="font-medium flex-1">{label}</span>
      {badge && (
        <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
          active
            ? "bg-white/20 text-white"
            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

/* ────────── Sidebar profile widget ────────── */
function SidebarProfile({
  user,
  onLogout,
}: {
  user: { fullName: string; email: string; profile: { avatarUrl: string | null } | null };
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const initials = user.fullName.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="border-t border-border p-3 relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-muted transition-colors group"
      >
        <div className="h-8 w-8 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border group-hover:ring-emerald-500/40 transition-all">
          {user.profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.profile.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
          ) : (
            <span className="h-full w-full flex items-center justify-center text-xs font-bold text-muted-foreground">
              {initials}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-semibold text-foreground truncate">{user.fullName}</p>
          <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-border bg-card shadow-xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
              <p className="text-xs font-semibold text-foreground truncate">{user.fullName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <div className="p-1">
              <Link
                href="/"
                target="_blank"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                View site
              </Link>
              <button
                type="button"
                onClick={() => { setOpen(false); onLogout(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
