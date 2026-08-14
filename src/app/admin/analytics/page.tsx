"use client";

import { useState } from "react";
import { useGetAnalyticsOverviewQuery } from "@/redux/features/analytics/analyticsApi";
import type { WeekPoint } from "@/types/analytics";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  BookOpen,
  Globe,
  GraduationCap,
  Loader2,
  MessageSquareText,
  TrendingUp,
  Users,
} from "lucide-react";

const RANGE_OPTIONS = [
  { days: 28, label: "4 weeks" },
  { days: 56, label: "8 weeks" },
  { days: 84, label: "12 weeks" },
];

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(84);
  const { data, isLoading, isError } = useGetAnalyticsOverviewQuery({ days });

  return (
    <div className="space-y-8 max-w-6xl 2xl:max-w-none">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Website Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            User growth, traffic, engagement, content, conversions and feedback — computed from live data.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-border overflow-hidden shrink-0">
          {RANGE_OPTIONS.map((o) => (
            <button
              key={o.days}
              type="button"
              onClick={() => setDays(o.days)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                days === o.days
                  ? "bg-emerald-600 text-white"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-16">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading analytics…
        </div>
      )}
      {isError && <p className="text-sm text-red-600 py-6">Failed to load analytics.</p>}

      {data && (
        <>
          {/* 1. User Base & Growth */}
          <Section icon={<Users className="h-4 w-4" />} title="User Base & Growth">
            <StatGrid>
              <Stat label="Total users" value={data.userGrowth.totalUsers} />
              <Stat label="Registered students" value={data.userGrowth.registeredStudents} />
              <Stat label="Returning users" value={data.userGrowth.returningUsers} />
              <Stat label="Profile completion" value={`${data.userGrowth.profileCompletionRate}%`} />
              <Stat label="Verified users" value={data.userGrowth.verifiedUsers} />
            </StatGrid>
            <TrendChart data={data.userGrowth.newUsersWeekly} label="New users / week" />
            {data.userGrowth.topDistricts.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Top districts
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.userGrowth.topDistricts.map((d) => (
                    <span
                      key={d.district}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-foreground"
                    >
                      {d.district} · {d.count}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* 2. Traffic & Visitor Insights */}
          <Section icon={<Globe className="h-4 w-4" />} title="Traffic & Visitor Insights">
            {!data.traffic.tracked && <NotTrackedNote text="No pageviews recorded yet — the beacon started collecting the moment this feature shipped, so early ranges will look empty." />}
            <StatGrid>
              <Stat label="Website visits" value={data.traffic.totalVisits} />
              <Stat label="Unique visitors" value={data.traffic.uniqueVisitors} />
              <Stat label="Bounce rate" value={`${data.traffic.bounceRate}%`} />
              <Stat label="Pages / session" value={data.traffic.pagesPerSession} />
            </StatGrid>
            <TrendChart data={data.traffic.weeklyTrend} label="Visits / week" />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Breakdown title="Traffic source" data={data.traffic.trafficSource} />
              <Breakdown title="Device" data={data.traffic.deviceBreakdown} />
            </div>
          </Section>

          {/* 3. Engagement with Learning Tools */}
          <Section icon={<GraduationCap className="h-4 w-4" />} title="Engagement with Learning Tools">
            <StatGrid>
              <Stat label="Assessments taken" value={data.engagement.assessmentsTaken} />
              <Stat label="Career roadmaps planned" value={data.engagement.careerRoadmapPlanned} />
              <Stat label="Mentorship enrollment" value={data.engagement.mentorshipEnrollment} />
              <Stat label="Counselling enrollment" value={data.engagement.counsellingEnrollment} />
              <Stat label="Session booking completion" value={`${data.engagement.sessionBookingCompletionRate}%`} />
            </StatGrid>
            <TrendChart data={data.engagement.assessmentsWeekly} label="Assessments completed / week" />
          </Section>

          {/* 4. Content Analytics */}
          <Section icon={<BookOpen className="h-4 w-4" />} title="Content Analytics (Blog + Magazine)">
            {!data.content.tracked && <NotTrackedNote text="No blog pageviews recorded yet." />}
            <StatGrid>
              <Stat label="Blog views" value={data.content.blogViews} />
              <Stat label="Published posts" value={data.content.publishedBlogCount} />
              <Stat label="Blog comments" value={data.content.blogComments} />
              <Stat label="Blog shares" value="Not tracked yet" muted />
              <Stat label="Blog downloads" value="Not tracked yet" muted />
              <Stat label="Blog upvotes" value="Not tracked yet" muted />
              <Stat label="Magazine downloads" value="Not tracked yet" muted />
            </StatGrid>
            <TrendChart data={data.content.blogViewsWeekly} label="Blog views / week" />
          </Section>

          {/* 5. Conversions & Funnel Analysis */}
          <Section icon={<TrendingUp className="h-4 w-4" />} title="Conversions & Funnel Analysis">
            <StatGrid>
              <Stat
                label="Signup conversion rate"
                value={data.funnel.signupConversionRate != null ? `${data.funnel.signupConversionRate}%` : "—"}
              />
              <Stat
                label="Assessment → mentorship conversion"
                value={
                  data.funnel.assessmentToMentorshipConversion != null
                    ? `${data.funnel.assessmentToMentorshipConversion}%`
                    : "—"
                }
              />
              <Stat label="Drop-off points" value="Not tracked yet" muted />
            </StatGrid>
          </Section>

          {/* 6. Feedback & Interaction */}
          <Section icon={<MessageSquareText className="h-4 w-4" />} title="Feedback & Interaction">
            <StatGrid>
              <Stat label="Feedback submitted" value={data.feedback.feedbackSubmitted} />
              <Stat
                label="Satisfaction rating"
                value={data.feedback.satisfactionRating != null ? `${data.feedback.satisfactionRating} / 5` : "—"}
              />
              <Stat label="Support tickets" value="Not tracked yet" muted />
            </StatGrid>
          </Section>

          <p className="text-[11px] text-muted-foreground text-center">
            Generated {new Date(data.generatedAt).toLocaleString()} · last {data.rangeDays} days
          </p>
        </>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4">
        <span className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">{children}</div>;
}

function Stat({
  label,
  value,
  muted,
}: {
  label: string;
  value: string | number;
  muted?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/60 px-3.5 py-3">
      <p
        className={`text-xl font-bold leading-none ${muted ? "text-muted-foreground text-sm" : "text-foreground"}`}
      >
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground mt-1.5">{label}</p>
    </div>
  );
}

function NotTrackedNote({ text }: { text: string }) {
  return (
    <p className="mb-4 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg px-3 py-2">
      {text}
    </p>
  );
}

function TrendChart({ data, label }: { data: WeekPoint[]; label: string }) {
  if (!data.length) return null;
  const chartData = data.map((d) => ({
    week: new Date(d.weekStart).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    count: d.count,
  }));

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
        <BarChart3 className="h-3.5 w-3.5" /> {label}
      </p>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={28} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fill="url(#trendFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Breakdown({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (entries.length === 0) {
    return (
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{title}</p>
        <p className="text-xs text-muted-foreground">No data yet.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{title}</p>
      <div className="space-y-1.5">
        {entries
          .sort((a, b) => b[1] - a[1])
          .map(([key, value]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="w-20 shrink-0 capitalize text-muted-foreground">{key}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }}
                />
              </div>
              <span className="w-8 text-right font-semibold text-foreground">{value}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
