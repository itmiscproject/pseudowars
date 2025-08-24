import { createApp } from 'vue'
import App from './App.vue'  // Usually your root component
import router from './router/index.js'

const app = createApp(App)
app.use(router)
app.mount('#app')
