<template>
  <div
    class="cursor-pointer select-none px-4 py-3 text-left text-sm font-semibold text-gray-300 hover:bg-gray-700/50 transition-colors whitespace-nowrap flex items-center"
    @click="$emit('sort', field)"
  >
    <span class="flex items-center gap-1">
      <slot />
      <span class="text-gray-500 text-xs w-3 text-center">
        {{
          activeSortBy === field ? (activeSortDir === "asc" ? "↑" : "↓") : ""
        }}
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { SortField, SortDir } from "@/types/user";
defineProps<{
  field: SortField;
  activeSortBy: SortField;
  activeSortDir: SortDir;
}>();
defineEmits<{ sort: [field: SortField] }>();
</script>
