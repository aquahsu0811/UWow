<template>
  <div class="flex flex-col h-screen bg-gray-900 transition-colors">
    <!-- Toolbar -->
    <div
      class="bg-gray-800 border-b border-gray-700 shadow-sm px-4 py-3 flex flex-col md:flex-row gap-3 transition-colors"
    >
      <div class="flex items-center gap-3 w-full">
        <div class="flex-1 relative">
          <input
            ref="searchInputRef"
            v-model="searchInput"
            @input="debouncedSearch"
            @keydown.esc="onEsc"
            placeholder="Search users... (Press '/')"
            class="w-full pl-9 pr-10 py-2 border border-gray-600 rounded-lg text-sm bg-gray-900 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <span class="absolute left-3 top-2.5 text-gray-500 text-sm">🔍</span>
          <button
            v-if="searchInput"
            @click="clearSearch"
            class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
            title="Clear search"
          >
            ✕
          </button>
        </div>
        <button
          @click="openAdd"
          class="md:hidden shrink-0 flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition-colors"
          title="Add User"
        >
          +
        </button>
      </div>

      <div class="hidden md:flex items-center gap-2 shrink-0">
        <span
          v-if="store.total > 0"
          class="text-xs text-gray-400 whitespace-nowrap"
        >
          {{ store.total.toLocaleString() }} records
        </span>
        <button
          @click="openAdd"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          + Add User
        </button>
      </div>
    </div>

    <!-- Pinned Section -->
    <PinnedSection
      :pinned-rows="store.pinned"
      @unpin="store.togglePin"
      @edit="openEdit"
      @reorder="store.reorderPins"
    />

    <!-- Desktop Table + Virtual Scroll -->
    <div class="hidden md:flex flex-col flex-1 overflow-hidden">
      <!-- Sticky header -->
      <div
        class="flex items-center bg-gray-800 border-b border-gray-700 overflow-hidden shrink-0"
      >
        <div class="w-10 px-3 py-3"></div>
        <div
          class="w-12 px-2 py-3 text-left text-sm font-semibold text-gray-300"
        >
          #
        </div>
        <SortHeader
          field="username"
          :active-sort-by="store.sortBy"
          :active-sort-dir="store.sortDir"
          @sort="store.toggleSort"
          class="w-[20%]"
          >Username</SortHeader
        >
        <SortHeader
          field="position"
          :active-sort-by="store.sortBy"
          :active-sort-dir="store.sortDir"
          @sort="store.toggleSort"
          class="w-[18%]"
          >Position</SortHeader
        >
        <SortHeader
          field="location"
          :active-sort-by="store.sortBy"
          :active-sort-dir="store.sortDir"
          @sort="store.toggleSort"
          class="w-[16%]"
          >Location</SortHeader
        >
        <SortHeader
          field="age"
          :active-sort-by="store.sortBy"
          :active-sort-dir="store.sortDir"
          @sort="store.toggleSort"
          class="w-16"
          >Age</SortHeader
        >
        <SortHeader
          field="birthdate"
          :active-sort-by="store.sortBy"
          :active-sort-dir="store.sortDir"
          @sort="store.toggleSort"
          class="w-28"
          >Birthdate</SortHeader
        >
        <div
          class="px-4 py-3 text-right text-sm font-semibold text-gray-300 w-28"
        >
          Actions
        </div>
      </div>

      <div ref="desktopScrollRef" class="flex-1 overflow-y-auto">
        <div
          v-for="(item, index) in store.rows"
          :key="item.id"
          class="flex items-center border-b border-gray-800 hover:bg-blue-50/50 hover:bg-gray-800/50 transition-colors text-sm w-full"
          style="height: 48px"
        >
          <div class="w-10 px-3 shrink-0">
            <button
              @click="store.togglePin(item)"
              title="Pin row"
              class="text-gray-500 hover:text-amber-400 transition-colors text-base"
            >
              📌
            </button>
          </div>
          <div class="w-12 px-2 text-gray-500 font-mono text-xs">
            {{ (store.page - 1) * 500 + index + 1 }}
          </div>
          <div class="w-[20%] px-4 truncate font-medium text-gray-200">
            {{ item.username }}
          </div>
          <div class="w-[18%] px-4 truncate text-gray-400">
            {{ item.position }}
          </div>
          <div class="w-[16%] px-4 truncate text-gray-400">
            {{ item.location }}
          </div>
          <div class="w-16 px-4 text-gray-400">
            {{ item.age }}
          </div>
          <div class="w-28 px-4 text-gray-500 text-xs">
            {{ item.birthdate }}
          </div>
          <div class="w-28 px-4 flex gap-1 justify-end shrink-0">
            <button
              @click="openEdit(item)"
              class="text-xs px-2 py-1 bg-gray-800 text-blue-400 rounded border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(item)"
              class="text-xs px-2 py-1 bg-gray-800 text-red-400 rounded border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              Del
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Pagination -->
      <div
        class="border-t border-gray-800 bg-gray-900 px-4 py-2 flex items-center justify-between text-xs text-gray-400 transition-colors mt-auto"
      >
        <span v-if="store.loading">Loading...</span>
        <span v-else>
          Showing page {{ store.page }} of {{ store.totalPages }} (Total
          {{ store.total }} records)
        </span>
        <div class="flex gap-2 items-center">
          <button
            @click="scrollToTop('desktop')"
            class="hidden md:flex items-center justify-center w-8 h-8 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 hover:text-gray-200 transition-colors border border-gray-700"
            title="Scroll to Top"
          >
            ↑
          </button>
          <button
            @click="scrollToBottom('desktop')"
            class="hidden md:flex items-center justify-center w-8 h-8 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 hover:text-gray-200 transition-colors border border-gray-700"
            title="Scroll to Bottom"
          >
            ↓
          </button>
          <div class="w-px h-5 bg-gray-700 mx-1"></div>
          <button
            :disabled="store.page <= 1"
            @click="store.fetchPage(store.page - 1)"
            class="hidden md:flex items-center justify-center w-8 h-8 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
            title="Previous Page"
          >
            ←
          </button>

          <button
            :disabled="store.page >= store.totalPages"
            @click="store.fetchPage(store.page + 1)"
            class="hidden md:flex items-center justify-center w-8 h-8 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
            title="Next Page"
          >
            →
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Card List -->
    <div ref="mobileScrollRef" class="md:hidden flex-1 overflow-y-auto p-3 space-y-2 flex flex-col">
      <MobileCard
        v-for="(user, index) in store.rows"
        :key="user.id"
        :user="user"
        :index="(store.page - 1) * 500 + index"
        @edit="openEdit"
        @delete="confirmDelete"
        @pin="store.togglePin"
      />
    </div>

    <!-- Mobile Pagination -->
    <div
      class="md:hidden border-t border-gray-800 bg-gray-900 p-2 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex flex-row items-center justify-between gap-2"
    >
      <button
        :disabled="store.page <= 1"
        @click="store.fetchPage(store.page - 1)"
        class="w-10 h-10 flex items-center justify-center bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 text-lg"
      >
        ←
      </button>

      <div class="flex items-center gap-2">
        <button
          @click="scrollToTop('mobile')"
          class="w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-gray-200 transition-colors border border-gray-700 text-sm"
          title="Scroll to Top"
        >
          ↑
        </button>
        <button
          @click="scrollToBottom('mobile')"
          class="w-8 h-8 flex items-center justify-center bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-gray-200 transition-colors border border-gray-700 text-sm"
          title="Scroll to Bottom"
        >
          ↓
        </button>
      </div>

      <div class="flex-1 flex flex-col items-center">
        <span class="text-xs text-gray-400">
          Page {{ store.page }} of {{ store.totalPages }}
        </span>
      </div>

      <button
        :disabled="store.page >= store.totalPages"
        @click="store.fetchPage(store.page + 1)"
        class="w-10 h-10 flex items-center justify-center bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 text-lg"
      >
        →
      </button>
    </div>

    <!-- Error banner -->
    <div
      v-if="store.error"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 shadow-lg"
    >
      {{ store.error }}
      <button
        @click="store.error = null"
        class="float-right text-red-400 hover:text-red-600"
      >
        ×
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <UserFormModal
      v-if="showModal"
      :editing-user="editingUser"
      @close="showModal = false"
      @save="handleSave"
    />

    <Teleport to="body">
      <div
        v-if="deletingUser"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-sm p-6"
        >
          <h3 class="font-semibold text-gray-100 mb-2">Confirm Delete</h3>
          <p class="text-sm text-gray-400 mb-6">
            Delete
            <strong class="text-gray-100">{{ deletingUser.username }}</strong
            >? This action cannot be undone.
          </p>
          <div class="flex gap-3 justify-end">
            <button
              @click="deletingUser = null"
              class="px-4 py-2 text-sm border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="doDelete"
              class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useUserStore } from "@/stores/userStore";
