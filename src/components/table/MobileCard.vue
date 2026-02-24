<template>
  <div
    class="bg-gray-800 rounded-xl border border-gray-700 p-4 shadow-sm transition-colors"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span
            class="text-xs font-mono bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded"
            >#{{ index + 1 }}</span
          >
          <p class="font-semibold text-gray-100 truncate">
            {{ user.username }}
          </p>
        </div>
        <p class="text-sm text-gray-400 mt-1 truncate">
          {{ user.position }}
        </p>
        <p class="text-sm text-gray-500 truncate">
          {{ user.location }}
        </p>
        <div class="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
          <span>Age {{ user.age }}</span>
          <span>·</span>
          <span>{{ user.birthdate }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-1.5 items-end shrink-0">
        <button
          @click="$emit('pin', user)"
          class="text-xs px-2.5 py-1 rounded-lg bg-amber-900/20 text-amber-400 border border-amber-900/50 hover:bg-amber-900/40 transition-colors"
        >
          📌 Pin
        </button>
        <button
          @click="$emit('edit', user)"
          class="text-xs px-2.5 py-1 rounded-lg bg-blue-900/20 text-blue-400 border border-blue-900/50 hover:bg-blue-900/40 transition-colors"
        >
          Edit
        </button>
        <button
          @click="$emit('delete', user)"
          class="text-xs px-2.5 py-1 rounded-lg bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "@/types/user";
defineProps<{ user: User; index: number }>();
defineEmits<{ edit: [User]; delete: [User]; pin: [User] }>();
</script>
