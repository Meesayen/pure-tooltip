export { default as TooltipDirectiveTarget } from './TooltipDirectiveTarget.vue'

export * from '../core'

export { default as tooltipDirective } from './v-tooltip'
export type { TooltipDirective } from './v-tooltip'

import type { App } from 'vue'
import tooltip from './v-tooltip'

export function install(app: App) {
  app.use(tooltip)
}

export default { install }
