import {
  bindTooltip,
  unbindTooltip,
  type TooltipBindingValue,
} from '../core/tooltip'

export function tooltip(node: HTMLElement, value: TooltipBindingValue) {
  bindTooltip(node, value)

  return {
    update(newValue: TooltipBindingValue) {
      bindTooltip(node, newValue)
    },
    destroy() {
      unbindTooltip(node)
    },
  }
}

export { bindTooltip, unbindTooltip }
