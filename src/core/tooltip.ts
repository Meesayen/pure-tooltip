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

// CSS anchor positioning is not supported in all browsers (e.g. Safari, Firefox).
// Detect support and fall back to manual JS positioning when unavailable.
const supportsAnchorPositioning =
  typeof document !== 'undefined' &&
  'anchorName' in document.documentElement.style

// Tracks the currently visible trigger/config so the fallback can reposition on resize.
let currentTrigger: HTMLElement | null = null
let currentConfig: TooltipConfig | null = null

if (!supportsAnchorPositioning && typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (currentTrigger && currentConfig && tooltipEl) {
      positionFallback(
        currentTrigger,
        tooltipEl,
        currentConfig.position ?? 'bottom',
      )
    }
  })
}

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
    if (!supportsAnchorPositioning && tooltipArrowEl) {
      tooltipArrowEl.style.display = 'none'
    }
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

  if (!supportsAnchorPositioning && tooltipArrowEl) {
    tooltipArrowEl.style.display = 'none'
  }
}

function applyConfig(config: TooltipConfig): void {
  if (!tooltipEl || !tooltipArrowEl) return
  const textEl = tooltipEl.querySelector('#tooltip-text')
  if (textEl) textEl.textContent = config.text
  const position = config.position ?? 'bottom'
  tooltipEl.setAttribute('position', position)
  tooltipArrowEl.setAttribute('position', position)
}

// Manual positioning used when CSS anchor positioning is unavailable.
function positionFallback(
  trigger: HTMLElement,
  tooltip: HTMLElement,
  position: TooltipConfig['position'],
): void {
  const tr = trigger.getBoundingClientRect()
  const tw = tooltip.offsetWidth || tooltip.getBoundingClientRect().width
  const th = tooltip.offsetHeight || tooltip.getBoundingClientRect().height
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 8
  const margin = 4

  let place: TooltipConfig['position'] = position ?? 'bottom'

  // Flip if there is not enough space in the desired direction.
  if (place === 'top' && tr.top - th - gap < margin) place = 'bottom'
  if (place === 'bottom' && tr.bottom + th + gap > vh - margin) place = 'top'
  if (place === 'left' && tr.left - tw - gap < margin) place = 'right'
  if (place === 'right' && tr.right + tw + gap > vw - margin) place = 'left'

  let top = 0
  let left = 0

  if (place === 'top') {
    top = tr.top - th - gap
    left = tr.left + tr.width / 2 - tw / 2
  } else if (place === 'bottom') {
    top = tr.bottom + gap
    left = tr.left + tr.width / 2 - tw / 2
  } else if (place === 'left') {
    top = tr.top + tr.height / 2 - th / 2
    left = tr.left - tw - gap
  } else {
    top = tr.top + tr.height / 2 - th / 2
    left = tr.right + gap
  }

  // Clamp within the viewport.
  left = Math.max(margin, Math.min(left, vw - tw - margin))
  top = Math.max(margin, Math.min(top, vh - th - margin))

  tooltip.style.margin = '0'
  tooltip.style.top = `${top}px`
  tooltip.style.left = `${left}px`
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

    currentTrigger = el
    currentConfig = state.config

    timer = setTimeout(() => {
      tooltipEl?.showPopover()
      if (supportsAnchorPositioning) {
        tooltipArrowEl?.showPopover()
      }

      if (!supportsAnchorPositioning && tooltipEl && state.config) {
        requestAnimationFrame(() => {
          if (tooltipEl) {
            positionFallback(el, tooltipEl, state.config?.position ?? 'bottom')
          }
        })
      }

      timer = null
    }, 600)
  }

  state.mouseleave = () => {
    if (timer) clearTimeout(timer)
    observer?.unobserve(el)
    el.style.removeProperty('anchor-name')
    tooltipEl?.hidePopover()
    tooltipArrowEl?.hidePopover()
    currentTrigger = null
    currentConfig = null
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
