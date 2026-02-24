import axios from 'axios'
import type { UserListParams, UserListResponse, ReorderPinsPayload } from '@/types/api'
import type { User, UserPayload } from '@/types/user'

const BASE = '/api/users'

export function useUserApi() {
  const list = (params: UserListParams) =>
    axios.get<UserListResponse>(BASE, { params })

  const create = (data: UserPayload) =>
    axios.post<User>(BASE, data)

  const update = (id: number, data: Partial<UserPayload>) =>
    axios.put<User>(`${BASE}/${id}`, data)

  const remove = (id: number) =>
    axios.delete(`${BASE}/${id}`)

  const pin = (id: number) =>
    axios.post<User>(`${BASE}/${id}/pin`)

  const unpin = (id: number) =>
    axios.delete<User>(`${BASE}/${id}/pin`)

  const reorderPins = (payload: ReorderPinsPayload) =>
    axios.post<{ ok: boolean }>(`${BASE}/reorder-pins`, payload)

  return { list, create, update, remove, pin, unpin, reorderPins }
}
