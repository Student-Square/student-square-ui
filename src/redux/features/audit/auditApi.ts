import { baseApi } from "@/redux/api/baseApi";

export type AuditEntry = {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  diff: unknown;
  /** Truncated to /24 by the API. */
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  actor: { id: string; email: string; fullName: string; role: string } | null;
};

export type AuditListParams = {
  page?: number;
  limit?: number;
  q?: string;
  action?: string;
  entityType?: string;
  from?: string;
  to?: string;
};

export type AuditList = {
  meta: { total: number; page: number; limit: number };
  data: AuditEntry[];
};

const auditApiSlice = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuditLogs: build.query<AuditList, AuditListParams>({
      query: (params) => ({ url: "/admin/audit-logs", params }),
    }),
    getAuditFacets: build.query<{ actions: string[]; entityTypes: string[] }, void>({
      query: () => ({ url: "/admin/audit-logs/facets" }),
    }),
  }),
});

export const { useGetAuditLogsQuery, useGetAuditFacetsQuery } = auditApiSlice;
