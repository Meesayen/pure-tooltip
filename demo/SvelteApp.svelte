<script lang="ts">
  import { tooltip } from '../src/svelte/tooltip'

  type Position = 'top' | 'bottom' | 'left' | 'right'

  let position = $state<Position>('bottom')
  let text = $state('Configurable tooltip')

  let dynamicConfig = $derived({ text, position })

  const staticConfigs: { text: string; position: Position }[] = [
    { text: 'Tooltip on top', position: 'top' },
    { text: 'Tooltip on bottom', position: 'bottom' },
    { text: 'Tooltip on left', position: 'left' },
    { text: 'Tooltip on right', position: 'right' },
  ]
</script>

<div class="fixed top-4 left-4 z-40">
  <button use:tooltip={dynamicConfig} class="h-10 w-10 rounded bg-gray-800 text-xs text-white">TL</button>
</div>
<div class="fixed top-4 right-4 z-40">
  <button use:tooltip={dynamicConfig} class="h-10 w-10 rounded bg-gray-800 text-xs text-white">TR</button>
</div>
<div class="fixed bottom-4 left-4 z-40">
  <button use:tooltip={dynamicConfig} class="h-10 w-10 rounded bg-gray-800 text-xs text-white">BL</button>
</div>
<div class="fixed bottom-4 right-4 z-40">
  <button use:tooltip={dynamicConfig} class="h-10 w-10 rounded bg-gray-800 text-xs text-white">BR</button>
</div>
<div class="fixed top-4 left-1/2 z-40 -translate-x-1/2">
  <button use:tooltip={dynamicConfig} class="h-10 w-10 rounded bg-gray-800 text-xs text-white">T</button>
</div>
<div class="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
  <button use:tooltip={dynamicConfig} class="h-10 w-10 rounded bg-gray-800 text-xs text-white">B</button>
</div>
<div class="fixed top-1/2 left-4 z-40 -translate-y-1/2">
  <button use:tooltip={dynamicConfig} class="h-10 w-10 rounded bg-gray-800 text-xs text-white">L</button>
</div>
<div class="fixed top-1/2 right-4 z-40 -translate-y-1/2">
  <button use:tooltip={dynamicConfig} class="h-10 w-10 rounded bg-gray-800 text-xs text-white">R</button>
</div>

<section class="flex min-h-screen items-center justify-center px-4 py-24">
  <div class="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
    <h1 class="mb-4 text-xl font-bold">Svelte Demo</h1>

    <div class="mb-4">
      <label class="mb-1 block text-sm font-medium">Position</label>
      <select bind:value={position} class="w-full rounded border border-gray-300 px-3 py-2">
        <option value="top">top</option>
        <option value="bottom">bottom</option>
        <option value="left">left</option>
        <option value="right">right</option>
      </select>
    </div>

    <div class="mb-6">
      <label class="mb-1 block text-sm font-medium">Text</label>
      <input bind:value={text} type="text" class="w-full rounded border border-gray-300 px-3 py-2" />
    </div>

    <p class="mb-3 text-sm text-gray-600">
      Gli hover fissi sul viewport usano la configurazione sopra.
    </p>

    <div class="grid grid-cols-2 gap-3">
      {#each staticConfigs as cfg (cfg.position)}
        <button use:tooltip={cfg} class="rounded bg-blue-600 px-3 py-2 text-sm text-white">
          {cfg.position}
        </button>
      {/each}
    </div>
  </div>
</section>
