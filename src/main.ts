import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'
import '~/utils/varlet'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
//pc 端适配
import '@varlet/touch-emulator'

const app = createApp(App)
const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes
})
app.use(router)
app.mount('#app')
