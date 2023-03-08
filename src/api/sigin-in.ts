import { request, io } from '~/service'
import { IStartSign, IStopSign, ICardId } from './types'
import { baseUrl } from '~/config/host'

// 获取上课信息
export const getCourseInfoApi = (data: any) => request.get('/teacherClassInteract/attendance/getCourseInfo', { params: data })
// 开始签到
export const startSign = (data: IStartSign) => request.post('/teacherClassInteract/attendance/startSign', data)
// 获取学生签到记录
export const getUserAtnApi = (data: any) => request.get('/Interact/getUserAtn', { params: data })
// 结束签到
export const stopSign = (data: IStopSign) => request.get('/teacherClassInteract/attendance/stopSign', { params: data })
// ws
export const socket = (cardId: ICardId) => io(`${baseUrl.websocketUrl}/CInteractTea`, { query: cardId, transports: ['websocket'] })
// 获取ws连接
export const getWsLink = () => request.get('/common/address')
