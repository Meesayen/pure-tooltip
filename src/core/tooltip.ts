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

// CSS anchor positioning is not supported (or only partially) in some browsers
// (e.g. Safari, Firefox). Detect real support with a layout test; fall back to
// manual JS positioning when unavailable or unreliable.
const isProblematicBrowser =
  typeof navigator !== 'undefined' &&
  /Firefox|Safari/.test(navigator.userAgent) &&
  !/Chrome|Chromium|Edg/.test(navigator.userAgent)

const supportsAnchorPositioning =
  !isProblematicBrowser &&
  typeof document !== 'undefined' &&
  'anchorName' in (document.documentElement.style as any)

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
  // Hide until positioned to avoid a flash of misplaced tooltip.
  tooltip.style.opacity = '0'

  // Force override of the popover UA stylesheet (inset: 0) and disable
  // any residual CSS anchor positioning.
  tooltip.style.setProperty('position', 'fixed', 'important')
  tooltip.style.setProperty('inset', 'auto', 'important')
  tooltip.style.setProperty('position-area', 'none', 'important')
  tooltip.style.setProperty('position-try-fallbacks', 'none', 'important')
  tooltip.style.setProperty('position-anchor', 'none', 'important')
  tooltip.style.setProperty('anchor-name', 'none', 'important')

  const tr = trigger.getBoundingClientRect()
  let tw = tooltip.offsetWidth
  let th = tooltip.offsetHeight
  if (!tw || !th) {
    const r = tooltip.getBoundingClientRect()
    tw = r.width || tw
    th = r.height || th
  }
  // Last-resort estimate if the popover has no measurable size yet.
  if (!tw) tw = 120
  if (!th) th = 36

  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 8
  const margin = 8

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

  // Disable any residual CSS anchor positioning so top/left take effect.
  tooltip.style.setProperty('position-area', 'normal')
  tooltip.style.setProperty('inset', 'auto')
  tooltip.style.margin = '0'
  tooltip.style.top = `${top}px`
  tooltip.style.left = `${left}px`

  // Reveal once positioned.
  requestAnimationFrame(() => {
    tooltip.style.opacity = ''
  })
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
      if (tooltipEl) {
        // Hide before showing to avoid a flash at the stale position.
        if (!supportsAnchorPositioning) tooltipEl.style.opacity = '0'
        else tooltipEl.style.opacity = ''
      }
      tooltipEl?.showPopover()
      if (supportsAnchorPositioning) {
        tooltipArrowEl?.showPopover()
      }

      if (!supportsAnchorPositioning && tooltipEl && state.config) {
        const delays = [0, 16, 50, 100]
        const run = (i: number) => {
          const delay = delays[i] ?? 100
          setTimeout(() => {
            if (!tooltipEl) return
            const tw = tooltipEl.offsetWidth
            const th = tooltipEl.offsetHeight
            if ((tw === 0 || th === 0) && i < delays.length - 1) {
              run(i + 1)
              return
            }
            positionFallback(el, tooltipEl, state.config?.position ?? 'bottom')
          }, delay)
        }
        run(0)
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
    if (tooltipEl) tooltipEl.style.opacity = ''
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
