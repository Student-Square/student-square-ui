/** Types for GET /admin/analytics/overview. */

export type WeekPoint = { weekStart: string; count: number };

export type AnalyticsOverview = {
  generatedAt: string;
  rangeDays: number;
  userGrowth: {
    totalUsers: number;
    registeredStudents: number;
    newUsersWeekly: WeekPoint[];
    returningUsers: number;
    profileCompletionRate: number;
    verifiedUsers: number;
    topDistricts: { district: string; count: number }[];
  };
  traffic: {
    totalVisits: number;
    uniqueVisitors: number;
    trafficSource: Record<string, number>;
    deviceBreakdown: Record<string, number>;
    bounceRate: number;
    pagesPerSession: number;
    weeklyTrend: WeekPoint[];
    tracked: boolean;
    /** Most-viewed pages in the range, busiest first. */
    topPages: TopPage[];
    /** Most-clicked links in the range, busiest first. */
    topClicks: TopClick[];
    totalClicks: number;
  };
  engagement: {
    assessmentsTaken: number;
    assessmentsWeekly: WeekPoint[];
    careerRoadmapPlanned: number;
    mentorshipEnrollment: number;
    counsellingEnrollment: number;
    sessionBookingCompletionRate: number;
  };
  content: {
    blogViews: number;
    blogViewsWeekly: WeekPoint[];
    publishedBlogCount: number;
    blogComments: number;
    blogShares: number | null;
    blogDownloads: number | null;
    blogUpvotes: number | null;
    magazineDownloads: number | null;
    tracked: boolean;
  };
  funnel: {
    signupConversionRate: number | null;
    assessmentToMentorshipConversion: number | null;
    dropOffPoints: null;
  };
  feedback: {
    feedbackSubmitted: number;
    supportTickets: number | null;
    satisfactionRating: number | null;
  };
};

export type TopPage = { path: string; views: number; visitors: number };

export type TopClick = {
  /** Pathname for our own pages; origin + path for other sites. */
  target: string;
  external: boolean;
  clicks: number;
  visitors: number;
  /** The link text it was most often clicked under. */
  label: string | null;
};
