<script setup lang="ts">
import Task from "@/components/Task.vue";
</script>

<template>
  <main>
    <div class="flex items-center justify-center w-screen h-screen font-medium">
      <div
        class="flex flex-grow items-center justify-center bg-gray-900 h-full"
      >
        <!-- Component Start -->
        <div
          class="max-w-full p-8 bg-gray-800 rounded-lg shadow-lg w-96 text-gray-200"
        >
          <div class="flex items-center mb-6">
            <svg
              class="h-8 w-8 text-indigo-500 stroke-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h4 class="font-semibold ml-3 text-lg">Shoxruxs's Jobs</h4>
          </div>

          <Task />
        </div>
        <!-- Component End  -->
      </div>
    </div>
  </main>
</template>
