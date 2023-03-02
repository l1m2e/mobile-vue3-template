import { request } from '~/service'
// 获取备课信息
export const getPreparingInfo = (jobNum: string) => request.get('/teacherClassInteract/question/getPreparing', { params: { jobNum } })
// 根据备课id 查询备课
export const getIssueListById = (id: number) => request.get(`/teacherClassInteract/question/getQuestionInfo/${id}`)
