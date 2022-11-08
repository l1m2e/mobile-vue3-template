import axios from '~/service/http'
import { IStartSign } from './types'
// 获取上课信息
export const getCourseInfoApi = (data: any) => axios.get('/teacherClassInteract/attendance/getCourseInfo', { params: data })
// 开始签到
export const startSign = (data: IStartSign) => axios.post('/teacherClassInteract/attendance/startSign', data)
// 获取学生签到记录
export const getUserAtnApi = (data: any) => axios.get('/Interact/getUserAtn', { params: data })
// 结束签到
export const stopSign = (data: any) => axios.get('/teacherClassInteract/attendance/stopSign', { params: data })
