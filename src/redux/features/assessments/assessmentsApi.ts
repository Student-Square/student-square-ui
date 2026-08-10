import { baseApi } from "@/redux/api/baseApi";
import type {
  AdminDefinition,
  AdminDefinitionSummary,
  AnswerValue,
  AssessmentAttempt,
  AssessmentCategory,
  CatalogueEntry,
  DataRequest,
  DataRequestType,
  SubmitResult,
} from "@/types/assessments";

const assessmentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // --- member ---
    getAssessmentCatalogue: build.query<CatalogueEntry[], void>({
      query: () => ({ url: "/assessments" }),
      providesTags: [{ type: "Assessments", id: "CATALOGUE" }],
    }),

    startAttempt: build.mutation<AssessmentAttempt, AssessmentCategory>({
      query: (category) => ({
        url: "/assessments/attempts",
        method: "POST",
        body: { category },
      }),
      invalidatesTags: [{ type: "Assessments", id: "CATALOGUE" }],
    }),

    getAttempt: build.query<AssessmentAttempt, string>({
      query: (id) => ({ url: `/assessments/attempts/${encodeURIComponent(id)}` }),
      providesTags: (_r, _e, id) => [{ type: "Assessments", id }],
    }),

    saveSection: build.mutation<
      { saved: number; sectionId: string },
      {
        attemptId: string;
        sectionId: string;
        answers: { questionId: string; value: AnswerValue }[];
      }
    >({
      query: ({ attemptId, ...body }) => ({
        url: `/assessments/attempts/${encodeURIComponent(attemptId)}/section`,
        method: "PATCH",
        body,
      }),
      // Deliberately does NOT invalidate the attempt: refetching mid-section
      // would replace what the member is currently typing with the server copy.
    }),

    heartbeat: build.mutation<
      { status: string; remainingSeconds: number | null },
      string
    >({
      query: (attemptId) => ({
        url: `/assessments/attempts/${encodeURIComponent(attemptId)}/heartbeat`,
        method: "POST",
      }),
    }),

    abandonAttempt: build.mutation<{ status: string }, string>({
      query: (attemptId) => ({
        url: `/assessments/attempts/${encodeURIComponent(attemptId)}/abandon`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Assessments", id: "CATALOGUE" }],
    }),

    submitAttempt: build.mutation<SubmitResult, string>({
      query: (attemptId) => ({
        url: `/assessments/attempts/${encodeURIComponent(attemptId)}/submit`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Assessments", id: "CATALOGUE" }],
    }),

    // --- data-subject requests (SRS 11.5) ---
    listDataRequests: build.query<DataRequest[], void>({
      query: () => ({ url: "/data-requests" }),
      providesTags: [{ type: "DataRequests", id: "LIST" }],
    }),

    createDataRequest: build.mutation<
      { request: DataRequest; export: unknown },
      { type: DataRequestType; note?: string }
    >({
      query: (body) => ({ url: "/data-requests", method: "POST", body }),
      invalidatesTags: [{ type: "DataRequests", id: "LIST" }],
    }),

    // --- admin form builder (FR-05-015) ---
    listAssessmentDefinitions: build.query<
      AdminDefinitionSummary[],
      { category?: string; status?: string } | void
    >({
      query: (params) => ({ url: "/admin/assessments", params: params ?? {} }),
      providesTags: [{ type: "AdminAssessments", id: "LIST" }],
    }),

    getAssessmentDefinition: build.query<AdminDefinition, string>({
      query: (id) => ({ url: `/admin/assessments/${encodeURIComponent(id)}` }),
      providesTags: (_r, _e, id) => [{ type: "AdminAssessments", id }],
    }),

    createAssessmentDefinition: build.mutation<
      AdminDefinition,
      {
        category: string;
        title: string;
        description?: string;
        rules?: string;
        durationMinutes?: number;
        passPercent?: number;
      }
    >({
      query: (body) => ({ url: "/admin/assessments", method: "POST", body }),
      invalidatesTags: [{ type: "AdminAssessments", id: "LIST" }],
    }),

    updateAssessmentDefinition: build.mutation<
      AdminDefinition,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/assessments/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "AdminAssessments", id },
        { type: "AdminAssessments", id: "LIST" },
      ],
    }),

    forkAssessmentDefinition: build.mutation<AdminDefinition, string>({
      query: (id) => ({
        url: `/admin/assessments/${encodeURIComponent(id)}/fork`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "AdminAssessments", id: "LIST" }],
    }),

    publishAssessmentDefinition: build.mutation<AdminDefinition, string>({
      query: (id) => ({
        url: `/admin/assessments/${encodeURIComponent(id)}/publish`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "AdminAssessments", id },
        { type: "AdminAssessments", id: "LIST" },
      ],
    }),

    archiveAssessmentDefinition: build.mutation<AdminDefinition, string>({
      query: (id) => ({
        url: `/admin/assessments/${encodeURIComponent(id)}/archive`,
        method: "POST",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "AdminAssessments", id },
        { type: "AdminAssessments", id: "LIST" },
      ],
    }),

    addAssessmentSection: build.mutation<
      unknown,
      { definitionId: string; data: Record<string, unknown> }
    >({
      query: ({ definitionId, data }) => ({
        url: `/admin/assessments/${encodeURIComponent(definitionId)}/sections`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { definitionId }) => [
        { type: "AdminAssessments", id: definitionId },
      ],
    }),

    updateAssessmentSection: build.mutation<
      unknown,
      { definitionId: string; sectionId: string; data: Record<string, unknown> }
    >({
      query: ({ sectionId, data }) => ({
        url: `/admin/assessments/sections/${encodeURIComponent(sectionId)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { definitionId }) => [
        { type: "AdminAssessments", id: definitionId },
      ],
    }),

    deleteAssessmentSection: build.mutation<
      unknown,
      { definitionId: string; sectionId: string }
    >({
      query: ({ sectionId }) => ({
        url: `/admin/assessments/sections/${encodeURIComponent(sectionId)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { definitionId }) => [
        { type: "AdminAssessments", id: definitionId },
      ],
    }),

    reorderAssessmentSections: build.mutation<
      unknown,
      { definitionId: string; ids: string[] }
    >({
      query: ({ definitionId, ids }) => ({
        url: `/admin/assessments/${encodeURIComponent(definitionId)}/sections/order`,
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: (_r, _e, { definitionId }) => [
        { type: "AdminAssessments", id: definitionId },
      ],
    }),

    addAssessmentQuestion: build.mutation<
      unknown,
      { definitionId: string; sectionId: string; data: Record<string, unknown> }
    >({
      query: ({ sectionId, data }) => ({
        url: `/admin/assessments/sections/${encodeURIComponent(sectionId)}/questions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_r, _e, { definitionId }) => [
        { type: "AdminAssessments", id: definitionId },
      ],
    }),

    updateAssessmentQuestion: build.mutation<
      unknown,
      { definitionId: string; questionId: string; data: Record<string, unknown> }
    >({
      query: ({ questionId, data }) => ({
        url: `/admin/assessments/questions/${encodeURIComponent(questionId)}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { definitionId }) => [
        { type: "AdminAssessments", id: definitionId },
      ],
    }),

    deleteAssessmentQuestion: build.mutation<
      unknown,
      { definitionId: string; questionId: string }
    >({
      query: ({ questionId }) => ({
        url: `/admin/assessments/questions/${encodeURIComponent(questionId)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { definitionId }) => [
        { type: "AdminAssessments", id: definitionId },
      ],
    }),

    reorderAssessmentQuestions: build.mutation<
      unknown,
      { definitionId: string; sectionId: string; ids: string[] }
    >({
      query: ({ sectionId, ids }) => ({
        url: `/admin/assessments/sections/${encodeURIComponent(sectionId)}/questions/order`,
        method: "PATCH",
        body: { ids },
      }),
      invalidatesTags: (_r, _e, { definitionId }) => [
        { type: "AdminAssessments", id: definitionId },
      ],
    }),
  }),
});

export const {
  useGetAssessmentCatalogueQuery,
  useStartAttemptMutation,
  useGetAttemptQuery,
  useSaveSectionMutation,
  useHeartbeatMutation,
  useAbandonAttemptMutation,
  useSubmitAttemptMutation,
  useListDataRequestsQuery,
  useCreateDataRequestMutation,
  useListAssessmentDefinitionsQuery,
  useGetAssessmentDefinitionQuery,
  useCreateAssessmentDefinitionMutation,
  useUpdateAssessmentDefinitionMutation,
  useForkAssessmentDefinitionMutation,
  usePublishAssessmentDefinitionMutation,
  useArchiveAssessmentDefinitionMutation,
  useAddAssessmentSectionMutation,
  useUpdateAssessmentSectionMutation,
  useDeleteAssessmentSectionMutation,
  useReorderAssessmentSectionsMutation,
  useAddAssessmentQuestionMutation,
  useUpdateAssessmentQuestionMutation,
  useDeleteAssessmentQuestionMutation,
  useReorderAssessmentQuestionsMutation,
} = assessmentsApi;

export default assessmentsApi;
