import type { App, Directive } from 'vue'
import {
  bindTooltip,
  unbindTooltip,
  type TooltipBindingValue,
} from '../core/tooltip'

export type TooltipDirective = Directive<HTMLElement, TooltipBindingValue>

const directive: TooltipDirective = {
  mounted(el, binding) {
    bindTooltip(el, binding.value)
  },
  updated(el, binding) {
    bindTooltip(el, binding.value)
  },
  unmounted(el) {
    unbindTooltip(el)
  },
}

export default {
  install(app: App) {
    app.directive('tooltip', directive)
  },
}
