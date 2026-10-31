import React, { useEffect, useRef } from 'react'
import {
  bindTooltip,
  unbindTooltip,
  type TooltipBindingValue,
} from '../core/tooltip'

export interface TooltipProps {
  value: TooltipBindingValue
  children?: React.ReactNode
}

export function useTooltip<T extends HTMLElement>(
  value: TooltipBindingValue,
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    bindTooltip(el, value)
    return () => unbindTooltip(el)
  }, [value])

  return ref
}

export function Tooltip({ value, children }: TooltipProps) {
  const ref = useTooltip<HTMLSpanElement>(value)
  return React.createElement('span', { ref }, children)
}

export { bindTooltip, unbindTooltip }
export default Tooltip
