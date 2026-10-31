# pure-tooltip

Framework-agnostic tooltip library with ready-to-use adapters for **Vue**, **React**, **Svelte** and **Custom Elements**.

Tooltip positioning is driven by CSS anchor positioning. Styles are injected by the core at runtime, so consumers do not need to configure Tailwind.

## Install

```bash
pnpm add pure-tooltip
```

Peer dependencies (all optional, install only the frameworks you use):

```bash
pnpm add vue            # for the Vue adapter
pnpm add react react-dom # for the React adapter
pnpm add svelte         # for the Svelte adapter
```

## Build

```bash
pnpm build
```

Output is written to `dist/` and exposes subpath imports for each framework (see below).

## Usage

### Core (framework-agnostic)

```ts
import { bindTooltip, unbindTooltip } from 'pure-tooltip'

const el = document.querySelector('#my-button')!
bindTooltip(el, { text: 'Hello', position: 'bottom' })

// later
unbindTooltip(el)
```

### Vue

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import tooltip from 'pure-tooltip/vue'

const app = createApp(App)
app.use(tooltip)
app.mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <TooltipDirectiveTarget />
  <button v-tooltip="'Hello from Vue'">Hover me</button>
</template>

<script setup lang="ts">
import { TooltipDirectiveTarget } from 'pure-tooltip/vue'
</script>
```

> `TooltipDirectiveTarget` renders the global `#tooltip` / `#tooltip-arrow` markup. Render it once at the app root.

### React

```tsx
import { Tooltip } from 'pure-tooltip/react'

export default function App() {
  return (
    <Tooltip value={{ text: 'Hello from React', position: 'bottom' }}>
      <button>Hover me</button>
    </Tooltip>
  )
}
```

Or use the hook directly:

```tsx
import { useTooltip } from 'pure-tooltip/react'

const ref = useTooltip<HTMLButtonElement>({ text: 'Hello', position: 'top' })
return <button ref={ref}>Hover me</button>
```

### Svelte

Using the action:

```svelte
<script lang="ts">
  import { tooltip } from 'pure-tooltip/svelte'

  let config = { text: 'Hello from Svelte', position: 'bottom' }
</script>

<button use:tooltip={config}>Hover me</button>
```

Or the component:

```svelte
<script lang="ts">
  import { Tooltip } from 'pure-tooltip/svelte'
</script>

<Tooltip text="Hello from Svelte" position="bottom">
  <button>Hover me</button>
</Tooltip>
```

### Custom Elements

```ts
import 'pure-tooltip/ce'
```

```html
<pure-tooltip text="Hello from CE" position="bottom">
  <button>Hover me</button>
</pure-tooltip>
```

The custom element is registered as `pure-tooltip` and uses its attributes (`text`, `position`) as the tooltip configuration.

## Demo

Multi-page demo is built into `docs/`:

```bash
pnpm build:demo
```

Dev servers (open the page for a specific framework):

```bash
pnpm dev:demo         # Vue
pnpm dev:demo:react   # React
pnpm dev:demo:svelte  # Svelte
pnpm dev:demo:ce      # Custom Elements
```

## Notes

- Styles are injected by the core on first use (`bindTooltip`), so no Tailwind setup is required by consumers.
- `TooltipDirectiveTarget` (Vue) renders the shared tooltip markup; render it once.
- The library is built with Vite in library mode; all framework deps are externalized as optional peers.
