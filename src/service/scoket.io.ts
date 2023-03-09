import { urlParamsStore } from '~/store/urlParamsStore'
export const io = require('socket.io-client')

export let socketUrl = ''

export const useSocket = () => {
	return io(`${socketUrl}/CInteractTea`, { query: { cardId: urlParamsStore.Teacher }, transports: ['websocket'] })
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
