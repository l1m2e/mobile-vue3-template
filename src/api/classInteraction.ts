import { request } from '~/service'
import { IgetIssueListById } from './types'
// 获取备课信息
export const getPreparingInfo = (jobNum: string) => request.get('/teacherClassInteract/question/getPreparing', { params: { jobNum } })
// 获取问题列表 简略
export const getIssueListById = (data: IgetIssueListById) => request.get(`/teacherClassInteract/question/queryByPid`, { params: data })
// 获取问题详情
export const getIssueInfoById = (id: number) => request.get(`/teacherClassInteract/question/getQuestionInfo/${id}`)
