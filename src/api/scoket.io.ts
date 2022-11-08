import { io } from 'socket.io-client'
import host from '~/config/host'
interface ICardId {
	cardId: string
}
// 签到
export const signInIo = (cardId: ICardId) => io(`http://${host}:8999/CInteractTea`, { query: cardId, transports: ['websocket'] })
