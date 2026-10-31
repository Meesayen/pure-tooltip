import {
  normalizeTooltipConfig,
  type TooltipBindingValue,
  type TooltipConfig,
} from './types'

import tooltipCss from './tooltip.css?inline'

let stylesInjected = false

function injectStyles(): void {
  if (stylesInjected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.setAttribute('data-pure-tooltip', '')
  style.textContent = tooltipCss
  document.head.appendChild(style)
  stylesInjected = true
}

let tooltipEl: HTMLElement | null = null
let tooltipArrowEl: HTMLElement | null = null
let timer: ReturnType<typeof setTimeout> | null = null

const observer =
  typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            if (timer) clearTimeout(timer)
            tooltipEl?.hidePopover()
            tooltipArrowEl?.hidePopover()
          }
        })
      })
    : null

interface BindingState {
  mouseenter: () => void
  mouseleave: () => void
  config: TooltipConfig | null
}

const map = new WeakMap<HTMLElement, BindingState>()

function ensureElements(): void {
  if (typeof document === 'undefined') return

  if (!tooltipEl) {
    tooltipEl = document.querySelector('#tooltip')
    tooltipArrowEl = document.querySelector('#tooltip-arrow')
  }

  if (tooltipEl && tooltipArrowEl) {
    injectStyles()
    return
  }

  injectStyles()

  const wrapper = document.createElement('div')
  wrapper.innerHTML = `
    <div id="tooltip-arrow" popover="manual" anchor="tooltip-toggle" class="arrow isolate bg-transparent"></div>
    <div id="tooltip" popover="manual" anchor="tooltip-toggle" class="max-h-50 w-fit overflow-visible rounded-md bg-slate-900 px-3 py-2 text-center leading-3 text-white text-sm">
      <span id="tooltip-text" class="type-label-sm whitespace-pre"></span>
    </div>
  `
  while (wrapper.firstChild) {
    document.body.appendChild(wrapper.firstChild)
  }

  tooltipEl = document.querySelector('#tooltip')
  tooltipArrowEl = document.querySelector('#tooltip-arrow')
}

function applyConfig(config: TooltipConfig): void {
  if (!tooltipEl || !tooltipArrowEl) return
  const textEl = tooltipEl.querySelector('#tooltip-text')
  if (textEl) textEl.textContent = config.text
  const position = config.position ?? 'bottom'
  tooltipEl.setAttribute('position', position)
  tooltipArrowEl.setAttribute('position', position)
}

export function bindTooltip(el: HTMLElement, value: TooltipBindingValue): void {
  ensureElements()

  const config = normalizeTooltipConfig(value)

  const existing = map.get(el)
  if (existing) {
    existing.config = config
    return
  }

  const state: BindingState = {
    config,
    mouseenter: () => {},
    mouseleave: () => {},
  }

  state.mouseenter = () => {
    if (timer) clearTimeout(timer)
    observer?.observe(el)
    el.style.setProperty('anchor-name', '--tooltip-toggle')
    if (state.config) applyConfig(state.config)
    timer = setTimeout(() => {
      tooltipEl?.showPopover()
      tooltipArrowEl?.showPopover()
      timer = null
    }, 600)
  }

  state.mouseleave = () => {
    if (timer) clearTimeout(timer)
    observer?.unobserve(el)
    el.style.removeProperty('anchor-name')
    tooltipEl?.hidePopover()
    tooltipArrowEl?.hidePopover()
  }

  el.addEventListener('mouseenter', state.mouseenter)
  el.addEventListener('mouseleave', state.mouseleave)
  map.set(el, state)
}

export function unbindTooltip(el: HTMLElement): void {
  const state = map.get(el)
  if (!state) return

  if (timer) clearTimeout(timer)
  el.removeEventListener('mouseenter', state.mouseenter)
  el.removeEventListener('mouseleave', state.mouseleave)
  observer?.unobserve(el)
  el.style.removeProperty('anchor-name')
  tooltipEl?.hidePopover()
  tooltipArrowEl?.hidePopover()
  map.delete(el)
}

export function mountTooltip(): void {
  ensureElements()
}

export { normalizeTooltipConfig }
export type {
  TooltipBindingValue,
  TooltipConfig,
  TooltipPosition,
} from './types'
