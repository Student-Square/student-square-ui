/** Types for the /notifications API surface. */

export type NotificationType = string;

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
