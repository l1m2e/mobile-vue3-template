import { setReactive } from '~/utils'
export const urlParamsStore = reactive({
	Teacher: '', // 老师工号
	Terminalmac: '' // 教室 mac
})
export const getURLParams = () => {
	//获取url上的参数 保存到全局
	const urlParams = useUrlSearchParams('hash')
	setReactive(urlParamsStore, urlParams)
}
