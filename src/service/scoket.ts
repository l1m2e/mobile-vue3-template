import { useWebSocket, UseWebSocketOptions } from '@vueuse/core'
const baseURL = 'ws://192.168.88.123:8080'
export const ws = (URL: string, options?: UseWebSocketOptions) => {
	const defaultOptions: UseWebSocketOptions = {
		onMessage(ws, event) {
			res.data.value = JSON.parse(event.data)
			console.log('输出')
		},
		onDisconnected(ws, event) {
			Snackbar.error('服务器连接失败')
		},
		autoReconnect: true
	}
	const res = useWebSocket(`${baseURL}${URL}`, { ...defaultOptions, ...options })
	// 以JSON的格式发送
	const send = (data: object | string) => {
		typeof data == 'string' ? res.send(data) : res.send(JSON.stringify(data))
	}
	return { ...res, send }
}
