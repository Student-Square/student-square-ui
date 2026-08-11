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
import ThemeToggle from "@/components/common/ThemeToggle";
import NotificationBell from "@/components/notifications/NotificationBell";
import {
  Activity,
  BarChart3,
  Briefcase,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileCode2,
  FileText,
  FlagTriangleRight,
  HandCoins,
  Home,
  LayoutGrid,
  Library,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareText,
  Newspaper,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ADMIN_ROLES } from "@/lib/auth-routing";
import type { UserRole } from "@/types/auth";

/**
 * One admin shell for every non-care staff role — each role just sees a
 * different slice of NAV below (see auth-routing.ts for why). Add a new
 * `roles` list to gate an item/group instead of forking this file.
 */
type NavItem = {
  kind: "item";
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  roles?: UserRole[];
};
type NavGroupEntry = {
  kind: "group";
  label: string;
  icon: React.ReactNode;
  items: Array<{ href: string; label: string; roles?: UserRole[] }>;
  roles?: UserRole[];
};
type NavSectionEntry = { kind: "section"; label: string; roles?: UserRole[] };
type NavEntry = NavItem | NavGroupEntry | NavSectionEntry;

const CONTENT_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "MODERATOR"];
const EDIT_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
const AUTHOR_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"];
const MOD_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "MODERATOR"];
const TOP_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
const HR_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "HR_MANAGER"];

