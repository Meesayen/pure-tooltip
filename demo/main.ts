import { createApp } from 'vue'
import '../src/core/styles/tailwind.css'
import App from './App.vue'
import tooltip from '../src/vue/v-tooltip'

const app = createApp(App)
app.use(tooltip)
app.mount('#app')
