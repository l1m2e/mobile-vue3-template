import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Snackbar } from '@varlet/ui'
import { baseUrl } from '~/config/host'

export const request = axios.create({
	baseURL: baseUrl.httpUrl,
	timeout: 1000,
	validateStatus: (status) => status < 500
})

request.interceptors.request.use(
	function (config: AxiosRequestConfig) {
		// 在发送请求之前做些什么
		return config
	},
	function (error: AxiosError) {
		// 对请求错误做些什么
		return Promise.reject(error)
	}
)

request.interceptors.response.use(
	function (res: AxiosResponse) {
		return res
	},
	function (error) {
		// 超出 2xx 范围的状态码都会触发该函数。
		// 对响应错误做点什么
		console.log('error', error)
		if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes('timeout')) {
			Snackbar.error('连接超时,请检查网络')
		}
		return Promise.reject(error)
	}
)
