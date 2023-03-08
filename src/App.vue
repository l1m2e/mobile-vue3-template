<template>
	<main font-sans text="center gray-700 dark:gray-200">
		<RouterView v-slot="{ Component }">
			<template v-if="Component">
				<Suspense>
					<!-- 主要内容 -->
					<component :is="Component"></component>

					<!-- 加载中状态 -->
					<template #fallback>正在加载...</template>
				</Suspense>
			</template>
		</RouterView>
		<!-- <router-view /> -->
	</main>
</template>
<script setup>
import { useUrlSearchParams } from '@vueuse/core'
import { urlParamsStore } from '~/store/urlParamsStore'
import { setReactive } from './utils/objectTool'
import { baseUrl } from './config/host'
//获取scoket链接
const getWebScoketBaseUrl = async () => {
	const res = await api.getWsLink()
	if (res.status === 200) {
		baseUrl.websocketUrl = res.data.websocketUrl
		console.log(res.data.websocketUrl)
	}
}
getWebScoketBaseUrl()

//获取url上的参数 保存到全局
const urlParams = useUrlSearchParams('hash')
setReactive(urlParamsStore, urlParams)
</script>
