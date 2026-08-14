/** Types for the Phase 3 care surface: assignment, reports, roadmap, sessions, rank. */

import type { UserRole } from "./auth";

export type CareRole = "COUNSELLOR" | "MENTOR";

export type StaffSummary = {
  id: string;
  fullName: string;
  role: UserRole;
  email: string;
  profile: { avatarUrl: string | null } | null;
};

export type AssignableStaff = StaffSummary & { activeCaseload: number };

export type CareAssignment = {
  id: string;
  memberId: string;
  staffId: string;
  role: CareRole;
  note: string | null;
  startedAt: string;
  endedAt: string | null;
  endedReason: string | null;
  staff: StaffSummary;
  assignedBy?: { id: string; fullName: string; role: UserRole } | null;
};

export type CaseloadEntry = {
  assignmentId: string;
  role: CareRole;
  startedAt: string;
  member: {
    id: string;
    memberId: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
    joinedAt: string;
  };
  progress: {
    assessmentsSubmitted: number;
    reports: number;
    goalsTotal: number;
    goalsDone: number;
    percent: number;
  };
  rank: { tier: RankTier; points: number };
};

export type SwotKind = "STRENGTH" | "WEAKNESS" | "OPPORTUNITY" | "THREAT";

export type SwotEntry = {
  id: string;
  kind: SwotKind;
  text: string;
  textBn: string | null;
  source: "ASSESSMENT_DERIVED" | "COUNSELLOR";
  createdAt: string;
  archivedAt?: string | null;
  createdBy?: { id: string; fullName: string } | null;
};

export type AssessmentReport = {
  id: string;
  memberId?: string;
  title: string;
  summary: string;
  recommendations: string | null;
  /** Staff-only; never present on a member-facing response. */
  privateNotes?: string | null;
  sharedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: { id: string; fullName: string; role: UserRole } | null;
};

export type AttemptSummary = {
  id: string;
  submittedAt: string | null;
  scorePercent: string | number | null;
  passed: boolean | null;
  requiresReassessment: boolean;
  definition: { category: string; title: string; version: number };
  aptitudeResult: unknown | null;
};

export type MemberCase = {
  member: {
    id: string;
    memberId: string;
    fullName: string;
    fullNameBn: string | null;
    email: string;
    avatarUrl: string | null;
    isMinor: boolean;
    joinedAt: string;
    profile: Record<string, unknown> | null;
  };
  careTeam: CareAssignment[];
  assessments: AttemptSummary[];
  swot: SwotEntry[];
  reports: AssessmentReport[];
  roadmap: Roadmap | null;
  sessions: SessionSummary[];
  rank: RankState | null;
  badges: { badge: Badge; awardedAt: string }[];
};

/** One submitted attempt as a counsellor sees it (sensitive sections omitted). */
export type MemberAttemptDetail = {
  id: string;
  submittedAt: string | null;
  scorePercent: string | number | null;
  passed: boolean | null;
  requiresReassessment: boolean;
  category: string;
  title: string;
  sections: {
    id: string;
    key: string;
    title: string;
    sensitive: boolean;
    answeredCount?: number;
    questions: {
      id: string;
      prompt: string;
      type: string;
      options: unknown;
      answer: unknown;
    }[];
  }[];
};

// --- roadmap ---

export type RoadmapPlan = "ASSESSMENT_PLAN" | "PROGRESS_PLAN";
export type GoalCadence = "WEEKLY" | "MONTHLY" | "ONE_OFF";
export type GoalStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "MISSED";

export type RoadmapGoal = {
  id: string;
  plan: RoadmapPlan;
  cadence: GoalCadence;
  title: string;
  description: string | null;
  order: number;
  status: GoalStatus;
  dueAt: string | null;
  completedAt: string | null;
  overdue?: boolean;
};

export type CareerMilestone = {
  id: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  achievedAt: string | null;
  order: number;
};

export type Roadmap = {
  id: string | null;
  memberId: string;
  headline: string | null;
  headlineBn: string | null;
  goals: RoadmapGoal[];
  milestones: CareerMilestone[];
};

export type TodayTasks = {
  goals: RoadmapGoal[];
  sessions: SessionSummary[];
};

// --- sessions ---

export type SessionMode = "ONLINE" | "IN_PERSON";
export type SessionStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED"
  | "POSTPONED"
  | "NO_SHOW";

export type SessionSummary = {
  id: string;
  startsAt: string;
  endsAt: string;
  status?: SessionStatus;
  mode?: SessionMode;
  staff: { id: string; fullName: string; role: UserRole };
};

export type CareSession = {
  id: string;
  slotId: string;
  memberId: string;
  staffId: string;
  startsAt: string;
  endsAt: string;
  mode: SessionMode;
  location: string | null;
  status: SessionStatus;
  agenda: string | null;
  /** Staff-side only. */
  staffNotes?: string | null;
  /** Null outside the release window — FR-08-008. */
  meetingUrl: string | null;
  meetingUrlAvailableFrom: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  member: { id: string; fullName: string; memberId: string };
  staff: { id: string; fullName: string; role: UserRole };
  feedback: { id: string; byUserId: string; rating: number; comment: string | null }[];
};

export type AvailabilitySlot = {
  id: string;
  startsAt: string;
  endsAt: string;
  mode: SessionMode;
  location: string | null;
  capacity: number;
  bookedCount: number;
  note: string | null;
  sessions?: {
    id: string;
    status: SessionStatus;
    member: { id: string; fullName: string };
  }[];
};

export type OpenSlot = {
  id: string;
  startsAt: string;
  endsAt: string;
  mode: SessionMode;
  location: string | null;
  note: string | null;
  seatsLeft: number;
};

// --- rank ---

export type RankTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export type RankState = {
  tier: RankTier;
  points: number;
  goalsCompleted: number;
  sessionsCompleted: number;
};

export type Badge = {
  id: string;
  key: string;
  name: string;
  nameBn: string | null;
  description: string | null;
  iconUrl: string | null;
  points: number;
  earned?: boolean;
  awardedAt?: string | null;
};

export type MyRank = {
  rank: RankState;
  tiers: readonly { tier: RankTier; min: number }[];
  badges: Badge[];
};
