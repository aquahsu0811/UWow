import type { User, SortField, SortDir } from "./user";

// GET /api/users query params
export interface UserListParams {
  search?: string;
  sort_by?: SortField;
  sort_dir?: SortDir;
  page?: number;
  per_page?: number;
}

// GET /api/users response body
export interface UserListResponse {
  pinned: User[];
  data: User[];
  page: number;
  total_pages: number;
  total: number;
}

// POST /api/users/reorder-pins body
export interface ReorderPinsPayload {
  ids: number[];
}

// 通用 API 錯誤格式
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
