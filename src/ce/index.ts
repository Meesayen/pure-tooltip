class PureTooltip extends HTMLElement {
  connectedCallback() {
    this.textContent = this.getAttribute('text') ?? ''
  }
}

if (!customElements.get('pure-tooltip')) {
  customElements.define('pure-tooltip', PureTooltip)
}

export { PureTooltip }
