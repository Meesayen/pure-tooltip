import { createApp } from 'vue'
import App from './App.vue'
import tooltip from '../src/vue/v-tooltip'

const app = createApp(App)
app.use(tooltip)
app.mount('#app')
