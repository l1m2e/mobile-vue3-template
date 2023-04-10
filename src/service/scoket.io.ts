import { urlParamsStore } from '~/store/urlParamsStore'
export const io = require('socket.io-client')

export let socketUrl = ''

let socket: any
export const useSocket = () => {
	if (socket) return socket
	socket = io(`${socketUrl}/CInteractTea`, { query: { cardId: urlParamsStore.Teacher }, transports: ['websocket'] })
	return socket
}

// 获取ws链接
export const getWebSoketLink = async () => {
	if (socketUrl === '') {
		const res = await api.getWsLink()
		if (res.status) {
			socketUrl = res.data.websocketUrl
		}
	}
}
