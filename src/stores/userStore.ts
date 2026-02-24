import { defineStore } from "pinia";
import { ref } from "vue";
import { useUserApi } from "@/composables/useUserApi";
import type { User, UserPayload, SortField, SortDir } from "@/types/user";

export const useUserStore = defineStore("users", () => {
  const api = useUserApi();

  // State
  const rows = ref<User[]>([]);
  const pinned = ref<User[]>([]);
  const page = ref(1);
  const totalPages = ref(1);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Sort / Search state
  const search = ref("");
  const sortBy = ref<SortField>("id");
  const sortDir = ref<SortDir>("asc");

  async function fetchPage(newPage = 1) {
    if (loading.value) return;

    loading.value = true;
    error.value = null;

    try {
      const { data } = await api.list({
        search: search.value || undefined,
        sort_by: sortBy.value,
        sort_dir: sortDir.value,
        page: newPage,
        per_page: 500,
      });
      pinned.value = data.pinned;
      rows.value = data.data;
      page.value = data.page || 1;
      totalPages.value = data.total_pages || 1;
      total.value = data.total;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Unknown error";
    } finally {
      loading.value = false;
    }
  }

  function toggleSort(field: SortField) {
    if (sortBy.value === field) {
      sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
    } else {
      sortBy.value = field;
      sortDir.value = "asc";
    }
    fetchPage(1);
  }

  async function addUser(payload: UserPayload) {
    await api.create(payload);
    await fetchPage(1);
  }

  async function updateUser(id: number, payload: Partial<UserPayload>) {
    await api.update(id, payload);
    await fetchPage(1);
  }

  async function deleteUser(id: number) {
    await api.remove(id);
    rows.value = rows.value.filter((r) => r.id !== id);
    pinned.value = pinned.value.filter((r) => r.id !== id);
  }

  async function togglePin(user: User) {
    if (user.is_pinned) await api.unpin(user.id);
    else await api.pin(user.id);
    await fetchPage(1);
  }

  async function reorderPins(ids: number[]) {
    await api.reorderPins({ ids });
    await fetchPage(1);
  }

  return {
    rows,
    pinned,
    page,
    totalPages,
    total,
    loading,
    error,
    search,
    sortBy,
    sortDir,
    fetchPage,
    toggleSort,
    addUser,
    updateUser,
    deleteUser,
    togglePin,
    reorderPins,
  };
});