const NAV: NavEntry[] = [
  { kind: "item", href: "/admin", label: "Overview", icon: <Home className="h-4 w-4" />, exact: true },

  { kind: "section", label: "Content", roles: CONTENT_ROLES },
  { kind: "item", href: "/admin/hero", label: "Hero Cards", icon: <LayoutGrid className="h-4 w-4" />, roles: EDIT_ROLES },
  {
    kind: "group",
    label: "About Us",
    icon: <FileText className="h-4 w-4" />,
    roles: EDIT_ROLES,
    items: [
      { href: "/admin/pages/about-mission-vision", label: "Our Mission & Vision" },
      { href: "/admin/pages/about-who-we-are", label: "Who We Are" },
    ],
  },
  {
    kind: "group",
    label: "Blog",
    icon: <Newspaper className="h-4 w-4" />,
    roles: CONTENT_ROLES,
    items: [
      { href: "/admin/blog/education-career", label: "Education & Career", roles: AUTHOR_ROLES },
      { href: "/admin/blog/articles", label: "Articles", roles: AUTHOR_ROLES },
      { href: "/admin/blog/real-life-stories", label: "Real Life Stories", roles: [...AUTHOR_ROLES, "MODERATOR"] },
      { href: "/admin/blog/magazine", label: "Magazine", roles: EDIT_ROLES },
      { href: "/admin/blog/events", label: "Events", roles: EDIT_ROLES },
      { href: "/admin/blog/categories", label: "Categories", roles: EDIT_ROLES },
    ],
  },

  { kind: "section", label: "Moderation", roles: MOD_ROLES },
  { kind: "item", href: "/admin/moderation", label: "Moderation Queue", icon: <FlagTriangleRight className="h-4 w-4" />, roles: MOD_ROLES },

  { kind: "section", label: "Management", roles: EDIT_ROLES },
  { kind: "item", href: "/admin/donation", label: "Donation", icon: <HandCoins className="h-4 w-4" />, roles: EDIT_ROLES },
  { kind: "item", href: "/admin/operations", label: "Operations (DOB)", icon: <BookOpen className="h-4 w-4" />, roles: EDIT_ROLES },
  { kind: "item", href: "/admin/finance", label: "Financial Work Book", icon: <Wallet className="h-4 w-4" />, roles: EDIT_ROLES },
  { kind: "item", href: "/admin/books", label: "All Books", icon: <Library className="h-4 w-4" />, roles: EDIT_ROLES },
  { kind: "item", href: "/admin/team", label: "Team", icon: <ShieldCheck className="h-4 w-4" />, roles: EDIT_ROLES },
  { kind: "item", href: "/admin/resources", label: "Resources", icon: <Library className="h-4 w-4" />, roles: EDIT_ROLES },
  { kind: "item", href: "/admin/feedback", label: "Feedback", icon: <MessageSquareText className="h-4 w-4" />, roles: EDIT_ROLES },
  { kind: "item", href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" />, roles: EDIT_ROLES },
  { kind: "item", href: "/admin/assessments", label: "Assessments", icon: <ClipboardList className="h-4 w-4" />, roles: TOP_ROLES },
  { kind: "item", href: "/admin/members", label: "Members", icon: <Users className="h-4 w-4" />, roles: TOP_ROLES },
  { kind: "item", href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" />, roles: TOP_ROLES },

  { kind: "section", label: "Communications", roles: TOP_ROLES },
  { kind: "item", href: "/admin/campaigns", label: "Bulk Messages", icon: <Megaphone className="h-4 w-4" />, roles: TOP_ROLES },
  { kind: "item", href: "/admin/templates", label: "Email Templates", icon: <FileCode2 className="h-4 w-4" />, roles: TOP_ROLES },

  { kind: "section", label: "Recruitment", roles: HR_ROLES },
  { kind: "item", href: "/admin/recruitment", label: "Candidates", icon: <Briefcase className="h-4 w-4" />, roles: HR_ROLES },

  { kind: "section", label: "My Account" },
  {
    kind: "group",
    label: "My Activities",
    icon: <Activity className="h-4 w-4" />,
    items: [
      { href: "/admin/activities/my-blog", label: "My Blog" },
      { href: "/admin/activities/comments", label: "Comments" },
      { href: "/admin/activities/saved", label: "Saved Articles" },
    ],
  },
  { kind: "item", href: "/admin/profile", label: "My Profile", icon: <UserCircle className="h-4 w-4" /> },
  { kind: "item", href: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

/** Filters NAV for a role, dropping groups left empty and sections with nothing under them. */
function navForRole(role: UserRole): NavEntry[] {
  const visible: NavEntry[] = [];
  for (const entry of NAV) {
    if (entry.kind === "group") {
      const items = entry.items.filter((i) => !i.roles || i.roles.includes(role));
      if (items.length === 0) continue;
      if (entry.roles && !entry.roles.includes(role)) continue;
      visible.push({ ...entry, items });
    } else if (!entry.roles || entry.roles.includes(role)) {
      visible.push(entry);
    }
  }
  return visible.filter((entry, i) => {
    if (entry.kind !== "section") return true;
    const next = visible[i + 1];
    return !!next && next.kind !== "section";
  });
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useSelector(selectAuthStatus);
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);
  const [logout] = useLogoutMutation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navItems = navForRole(role);

  return (
    <main className="min-h-screen bg-background flex">
      {/* Sidebar — sticky so profile widget never scrolls away */}
      <aside className="hidden md:flex w-60 2xl:w-64 3xl:w-72 shrink-0 border-r border-border bg-card/40 flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-border flex items-center justify-between">
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
          <ThemeToggle className="h-8 w-8" iconClassName="h-3.5 w-3.5" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 text-sm overflow-y-auto">
          <NavList items={navItems} />
        </nav>

        {/* Bottom profile widget */}
        {user && <SidebarProfile user={user} role={role} onLogout={() => logout()} />}
      </aside>

      <div className="flex-1 min-w-0">
        {/* Top bar — mobile menu on small screens, notification bell everywhere */}
        <header className="border-b border-border bg-card/60 backdrop-blur px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-border/50 bg-transparent text-foreground hover:bg-accent transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Image src="/images/ss-logo.png" alt="Student Square" width={100} height={28} className="h-7 w-auto" />
          </div>
          <div className="hidden md:block text-sm font-semibold text-foreground">Admin Console</div>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <ThemeToggle className="h-9 w-9" />
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 top-0 left-0 z-[35] bg-background/80 backdrop-blur-sm md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.nav
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 z-[36] flex h-screen w-full max-w-xs flex-col border-r border-border/50 bg-card/95 backdrop-blur md:hidden"
              >
                {/* Mobile Menu Header */}
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-4">
                  <Image src="/images/ss-logo.png" alt="Student Square" width={100} height={28} className="h-6 w-auto" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center h-9 w-9 rounded-lg border border-border/50 bg-transparent text-foreground hover:bg-accent transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Menu Content */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
                  <NavList items={navItems} onNavigate={() => setMobileMenuOpen(false)} />
                </nav>

                {/* Mobile Menu Footer */}
                {user && (
                  <div className="border-t border-border/50 p-3">
                    <button
                      type="button"
                      onClick={() => { setMobileMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        <div className="p-4 sm:p-6 lg:p-8 2xl:p-10 3xl:p-12 max-w-6xl 2xl:max-w-7xl 3xl:max-w-[1700px] 4xl:max-w-[2100px]">{children}</div>
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
                <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                My profile
              </Link>
              <Link
                href="/admin/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                Settings
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

function NavList({ items, onNavigate }: { items: NavEntry[]; onNavigate?: () => void }) {
  return (
    <>
      {items.map((entry, i) => {
        if (entry.kind === "section") {
          return <NavSection key={`section-${i}`} label={entry.label} />;
        }
        if (entry.kind === "group") {
          return (
            <NavGroup
              key={entry.label}
              label={entry.label}
              icon={entry.icon}
              items={entry.items}
              onNavigate={onNavigate}
            />
          );
        }
        return (
          <NavItem
            key={entry.href}
            href={entry.href}
            label={entry.label}
            icon={entry.icon}
            exact={entry.exact}
            onNavigate={onNavigate}
          />
        );
      })}
    </>
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
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      onClick={onNavigate}
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
  onNavigate,
}: {
  label: string;
  icon: React.ReactNode;
  items: Array<{ href: string; label: string }>;
  /** Called after a child link is clicked — used to close the mobile menu. */
  onNavigate?: () => void;
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
                onClick={onNavigate}
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
