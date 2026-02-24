<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/50 bg-black/70 flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div
        class="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transition-colors border-gray-700"
      >
        <div
          class="flex items-center justify-between px-6 py-4 border-gray-700"
        >
          <h2 class="text-base font-semibold text-gray-100">
            {{ editingUser ? "Edit User" : "Add New User" }}
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-200 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submit" class="p-6 space-y-4">
          <div v-for="field in formFields" :key="field.key">
            <label
              class="block text-sm font-medium text-gray-300 mb-1"
            >
              {{ field.label }}
            </label>
            <input
              v-model="form[field.key]"
              :type="field.type"
              :min="field.min"
              :max="field.max"
              required
              class="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div class="flex gap-3 justify-end pt-2">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {{ editingUser ? "Update" : "Add User" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import type { User, UserPayload } from "@/types/user";

const props = defineProps<{ editingUser: User | null }>();
const emit = defineEmits<{ close: []; save: [data: UserPayload] }>();

const formFields = [
  { key: "username" as const, label: "Username", type: "text" },
  { key: "position" as const, label: "Position", type: "text" },
  { key: "location" as const, label: "Location", type: "text" },
  { key: "age" as const, label: "Age", type: "number", min: "1", max: "120" },
  { key: "birthdate" as const, label: "Birthdate", type: "date" },
];

const form = reactive<UserPayload>({
  username: "",
  position: "",
  location: "",
  age: 0,
  birthdate: "",
});

watch(
  () => props.editingUser,
  (u) => {
    if (u) {
      Object.assign(form, {
        username: u.username,
        position: u.position,
        location: u.location,
        age: u.age,
        birthdate: u.birthdate,
      });
    } else {
      Object.assign(form, {
        username: "",
        position: "",
        location: "",
        age: 0,
        birthdate: "",
      });
    }
  },
  { immediate: true },
);

function submit() {
  emit("save", { ...form });
}
</script>
