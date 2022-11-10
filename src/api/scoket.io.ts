import host from '~/config/host'
const io = require('socket.io-client')
interface ICardId {
	cardId: string
}
// 签到
export const signInIo = (cardId: ICardId) => io(`http://${host}:8998/CInteractTea`, { query: cardId, transports: ['websocket'] })
