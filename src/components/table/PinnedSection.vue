<template>
  <div
    v-if="pinnedRows.length > 0"
    class="border-b-2 border-amber-900/50 bg-amber-900/10 transition-colors"
  >
    <div
      class="px-4 py-1.5 text-xs font-bold text-amber-500 tracking-wide flex items-center gap-1"
    >
      <span>📌 Pinned</span>
      <span
        class="bg-amber-900/40 text-amber-400 rounded-full px-1.5 py-0.5 text-[10px]"
      >
        {{ pinnedRows.length }}
      </span>
      <span class="ml-auto text-[10px] text-amber-600 font-normal"
        >drag to reorder</span
      >
    </div>

    <!-- Desktop -->
    <div
      class="hidden md:flex flex-col text-sm border-amber-900/30 overflow-y-auto transition-all duration-300"
      :class="
        isExpanded
          ? 'max-h-[40vh] border-b'
          : 'max-h-0 border-b-0 border-transparent'
      "
    >
      <div
        v-for="row in pinnedRows"
        :key="row.id"
        draggable="true"
        class="flex items-center border-b border-amber-900/30 hover:bg-amber-900/30 cursor-grab active:cursor-grabbing transition-colors w-full"
        style="height: 48px"
        :class="{ 'opacity-50': dragId === row.id }"
        @dragstart="onDragStart(row)"
        @dragover.prevent="onDragOver(row)"
        @drop.prevent="onDrop(row)"
        @dragend="dragId = null"
      >
        <div class="w-10 px-3 shrink-0 text-amber-600 text-base">⠿</div>
        <div class="w-12 px-2 text-gray-500 font-mono text-xs"></div>
        <div class="w-[20%] px-4 truncate font-medium text-gray-100">
          {{ row.username }}
        </div>
        <div class="w-[18%] px-4 truncate text-gray-400">
          {{ row.position }}
        </div>
        <div class="w-[16%] px-4 truncate text-gray-400">
          {{ row.location }}
        </div>
        <div class="w-16 px-4 text-gray-400">{{ row.age }}</div>
        <div class="w-28 px-4 text-gray-500 text-xs">{{ row.birthdate }}</div>
        <div class="w-28 px-4 flex justify-end gap-1 shrink-0">
          <button
            @click="$emit('edit', row)"
            class="text-xs px-2 py-1 bg-gray-800 text-blue-400 rounded border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            Edit
          </button>
          <button
            @click="$emit('unpin', row)"
            class="text-xs px-2 py-1 bg-amber-900/40 text-amber-400 rounded border border-amber-900/50 hover:bg-amber-900/60 transition-colors"
          >
            Unpin
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div
      class="md:hidden space-y-1.5 overflow-y-auto transition-all duration-300"
      :class="isExpanded ? 'max-h-[40vh] p-2' : 'max-h-0 p-0'"
    >
      <div
        v-for="row in pinnedRows"
        :key="row.id"
        class="bg-gray-800 rounded-lg border border-amber-900/30 p-3 flex items-start justify-between transition-colors"
      >
        <div>
          <p class="font-semibold text-sm text-gray-100">
            {{ row.username }}
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ row.position }} · {{ row.location }}
          </p>
          <p class="text-xs text-gray-500 mt-0.5">
            Age {{ row.age }} · {{ row.birthdate }}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <button
            @click="$emit('edit', row)"
            class="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 rounded transition-colors"
          >
            Edit
          </button>
          <button
            @click="$emit('unpin', row)"
            class="text-xs px-2 py-1 bg-amber-900/30 text-amber-400 rounded transition-colors"
          >
            Unpin
          </button>
        </div>
      </div>
    </div>

    <!-- Expand/Collapse Button -->
    <div
      v-if="hasMore"
      class="flex justify-center border-t border-amber-900/20"
    >
      <button
        @click="toggleExpand"
        class="w-full py-1 text-xs text-amber-400 hover:bg-amber-900/30 transition-colors flex justify-center items-center gap-1 font-medium"
      >
        <span>{{
          isExpanded
            ? `Collapse (${pinnedRows.length})`
            : `Expand (${pinnedRows.length})`
        }}</span>
        <span class="text-[10px]">{{ isExpanded ? "▲" : "▼" }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { User } from "@/types/user";

const props = defineProps<{ pinnedRows: User[] }>();
const emit = defineEmits<{
  unpin: [user: User];
  edit: [user: User];
  reorder: [ids: number[]];
}>();

const isExpanded = ref(false);
const maxVisible = 0;

const hasMore = computed(() => props.pinnedRows.length > maxVisible);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

const dragId = ref<number | null>(null);
const dragOver = ref<number | null>(null);

function onDragStart(row: User) {
  dragId.value = row.id;
}
function onDragOver(row: User) {
  dragOver.value = row.id;
}

function onDrop(targetRow: User) {
  if (!dragId.value || dragId.value === targetRow.id) return;
  const ids = props.pinnedRows.map((r) => r.id);
  const fromIdx = ids.indexOf(dragId.value);
  const toIdx = ids.indexOf(targetRow.id);
  ids.splice(fromIdx, 1);
  ids.splice(toIdx, 0, dragId.value);
  emit("reorder", ids);
  dragId.value = null;
}
</script>
