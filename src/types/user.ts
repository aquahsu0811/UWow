export interface User {
  id: number
  username: string
  position: string
  location: string
  age: number
  birthdate: string        // 'YYYY-MM-DD'
  is_pinned: boolean
  pin_order: number | null // 1-based, null = not pinned
  created_at: string       // ISO 8601
  updated_at: string
}

// 新增/更新時送出的 payload (不含 id, is_pinned, pin_order, timestamps)
export type UserPayload = Pick<User, 'username' | 'position' | 'location' | 'age' | 'birthdate'>

// 排序欄位
export type SortField = 'username' | 'position' | 'location' | 'age' | 'birthdate' | 'id'
export type SortDir = 'asc' | 'desc'
