import { baseApi } from "@/redux/api/baseApi";
import type {
  AssessmentReport,
  AssignableStaff,
  AvailabilitySlot,
  CareAssignment,
  CareRole,
  CareSession,
  CaseloadEntry,
  CareerMilestone,
  MemberAttemptDetail,
  MemberCase,
  MyRank,
  OpenSlot,
  Roadmap,
  RoadmapGoal,
  SessionStatus,
  SwotEntry,
  TodayTasks,
} from "@/types/care";

const enc = encodeURIComponent;

/**
 * One API slice for the whole care surface — assignment, reports, SWOT,
 * roadmap, sessions and rank. They are separate route trees on the server but
 * a single screen usually needs several of them, and splitting the client into
 * four files would only spread the same tag invalidations across four places.
 */
const careApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ----- member-facing -----

    getMyCareTeam: build.query<CareAssignment[], void>({
      query: () => ({ url: "/care/me/team" }),
      providesTags: [{ type: "Care", id: "TEAM" }],
    }),

    getMyReports: build.query<AssessmentReport[], void>({
      query: () => ({ url: "/care/me/reports" }),
      providesTags: [{ type: "Care", id: "MY_REPORTS" }],
    }),

    getMyReport: build.query<AssessmentReport, string>({
      query: (id) => ({ url: `/care/me/reports/${enc(id)}` }),
      providesTags: (_r, _e, id) => [{ type: "Care", id }],
    }),

    getMySwot: build.query<SwotEntry[], void>({
      query: () => ({ url: "/care/me/swot" }),
      providesTags: [{ type: "Care", id: "MY_SWOT" }],
    }),

    getMyRoadmap: build.query<Roadmap, void>({
      query: () => ({ url: "/roadmap/me" }),
      providesTags: [{ type: "Roadmap", id: "MINE" }],
    }),

    getMyTasks: build.query<TodayTasks, void>({
      query: () => ({ url: "/roadmap/me/tasks" }),
      providesTags: [{ type: "Roadmap", id: "TASKS" }],
    }),

    setMyGoalStatus: build.mutation<
      RoadmapGoal,
      { id: string; status: "PENDING" | "IN_PROGRESS" | "DONE" }
    >({
      query: ({ id, status }) => ({
        url: `/roadmap/me/goals/${enc(id)}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [
        { type: "Roadmap", id: "MINE" },
        { type: "Roadmap", id: "TASKS" },
        { type: "Rank", id: "MINE" },
      ],
    }),

    getMyRank: build.query<MyRank, void>({
      query: () => ({ url: "/rank/me" }),
      providesTags: [{ type: "Rank", id: "MINE" }],
    }),

    getOpenSlots: build.query<OpenSlot[], string>({
      query: (staffId) => ({ url: `/sessions/availability/${enc(staffId)}/open` }),
      providesTags: (_r, _e, staffId) => [{ type: "Sessions", id: `OPEN-${staffId}` }],
    }),

    bookSession: build.mutation<CareSession, { slotId: string; agenda?: string }>({
      query: (body) => ({ url: "/sessions", method: "POST", body }),
      invalidatesTags: [
        { type: "Sessions", id: "LIST" },
        { type: "Roadmap", id: "TASKS" },
      ],
    }),

    // ----- sessions (both sides) -----

    getSessions: build.query<
      CareSession[],
      { status?: SessionStatus; from?: string; to?: string } | void
    >({
      query: (args) => ({ url: "/sessions", params: args ?? undefined }),
      providesTags: [{ type: "Sessions", id: "LIST" }],
    }),

    getSession: build.query<CareSession, string>({
      query: (id) => ({ url: `/sessions/${enc(id)}` }),
      providesTags: (_r, _e, id) => [{ type: "Sessions", id }],
    }),

    updateSession: build.mutation<
      CareSession,
      { id: string; agenda?: string | null; staffNotes?: string | null; meetingUrl?: string | null }
    >({
      query: ({ id, ...body }) => ({
        url: `/sessions/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Sessions", id },
        { type: "Sessions", id: "LIST" },
      ],
    }),

    setSessionStatus: build.mutation<
      CareSession,
      { id: string; status: "COMPLETED" | "CANCELLED" | "POSTPONED" | "NO_SHOW"; reason?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/sessions/${enc(id)}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Sessions", id },
        { type: "Sessions", id: "LIST" },
        { type: "Sessions", id: "AVAILABILITY" },
        { type: "Rank", id: "MINE" },
      ],
    }),

    leaveSessionFeedback: build.mutation<
      unknown,
      { id: string; rating: number; comment?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/sessions/${enc(id)}/feedback`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Sessions", id }],
    }),

    // ----- staff availability -----

    getMyAvailability: build.query<AvailabilitySlot[], { from?: string; to?: string } | void>({
      query: (args) => ({ url: "/sessions/availability", params: args ?? undefined }),
      providesTags: [{ type: "Sessions", id: "AVAILABILITY" }],
    }),

    createAvailability: build.mutation<
      { created: number },
      {
        slots: { startsAt: string; endsAt: string }[];
        mode?: "ONLINE" | "IN_PERSON";
        location?: string;
        capacity?: number;
        note?: string;
      }
    >({
      query: (body) => ({ url: "/sessions/availability", method: "POST", body }),
      invalidatesTags: [{ type: "Sessions", id: "AVAILABILITY" }],
    }),

    cancelAvailability: build.mutation<unknown, string>({
      query: (id) => ({ url: `/sessions/availability/${enc(id)}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Sessions", id: "AVAILABILITY" }],
    }),

    // ----- caseload -----

    getCaseload: build.query<CaseloadEntry[], { search?: string; role?: CareRole } | void>({
      query: (args) => ({ url: "/care/caseload", params: args ?? undefined }),
      providesTags: [{ type: "Care", id: "CASELOAD" }],
    }),

    getMemberCase: build.query<MemberCase, string>({
      query: (memberId) => ({ url: `/care/members/${enc(memberId)}` }),
      providesTags: (_r, _e, memberId) => [{ type: "Care", id: memberId }],
    }),

    getMemberAttempt: build.query<
      MemberAttemptDetail,
      { memberId: string; attemptId: string }
    >({
      query: ({ memberId, attemptId }) => ({
        url: `/care/members/${enc(memberId)}/assessments/${enc(attemptId)}`,
      }),
    }),

    getAssignableStaff: build.query<AssignableStaff[], CareRole>({
      query: (role) => ({ url: "/care/staff", params: { role } }),
      providesTags: [{ type: "Care", id: "STAFF" }],
    }),

    assignStaff: build.mutation<
      CareAssignment,
      { memberId: string; staffId: string; role: CareRole; note?: string }
    >({
      query: (body) => ({ url: "/care/assignments", method: "POST", body }),
      invalidatesTags: (_r, _e, { memberId }) => [
        { type: "Care", id: memberId },
        { type: "Care", id: "CASELOAD" },
        { type: "Care", id: "STAFF" },
      ],
    }),

    endAssignment: build.mutation<
      CareAssignment,
      { id: string; memberId: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/care/assignments/${enc(id)}/end`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_r, _e, { memberId }) => [
        { type: "Care", id: memberId },
        { type: "Care", id: "CASELOAD" },
        { type: "Care", id: "STAFF" },
      ],
    }),

    // ----- reports (staff side) -----

    getMemberReports: build.query<AssessmentReport[], string>({
      query: (memberId) => ({ url: `/care/members/${enc(memberId)}/reports` }),
      providesTags: (_r, _e, memberId) => [{ type: "Care", id: `REPORTS-${memberId}` }],
    }),

    createReport: build.mutation<
      AssessmentReport,
      {
        memberId: string;
        title: string;
        summary: string;
        recommendations?: string;
        privateNotes?: string;
      }
    >({
      query: ({ memberId, ...body }) => ({
        url: `/care/members/${enc(memberId)}/reports`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [
        { type: "Care", id: memberId },
        { type: "Care", id: `REPORTS-${memberId}` },
      ],
    }),

    updateReport: build.mutation<
      AssessmentReport,
      {
        id: string;
        memberId: string;
        title?: string;
        summary?: string;
        recommendations?: string | null;
        privateNotes?: string | null;
      }
    >({
      query: ({ id, memberId: _memberId, ...body }) => ({
        url: `/care/reports/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [
        { type: "Care", id: memberId },
        { type: "Care", id: `REPORTS-${memberId}` },
      ],
    }),

    shareReport: build.mutation<
      AssessmentReport,
      { id: string; memberId: string; shared: boolean }
    >({
      query: ({ id, shared }) => ({
        url: `/care/reports/${enc(id)}/share`,
        method: "POST",
        body: { shared },
      }),
      invalidatesTags: (_r, _e, { memberId }) => [
        { type: "Care", id: memberId },
        { type: "Care", id: `REPORTS-${memberId}` },
      ],
    }),

    archiveReport: build.mutation<unknown, { id: string; memberId: string }>({
      query: ({ id }) => ({ url: `/care/reports/${enc(id)}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { memberId }) => [
        { type: "Care", id: memberId },
        { type: "Care", id: `REPORTS-${memberId}` },
      ],
    }),

    // ----- SWOT (staff side) -----

    createSwot: build.mutation<
      SwotEntry,
      { memberId: string; kind: SwotEntry["kind"]; text: string; textBn?: string }
    >({
      query: ({ memberId, ...body }) => ({
        url: `/care/members/${enc(memberId)}/swot`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Care", id: memberId }],
    }),

    updateSwot: build.mutation<
      SwotEntry,
      {
        id: string;
        memberId: string;
        kind?: SwotEntry["kind"];
        text?: string;
        textBn?: string | null;
        archived?: boolean;
      }
    >({
      query: ({ id, memberId: _memberId, ...body }) => ({
        url: `/care/swot/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Care", id: memberId }],
    }),

    // ----- roadmap (staff side) -----

    getMemberRoadmap: build.query<Roadmap, string>({
      query: (memberId) => ({ url: `/roadmap/members/${enc(memberId)}` }),
      providesTags: (_r, _e, memberId) => [{ type: "Roadmap", id: memberId }],
    }),

    setRoadmapHeadline: build.mutation<
      Roadmap,
      { memberId: string; headline?: string | null; headlineBn?: string | null }
    >({
      query: ({ memberId, ...body }) => ({
        url: `/roadmap/members/${enc(memberId)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Roadmap", id: memberId }],
    }),

    createGoal: build.mutation<
      RoadmapGoal,
      {
        memberId: string;
        plan: RoadmapGoal["plan"];
        cadence?: RoadmapGoal["cadence"];
        title: string;
        description?: string;
        dueAt?: string;
      }
    >({
      query: ({ memberId, ...body }) => ({
        url: `/roadmap/members/${enc(memberId)}/goals`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Roadmap", id: memberId }],
    }),

    updateGoal: build.mutation<
      RoadmapGoal,
      {
        id: string;
        memberId: string;
        title?: string;
        description?: string | null;
        cadence?: RoadmapGoal["cadence"];
        dueAt?: string | null;
        status?: RoadmapGoal["status"];
      }
    >({
      query: ({ id, memberId: _memberId, ...body }) => ({
        url: `/roadmap/goals/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Roadmap", id: memberId }],
    }),

    deleteGoal: build.mutation<unknown, { id: string; memberId: string }>({
      query: ({ id }) => ({ url: `/roadmap/goals/${enc(id)}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Roadmap", id: memberId }],
    }),

    createMilestone: build.mutation<
      CareerMilestone,
      { memberId: string; title: string; description?: string; targetDate?: string }
    >({
      query: ({ memberId, ...body }) => ({
        url: `/roadmap/members/${enc(memberId)}/milestones`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Roadmap", id: memberId }],
    }),

    updateMilestone: build.mutation<
      CareerMilestone,
      {
        id: string;
        memberId: string;
        title?: string;
        description?: string | null;
        targetDate?: string | null;
        achieved?: boolean;
      }
    >({
      query: ({ id, memberId: _memberId, ...body }) => ({
        url: `/roadmap/milestones/${enc(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Roadmap", id: memberId }],
    }),

    deleteMilestone: build.mutation<unknown, { id: string; memberId: string }>({
      query: ({ id }) => ({ url: `/roadmap/milestones/${enc(id)}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { memberId }) => [{ type: "Roadmap", id: memberId }],
    }),
  }),
});

export const {
  useGetMyCareTeamQuery,
  useGetMyReportsQuery,
  useGetMyReportQuery,
  useGetMySwotQuery,
  useGetMyRoadmapQuery,
  useGetMyTasksQuery,
  useSetMyGoalStatusMutation,
  useGetMyRankQuery,
  useGetOpenSlotsQuery,
  useBookSessionMutation,
  useGetSessionsQuery,
  useGetSessionQuery,
  useUpdateSessionMutation,
  useSetSessionStatusMutation,
  useLeaveSessionFeedbackMutation,
  useGetMyAvailabilityQuery,
  useCreateAvailabilityMutation,
  useCancelAvailabilityMutation,
  useGetCaseloadQuery,
  useGetMemberCaseQuery,
  useGetMemberAttemptQuery,
  useGetAssignableStaffQuery,
  useAssignStaffMutation,
  useEndAssignmentMutation,
  useGetMemberReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useShareReportMutation,
  useArchiveReportMutation,
  useCreateSwotMutation,
  useUpdateSwotMutation,
  useGetMemberRoadmapQuery,
  useSetRoadmapHeadlineMutation,
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useDeleteMilestoneMutation,
} = careApi;

export default careApi;
