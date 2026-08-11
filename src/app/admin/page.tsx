"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectUserRole } from "@/redux/features/auth/authSlice";
import {
  Activity,
  BarChart3,
  Briefcase,
  FileText,
  FlagTriangleRight,
  HandCoins,
  LayoutGrid,
  Newspaper,
  Users,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

const TOP_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
const EDIT_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];
const AUTHOR_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR"];

const QUICK_LINKS: Array<{
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  bg: string;
  roles?: UserRole[];
}> = [
  {
    href: "/admin/hero",
    icon: <LayoutGrid className="h-5 w-5 text-emerald-600" />,
    label: "Hero Cards",
    desc: "Manage homepage feature cards",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    roles: EDIT_ROLES,
  },
  {
    href: "/admin/blog/magazine",
    icon: <Newspaper className="h-5 w-5 text-blue-600" />,
    label: "Blog",
    desc: "Magazine, stories & reports",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    roles: AUTHOR_ROLES,
  },
  {
    href: "/admin/pages/about",
    icon: <FileText className="h-5 w-5 text-violet-600" />,
    label: "Pages",
    desc: "About us, mission, who we are",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    roles: EDIT_ROLES,
  },
  {
    href: "/admin/users",
    icon: <Users className="h-5 w-5 text-amber-600" />,
    label: "Users",
    desc: "Manage members & team",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    roles: TOP_ROLES,
  },
  {
    href: "/admin/donation",
    icon: <HandCoins className="h-5 w-5 text-rose-600" />,
    label: "Donation",
    desc: "Campaigns & donor records",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    roles: EDIT_ROLES,
  },
  {
    href: "/admin/analytics",
    icon: <BarChart3 className="h-5 w-5 text-cyan-600" />,
    label: "Analytics",
    desc: "Users, traffic, engagement & content",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    roles: EDIT_ROLES,
  },
  {
    href: "/admin/moderation",
    icon: <FlagTriangleRight className="h-5 w-5 text-orange-600" />,
    label: "Moderation Queue",
    desc: "Review pending stories & comments",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    roles: ["SUPER_ADMIN", "ADMIN", "MODERATOR"],
  },
  {
    href: "/admin/recruitment",
    icon: <Briefcase className="h-5 w-5 text-indigo-600" />,
    label: "Recruitment",
    desc: "Candidates & hiring pipeline",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    roles: ["SUPER_ADMIN", "ADMIN", "HR_MANAGER"],
  },
  {
    href: "/admin/activities/my-blog",
    icon: <Activity className="h-5 w-5 text-teal-600" />,
    label: "My Activities",
    desc: "Your blog, comments & saved",
    bg: "bg-teal-50 dark:bg-teal-900/20",
  },
];

export default function AdminOverviewPage() {
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);
  const firstName = user?.fullName.split(" ")[0] ?? "Admin";
  const quickLinks = QUICK_LINKS.filter((l) => !l.roles || (role && l.roles.includes(role)));

  return (
    <div className="space-y-8 max-w-4xl 2xl:max-w-6xl 3xl:max-w-none">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Admin Dashboard
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s a quick overview of the admin panel.
        </p>
      </div>

      {/* Identity card */}
      {user && (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted ring-2 ring-border shrink-0">
            {user.profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                {getInitials(user.fullName)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {user.role.replace(/_/g, " ")}
          </span>
        </div>
      )}

      {/* Quick access */}
      <div>
        <h2 className="text-sm font-bold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-emerald-500/40 hover:shadow-sm transition-all group"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
