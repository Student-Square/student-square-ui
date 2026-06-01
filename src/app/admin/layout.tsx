"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectAuthStatus,
  selectCurrentUser,
  selectUserRole,
} from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  HandCoins,
  Home,
  LayoutGrid,
  LogOut,
  Newspaper,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const ADMIN_ROLES = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useSelector(selectAuthStatus);
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (status === "authenticated" && role && !ADMIN_ROLES.has(role)) {
      router.replace("/");
    }
  }, [status, role, router, pathname]);

  if (status === "idle" || status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking permissions…</p>
      </main>
    );
  }

  if (status === "unauthenticated" || !role || !ADMIN_ROLES.has(role)) {
    return null;
  }

  const isEditor = role === "EDITOR";

  return (
    <main className="min-h-screen bg-background flex">
      {/* Sidebar — sticky so profile widget never scrolls away */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border bg-card/40 flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/ss-logo.png"
              alt="Student Square"
              width={140}
              height={38}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 text-sm overflow-y-auto">

          <NavItem href="/admin" label="Overview" icon={<Home className="h-4 w-4" />} exact />

          {/* ── CONTENT ── */}
          <NavSection label="Content" />
          <NavItem href="/admin/hero" label="Hero Cards" icon={<LayoutGrid className="h-4 w-4" />} />
          <NavGroup
            label="About Us"
            icon={<FileText className="h-4 w-4" />}
            items={[
              { href: "/admin/pages/about-mission-vision", label: "Our Mission & Vision" },
              { href: "/admin/pages/about-who-we-are", label: "Who We Are" },
            ]}
          />
          <NavGroup
            label="Blog"
            icon={<Newspaper className="h-4 w-4" />}
            items={[
              { href: "/admin/blog/education-career", label: "Education & Career" },
              { href: "/admin/blog/articles", label: "Articles" },
              { href: "/admin/blog/real-life-stories", label: "Real Life Stories" },
              { href: "/admin/blog/magazine", label: "Magazine" },
              { href: "/admin/blog/categories", label: "Categories" },
            ]}
          />

          {/* ── MANAGEMENT ── */}
          <NavSection label="Management" />
          <NavItem href="/admin/donation" label="Donation" icon={<HandCoins className="h-4 w-4" />} />
          <NavItem href="/admin/team" label="Team" icon={<ShieldCheck className="h-4 w-4" />} />
          {!isEditor && (
            <NavItem href="/admin/users" label="Users" icon={<Users className="h-4 w-4" />} />
          )}

          {/* ── MY ACCOUNT ── */}
          <NavSection label="My Account" />
          <NavGroup
            label="My Activities"
            icon={<Activity className="h-4 w-4" />}
            items={[
              { href: "/admin/activities/my-blog", label: "My Blog" },
              { href: "/admin/activities/comments", label: "Comments" },
              { href: "/admin/activities/saved", label: "Saved Articles" },
            ]}
          />
          <NavItem href="/admin/profile" label="My Profile" icon={<UserCircle className="h-4 w-4" />} />
        </nav>

        {/* Bottom profile widget */}
        {user && <SidebarProfile user={user} role={role} onLogout={() => logout()} />}
      </aside>

      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden border-b border-border bg-card/60 backdrop-blur px-4 py-3 flex items-center gap-2">
          <Image src="/images/ss-logo.png" alt="Student Square" width={100} height={28} className="h-7 w-auto" />
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <Link href="/admin/hero" className="text-xs text-muted-foreground hover:text-emerald-600">
            Hero Cards
          </Link>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">{children}</div>
      </div>
    </main>
  );
}

function SidebarProfile({
  user,
  role,
  onLogout,
}: {
  user: { fullName: string; email: string; profile: { avatarUrl: string | null } | null };
  role: string;
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

  return (
    <div ref={ref} className="border-t border-border p-3 relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-muted transition-colors group"
      >
        <div className="h-8 w-8 rounded-full bg-muted overflow-hidden shrink-0 ring-2 ring-border group-hover:ring-emerald-500/50 transition-all">
          {user.profile?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.profile.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
          ) : (
            <span className="h-full w-full flex items-center justify-center text-xs font-bold text-muted-foreground bg-muted">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-semibold text-foreground truncate">{user.fullName}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{role.replace("_", " ")}</p>
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
                href="/admin/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                Profile settings
              </Link>
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

function NavSection({ label }: { label: string }) {
  return (
    <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
      {label}
    </p>
  );
}

function NavItem({
  href,
  label,
  icon,
  exact = false,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : "text-foreground hover:bg-muted hover:text-emerald-600"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function NavGroup({
  label,
  icon,
  items,
}: {
  label: string;
  icon: React.ReactNode;
  items: Array<{ href: string; label: string }>;
}) {
  const pathname = usePathname();
  const containsActive = items.some(
    (i) => pathname === i.href || pathname.startsWith(i.href + "/")
  );
  const [open, setOpen] = useState(containsActive);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          containsActive
            ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
            : "text-foreground hover:bg-muted hover:text-emerald-600"
        }`}
      >
        {icon}
        <span className="font-medium flex-1 text-left">{label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-0.5 ml-5 border-l border-border pl-2 space-y-0.5">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${
                  active
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-muted-foreground hover:text-emerald-600 hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
