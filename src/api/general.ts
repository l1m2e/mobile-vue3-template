// 获取ws连接
import { request } from '~/service'

// 获取ws 连接
export const getWsLink = () => request.get('/common/address')

/** 加入房间 */
export const joinRoom = (data: { cardid: string; className: string }) => request.get('/teacherClassInteract/attendance/join', { params: data })

// 获取上课信息
export const getCourseInfo = (cardId: string) => request.get(`/teacherClassInteract/common/getCourseInfo?cardId=${cardId}`)

// 获取学生列表
export const getClassList = (className: string) => request.get(`/teacherClassInteract/common/getClassList?className=${className}`)
