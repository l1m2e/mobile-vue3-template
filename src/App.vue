<template>
	<main font-sans text="center gray-700 dark:gray-200">
		<router-view />
	</main>
</template>
<script setup>
import { useUrlSearchParams } from '@vueuse/core'
import { urlParamsStore } from '~/store/urlParamsStore'
import { setReactive } from './utils/objectTool'
//获取scoket链接
const getWebScoketBaseUrl = async () => {
	const model = import.meta.env.MODE === 'development' ? true : false
	if (model) return // 若是开发模式不需要去请求ws的路径
	const res = api.getWsLink()
	if (res.status === 200) {
		baseUrl.websocketUrl = res.data.websocketUrl
	}
}
getWebScoketBaseUrl()

//获取url上的参数 保存到全局
const urlParams = useUrlSearchParams('hash')
setReactive(urlParamsStore, urlParams)
</script>
