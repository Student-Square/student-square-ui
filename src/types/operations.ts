export type OperationMemberOption = {
  id: string;
  fullName: string;
  memberId: string | null;
  email: string;
};

export type OperationEntry = {
  id: string;
  taskName: string;
  startsAt: string;
  endsAt: string;
  mentorIds: string[];
  mentorsOther: string | null;
  attendees: string;
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
  attendees: string;
  description: string;
};

export type PaginatedOperations = {
  data: OperationEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
