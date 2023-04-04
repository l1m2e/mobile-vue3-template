import { request } from '~/service'
import { IgetIssueListById, IPushParams, IQuestlogById } from './types'
// 获取备课信息
export const getPreparingInfo = (jobNum: string) => request.get('/teacherClassInteract/question/getPreparing', { params: { jobNum } })
// 获取问题列表 简略
export const getIssueListById = (data: IgetIssueListById) => request.get(`/teacherClassInteract/question/queryByPid`, { params: data })
// 获取问题详情
export const getIssueInfoById = (id: number) => request.get(`/teacherClassInteract/question/getQuestionInfo/${id}`)
// 发布问题或者测验
export const pushIssue = (data: IPushParams) => request.post('/teacherClassInteract/question/push', data)
// 根据备课id查询任务记录
export const getTasklogById = (data: IQuestlogById) => request.get('/teacherClassInteract/question/queryPreLogByPid', { params: data })
// 结束任务
export const stopTask = (id: string, jobNum: string) => request.get(`/teacherClassInteract/question/stopTask?id=${id}&jobNum=${jobNum}`)
// 获取已答题的列表
export const queryAnswerInfoByTaskId = (id: number | string) => request.get(`/teacherClassInteract/question/queryByQlid?plid=${id}`)
