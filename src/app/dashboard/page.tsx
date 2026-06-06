"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { Bookmark, ChevronRight, Heart, MessageSquare, Newspaper } from "lucide-react";

const QUICK_LINKS = [
  {
    href: "/dashboard/activities/my-blog",
    icon: <Newspaper className="h-5 w-5 text-emerald-600" />,
    label: "My Blog",
    description: "View and manage your blog posts.",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    href: "/dashboard/activities/comments",
    icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
    label: "Comments",
    description: "See all comments you've left.",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    href: "/dashboard/activities/saved-articles",
    icon: <Bookmark className="h-5 w-5 text-violet-600" />,
    label: "Saved Articles",
    description: "Articles you've bookmarked.",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
  {
    href: "/dashboard/donation",
    icon: <Heart className="h-5 w-5 text-rose-500" />,
    label: "Donation",
    description: "Support Student Square.",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    badge: "Coming soon",
  },
];

export default function DashboardOverviewPage() {
  const user = useSelector(selectCurrentUser);

  const firstName = user?.fullName?.split(" ")[0] ?? "there";
  const initials = user?.fullName?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s a quick look at your activity on Student Square.
        </p>
      </div>

      {/* Profile card */}
      {user && (
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="h-14 w-14 rounded-full bg-muted overflow-hidden ring-2 ring-border shrink-0">
            {user.profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.profile.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
            ) : (
              <span className="h-full w-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                {initials}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground text-base truncate">{user.fullName}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            <span className="inline-flex mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              {user.role.replace("_", " ")}
            </span>
          </div>
          <Link
            href="/dashboard/profile"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-emerald-600 transition-colors shrink-0"
          >
            Edit profile <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-emerald-500/40 hover:shadow-md transition-all duration-200"
            >
              <div className={`h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                    {item.label}
                  </p>
                  {item.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