import type { User, UserPayload } from "@/types/user";
import SortHeader from "./SortHeader.vue";
import PinnedSection from "./PinnedSection.vue";
import MobileCard from "./MobileCard.vue";
import UserFormModal from "./UserFormModal.vue";

const store = useUserStore();

const searchInput = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);
const desktopScrollRef = ref<HTMLElement | null>(null);
const mobileScrollRef = ref<HTMLElement | null>(null);
const showModal = ref(false);
const editingUser = ref<User | null>(null);
const deletingUser = ref<User | null>(null);

function scrollToTop(target: "desktop" | "mobile") {
  const el = target === "desktop" ? desktopScrollRef.value : mobileScrollRef.value;
  el?.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom(target: "desktop" | "mobile") {
  const el = target === "desktop" ? desktopScrollRef.value : mobileScrollRef.value;
  el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
}

onMounted(() => {
  store.fetchPage(1);
  window.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});

function handleGlobalKeydown(e: KeyboardEvent) {
  if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
  if (e.key === "/") {
    e.preventDefault();
    searchInputRef.value?.focus();
  }
}

function clearSearch() {
  searchInput.value = "";
  store.search = "";
  store.fetchPage(1);
  searchInputRef.value?.focus();
}

function onEsc() {
  searchInput.value = "";
  store.search = "";
  store.fetchPage(1);
  searchInputRef.value?.blur();
}

const debouncedSearch = useDebounceFn(() => {
  store.search = searchInput.value;
  store.fetchPage(1);
}, 300);

function openAdd() {
  editingUser.value = null;
  showModal.value = true;
}
function openEdit(u: User) {
  editingUser.value = u;
  showModal.value = true;
}
function confirmDelete(u: User) {
  deletingUser.value = u;
}

async function doDelete() {
  if (!deletingUser.value) return;
  await store.deleteUser(deletingUser.value.id);
  deletingUser.value = null;
}

async function handleSave(data: UserPayload) {
  if (editingUser.value?.id) await store.updateUser(editingUser.value.id, data);
  else await store.addUser(data);
  showModal.value = false;
}
</script>
