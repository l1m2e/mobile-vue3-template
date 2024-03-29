import { stopSign } from '../sigin-in'

export interface IStartSign {
	classRoomMac: string
	jobNum: string
	signEndTime: number
	signStartTime?: number
	wifiFlag?: boolean
}
export interface IStopSign {
	className: string
	cardId: string
}

export interface ICardId {
	cardId: string
}
