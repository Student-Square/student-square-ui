/** Phase 2 — Gamified Assessment (FR-05). */

export type AssessmentCategory =
  | "SOCIO_DEMOGRAPHIC"
  | "CAREER"
  | "PSYCHOLOGICAL"
  | "COGNITIVE"
  | "HEALTH"
  | "APTITUDE";

export type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTI_CHOICE"
  | "FILL_BLANK"
  | "TRUE_FALSE"
  | "CORRECT_INCORRECT"
  | "SCALE"
  | "TEXT";

export type QuestionDifficulty = "BEGINNER" | "INTERMEDIATE" | "EXPERT";

export type AttemptStatus =
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "INVALIDATED"
  | "EXPIRED";

export type QuestionOption = {
  value: string;
  label: string;
  labelBn?: string;
};

/**
 * Note the absence of `correctAnswer`. The server never sends it (FR-05-013)
 * and this type is the client-side statement of that fact — if it ever appears
 * in a payload, it has nowhere to land.
 */
export type AssessmentQuestion = {
  id: string;
  order: number;
  type: QuestionType;
  prompt: string;
  promptBn: string | null;
  helpText: string | null;
  options: QuestionOption[] | null;
  difficulty: QuestionDifficulty | null;
  points: number;
  required: boolean;
};

export type AssessmentSection = {
  id: string;
  key: string;
  title: string;
  titleBn: string | null;
  description: string | null;
  descriptionBn: string | null;
  order: number;
  sensitive: boolean;
  questions: AssessmentQuestion[];
};

export type AssessmentDefinition = {
  id: string;
  category: AssessmentCategory;
  version: number;
  status: string;
  title: string;
  titleBn: string | null;
  description: string | null;
  descriptionBn: string | null;
  rules: string | null;
  rulesBn: string | null;
  durationMinutes: number | null;
  passPercent: number | null;
  sections: AssessmentSection[];
};

export type AnswerValue = string | number | boolean | string[] | null;

export type AssessmentAttempt = {
  id: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt: string | null;
  deadlineAt: string | null;
  /** Authoritative remaining time from the server, not a client countdown. */
  remainingSeconds: number | null;
  scorePercent: string | number | null;
  passed: boolean | null;
  requiresReassessment: boolean;
  definition: AssessmentDefinition;
  answers: Record<string, AnswerValue>;
};

export type CatalogueEntry = {
  definitionId: string;
  category: AssessmentCategory;
  version: number;
  title: string;
  titleBn: string | null;
  description: string | null;
  descriptionBn: string | null;
  /** Shown before the clock starts on a timed test (FR-05-011). */
  rules: string | null;
  rulesBn: string | null;
  durationMinutes: number | null;
  sectionCount: number;
  timed: boolean;
  attempt: {
    id: string;
    status: AttemptStatus;
    remainingSeconds: number | null;
  } | null;
  completedAttempt: {
    id: string;
    submittedAt: string | null;
    scorePercent: string | number | null;
    passed: boolean | null;
    requiresReassessment: boolean;
  } | null;
};

export type SelfReportSubmitResult = {
  id: string;
  status: AttemptStatus;
  submittedAt: string;
  scored: false;
  message: string;
  swotCandidates: number;
};

export type AptitudeSubmitResult = {
  id: string;
  status: AttemptStatus;
  submittedAt: string;
  scorePercent: number;
  passed: boolean;
  requiresReassessment: boolean;
  areas: { key: string; correct: number; total: number }[];
};

export type SubmitResult = SelfReportSubmitResult | AptitudeSubmitResult;

export const isAptitudeResult = (r: SubmitResult): r is AptitudeSubmitResult =>
  "scorePercent" in r;

// --- admin form builder ---

export type AdminDefinitionSummary = {
  id: string;
  category: AssessmentCategory;
  version: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  title: string;
  durationMinutes: number | null;
  passPercent: number | null;
  publishedAt: string | null;
  createdAt: string;
  _count: { sections: number; attempts: number };
};

/** Admin payloads DO carry correctAnswer — someone has to author it. */
export type AdminQuestion = AssessmentQuestion & {
  correctAnswer?: string | string[] | boolean | null;
  swotLabel: string | null;
};

export type AdminSection = Omit<AssessmentSection, "questions"> & {
  questions: AdminQuestion[];
};

export type AdminDefinition = Omit<AssessmentDefinition, "sections"> & {
  sections: AdminSection[];
  publishedAt: string | null;
  archivedAt: string | null;
};

export type DataRequestType = "EXPORT" | "ERASURE" | "CORRECTION";

export type DataRequest = {
  id: string;
  type: DataRequestType;
  status: "PENDING" | "COMPLETED" | "REJECTED";
  note: string | null;
  requestedAt: string;
  completedAt: string | null;
};
