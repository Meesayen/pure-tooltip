import '../src/ce'
import '../src/core/styles/tailwind.css'

const textInput = document.getElementById('ce-text') as HTMLInputElement
const posSelect = document.getElementById('ce-position') as HTMLSelectElement
const hoverPoints = Array.from(document.querySelectorAll('.ce-hover'))

function update(): void {
  hoverPoints.forEach(el => {
    el.setAttribute('text', textInput.value)
    el.setAttribute('position', posSelect.value)
  })
}

textInput.addEventListener('input', update)
posSelect.addEventListener('change', update)
update()
