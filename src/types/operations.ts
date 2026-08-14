import type { UserRole } from "./auth";

export type OperationMemberOption = {
  id: string;
  fullName: string;
  memberId: string | null;
  email: string;
};

/** FR-12-004: names under five attendees, a count from five. */
export type AttendeeMode = "NAMES" | "COUNT";

export type OperationEntry = {
  id: string;
  taskName: string;
  startsAt: string;
  endsAt: string;
  mentorIds: string[];
  mentorsOther: string | null;
  /** Derived display label, written by the server from the fields below. */
  attendees: string;
  attendeeMode: AttendeeMode;
  attendeeNames: string[];
  attendeeCount: number | null;
  attendeeMemberIds: string[];
  /** Which book this row belongs to — the author's role at write time. */
  panelScope: UserRole;
  eventId: string | null;
  description: string;
  mentorsLabel?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    memberId: string | null;
    email: string;
  };
};

export type OperationEntryInput = {
  taskName: string;
  startsAt: string;
  endsAt: string;
  mentorIds: string[];
  mentorsOther?: string | null;
  description: string;
  attendeeMode: AttendeeMode;
  attendeeNames?: string[];
  attendeeCount?: number;
  attendeeMemberIds?: string[];
  eventId?: string | null;
};

export type PaginatedOperations = {
  data: OperationEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
