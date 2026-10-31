export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipConfig {
  text: string
  position?: TooltipPosition
}

export type TooltipBindingValue = string | TooltipConfig | null | undefined

export function normalizeTooltipConfig(
  value: TooltipBindingValue,
): TooltipConfig | null {
  if (value == null) return null
  if (typeof value === 'string') {
    return { text: value, position: 'bottom' }
  }
  return {
    text: value.text,
    position: value.position ?? 'bottom',
  }
}
