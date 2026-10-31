<template>
  <TooltipDirectiveTarget />
  <main class="mx-auto max-w-xl p-8">
    <h1 class="mb-4 text-2xl font-bold">Pure Tooltip Demo</h1>
    <button
      v-tooltip="'Hello from pure-tooltip'"
      class="rounded bg-blue-600 px-4 py-2 text-white"
    >
      Hover me
    </button>
  </main>
</template>

<script setup lang="ts">
import TooltipDirectiveTarget from '../src/vue/TooltipDirectiveTarget.vue'
</script>
