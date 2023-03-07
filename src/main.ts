import { createApp } from 'vue'
import router from '~/router'
import App from './App.vue'
import '~/utils/varlet'
import '@unocss/reset/tailwind-compat.css'
import './styles/main.css'
import 'uno.css'
//pc 端适配
import '@varlet/touch-emulator'

const app = createApp(App)

app.use(router)
app.mount('#app')
