export type NotificationType = "role_assigned" | "role_permissions_updated" | string;

export type Notification = {
  id: number;
  created_at: string;
  title?: string | null;
  message?: string | null;
  type?: NotificationType | null;
  is_read: boolean;
  data?: unknown;
};

export type PaginatedNotifications = {
  count: number;
  page: number;
  page_size: number;
  results: Notification[];
};

