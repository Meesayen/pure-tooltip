import {
  bindTooltip,
  unbindTooltip,
  type TooltipBindingValue,
} from '../core/tooltip'

class PureTooltip extends HTMLElement {
  private _value: TooltipBindingValue = null

  static get observedAttributes(): string[] {
    return ['text', 'position']
  }

  get value(): TooltipBindingValue {
    return this._value ?? this.getAttribute('text') ?? null
  }

  set value(value: TooltipBindingValue) {
    this._value = value
    if (this.isConnected) bindTooltip(this, value)
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
