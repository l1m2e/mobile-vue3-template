import App from './App.vue'
import router from '~/router'
import { createApp } from 'vue'
import { getWebSoketLink } from './service'
import { getURLParams } from './store/urlParamsStore'
import '~/utils/varlet'
import '@unocss/reset/tailwind-compat.css'
import './styles/main.css'
import 'uno.css'
import '@varlet/touch-emulator' //pc端适配

getWebSoketLink()
	.then(() => {
		getURLParams()
		const app = createApp(App)
		app.use(router)
		app.mount('#app')
	})
	.catch(() => {
		console.log('获取ws连接失败')
	})
