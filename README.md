# pure-tooltip

Framework-agnostic tooltip library with ready-to-use adapters for **Vue**, **React**, **Svelte** and **Custom Elements**.

Tooltip positioning is driven by CSS anchor positioning. Styles are injected by the core at runtime, so consumers do not need to configure Tailwind.

## Install

This package is published on [GitHub Packages](https://github.com/Meesayen/pure-tooltip/packages).

```bash
pnpm add @meesayen/pure-tooltip
```

GitHub Packages requires configuring the registry for the `@meesayen` scope. Add the following to your project (or user) `.npmrc`:

```ini
@meesayen:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<GITHUB_TOKEN>
```

`<GITHUB_TOKEN>` must be a GitHub personal access token with `read:packages` scope (and `write:packages` if you publish).

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

Live demo: https://meesayen.github.io/pure-tooltip/index.html

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

## Browser compatibility

| Feature                          | Chrome / Edge | Safari                  | Firefox                 |
| -------------------------------- | ------------- | ----------------------- | ----------------------- |
| Tooltip rendering                | ✅            | ✅                      | ✅                      |
| CSS anchor positioning           | ✅ (native)   | ❌ (JS fallback)        | ❌ (JS fallback)        |
| Auto-reposition on open          | ✅ (native)   | ✅ (JS flip)            | ✅ (JS flip)            |
| Auto-reposition on scroll/resize | ✅ (native)   | ⚠️ (hides on scroll)    | ⚠️ (hides on scroll)    |
| Arrow indicator                  | ✅            | ❌ (hidden in fallback) | ❌ (hidden in fallback) |

Browsers without CSS anchor positioning support use a JavaScript fallback that
positions the tooltip on open with viewport-flip and clamping. The arrow
indicator is hidden in fallback mode.

## Notes

- Styles are injected by the core on first use (`bindTooltip`), so no Tailwind setup is required by consumers.
- `TooltipDirectiveTarget` (Vue) renders the shared tooltip markup; render it once.
- The library is built with Vite in library mode; all framework deps are externalized as optional peers.
