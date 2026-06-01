/** Types for the /notifications API surface. */

export type NotificationType =
  | "STORY_APPROVED"
  | "STORY_REJECTED"
  | "COMMENT_APPROVED"
  | "COMMENT_REJECTED"
  | "COMMENT_REPLY"
  | "DONATION_RECEIVED"
  | "RECEIPT_AVAILABLE"
  | "STATEMENT_AVAILABLE"
  | "ADMIN_NEW_STORY"
  | "ADMIN_NEW_COMMENT"
  | "ADMIN_NEW_DONATION";

export type ApiNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  isRead: boolean;
  emailedAt: string | null;
  createdAt: string;
};

/**
 * /notifications returns a paginated payload + an unreadCount field on meta.
 * Backend shape: { meta: { total, page, limit, unreadCount }, data: [...] }
 */
export type NotificationsListResponse = {
  meta: { total: number; page: number; limit: number; unreadCount: number };
  data: ApiNotification[];
};
