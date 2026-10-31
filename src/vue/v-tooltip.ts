import type { App, Directive } from 'vue'

interface Config {
  text: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

export type TooltipDirective = Directive<
  HTMLElement,
  string | Config | undefined | null
>

let tooltip: HTMLElement | null = null
let tooltipArrow: HTMLElement | null = null
let timer: ReturnType<typeof setTimeout> | null = null
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      if (timer) clearTimeout(timer)
      tooltip!.hidePopover()
      tooltipArrow!.hidePopover()
    }
  })
})

const map = new WeakMap<
  HTMLElement,
  {
    mouseenter: () => void
    mouseleave: () => void
  }
>()

function createMouseEnter(el: HTMLElement, textOrConfig: string | Config) {
  return () => {
    if (timer) clearTimeout(timer)
    observer.observe(el)
    el.style.setProperty('anchor-name', '--tooltip-toggle')
    if (typeof textOrConfig === 'string') {
      tooltip!.querySelector('#tooltip-text')!.textContent = textOrConfig
      tooltip!.setAttribute('position', 'bottom')
      tooltipArrow!.setAttribute('position', 'bottom')
    } else {
      tooltip!.querySelector('#tooltip-text')!.textContent = textOrConfig.text
      tooltip!.setAttribute('position', textOrConfig.position || 'bottom')
      tooltipArrow!.setAttribute('position', textOrConfig.position || 'bottom')
    }
    timer = setTimeout(() => {
      tooltip!.showPopover()
      tooltipArrow!.showPopover()
      timer = null
    }, 600)
  }
}
function createMouseLeave(el: HTMLElement) {
  return () => {
    if (timer) clearTimeout(timer)
    observer.unobserve(el)
    el.style.removeProperty('anchor-name')
    tooltip!.hidePopover()
    tooltipArrow!.hidePopover()
  }
}

function addListeners(el: HTMLElement, textOrConfig: string | Config) {
  const mouseenter = createMouseEnter(el, textOrConfig)
  const mouseleave = createMouseLeave(el)
  el.addEventListener('mouseenter', mouseenter)
  el.addEventListener('mouseleave', mouseleave)
  map.set(el, { mouseenter, mouseleave })
}

function maybeRemoveListeners(el: HTMLElement) {
  if (map.has(el)) {
    const { mouseenter, mouseleave } = map.get(el)!
    el.removeEventListener('mouseenter', mouseenter)
    el.removeEventListener('mouseleave', mouseleave)
  }
}

const directive: TooltipDirective = {
  mounted(el, binding) {
    if (!tooltip) {
      tooltip = document.querySelector('#tooltip')
      tooltipArrow = document.querySelector('#tooltip-arrow')
    }

    maybeRemoveListeners(el)

    const config = binding.value
    if (!config) return

    addListeners(el, config)
  },
  updated(el, binding) {
    maybeRemoveListeners(el)
    const config = binding.value
    if (!config) return

    addListeners(el, config)
  },
  unmounted(el) {
    if (timer) clearTimeout(timer)
    maybeRemoveListeners(el)
    map.delete(el)
    observer.unobserve(el)
    tooltip!.hidePopover()
    tooltipArrow!.hidePopover()
  },
}

export default {
  install(app: App) {
    app.directive('tooltip', directive)
  },
}
