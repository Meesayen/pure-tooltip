<template>
  <TooltipDirectiveTarget />

  <!-- Fixed hovers: 4 corners + 4 side centers -->
  <div class="fixed top-4 left-4 z-40">
    <button
      v-tooltip="dynamicConfig"
      class="h-10 w-10 rounded bg-gray-800 text-xs text-white"
    >
      TL
    </button>
  </div>
  <div class="fixed top-4 right-4 z-40">
    <button
      v-tooltip="dynamicConfig"
      class="h-10 w-10 rounded bg-gray-800 text-xs text-white"
    >
      TR
    </button>
  </div>
  <div class="fixed bottom-4 left-4 z-40">
    <button
      v-tooltip="dynamicConfig"
      class="h-10 w-10 rounded bg-gray-800 text-xs text-white"
    >
      BL
    </button>
  </div>
  <div class="fixed bottom-4 right-4 z-40">
    <button
      v-tooltip="dynamicConfig"
      class="h-10 w-10 rounded bg-gray-800 text-xs text-white"
    >
      BR
    </button>
  </div>
  <div class="fixed top-4 left-1/2 z-40 -translate-x-1/2">
    <button
      v-tooltip="dynamicConfig"
      class="h-10 w-10 rounded bg-gray-800 text-xs text-white"
    >
      T
    </button>
  </div>
  <div class="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
    <button
      v-tooltip="dynamicConfig"
      class="h-10 w-10 rounded bg-gray-800 text-xs text-white"
    >
      B
    </button>
  </div>
  <div class="fixed top-1/2 left-4 z-40 -translate-y-1/2">
    <button
      v-tooltip="dynamicConfig"
      class="h-10 w-10 rounded bg-gray-800 text-xs text-white"
    >
      L
    </button>
  </div>
  <div class="fixed top-1/2 right-4 z-40 -translate-y-1/2">
    <button
      v-tooltip="dynamicConfig"
      class="h-10 w-10 rounded bg-gray-800 text-xs text-white"
    >
      R
    </button>
  </div>

  <!-- Configuratore al centro totale -->
  <section class="flex min-h-screen items-center justify-center px-4 py-24">
    <div
      class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
    >
      <h1 class="mb-4 text-xl font-bold">Pure Tooltip Demo</h1>

      <p class="mb-4 text-sm text-gray-600">
        This tooltip auto-repositions based on the available space around its
        trigger. Hover over the buttons at the corners and edges of the viewport
        to see how it moves to stay fully visible.
      </p>

      <div class="mb-4">
        <label class="mb-1 block text-sm font-medium">Position</label>
        <select
          v-model="position"
          class="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="top">top</option>
          <option value="bottom">bottom</option>
          <option value="left">left</option>
          <option value="right">right</option>
        </select>
      </div>

      <div class="mb-6">
        <label class="mb-1 block text-sm font-medium">Text</label>
        <input
          v-model="text"
          type="text"
          class="w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <p class="mb-3 text-sm text-gray-600">
        The fixed hover triggers across the viewport use the configuration
        above.
      </p>

      <!-- Griglia delle permutazioni statiche -->
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="cfg in staticConfigs"
          :key="cfg.position"
          v-tooltip="cfg"
          class="rounded bg-blue-600 px-3 py-2 text-sm text-white"
        >
          {{ cfg.position }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TooltipDirectiveTarget from '../src/vue/TooltipDirectiveTarget.vue'

type Position = 'top' | 'bottom' | 'left' | 'right'

const position = ref<Position>('bottom')
const text = ref('Configurable tooltip')

const dynamicConfig = computed(() => ({
  text: text.value,
  position: position.value,
}))

const staticConfigs: { text: string; position: Position }[] = [
  { text: 'Tooltip on top', position: 'top' },
  { text: 'Tooltip on bottom', position: 'bottom' },
  { text: 'Tooltip on left', position: 'left' },
  { text: 'Tooltip on right', position: 'right' },
]
</script>
