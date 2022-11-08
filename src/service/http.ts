import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import host from '~/config/host'
const baseURL = `http://${host}:8080/`

const request = axios.create({
	baseURL: baseURL,
	timeout: 1000
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
		console.log(error)
		return Promise.reject(error)
	}
)

export default request
