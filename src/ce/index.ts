import {
  bindTooltip,
  unbindTooltip,
  type TooltipBindingValue,
} from '../core/tooltip'

class PureTooltip extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['text', 'position']
  }

  get value(): TooltipBindingValue {
    return this.getAttribute('text')
  }

  connectedCallback(): void {
    bindTooltip(this, this.value)
  }

  disconnectedCallback(): void {
    unbindTooltip(this)
  }

  attributeChangedCallback(): void {
    if (this.isConnected) bindTooltip(this, this.value)
  }
}

if (!customElements.get('pure-tooltip')) {
  customElements.define('pure-tooltip', PureTooltip)
}

export { PureTooltip, bindTooltip, unbindTooltip }
