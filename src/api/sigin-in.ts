import axios from '~/service/http'

// 获取学生签到记录
export const getUserAtnApi = (data: any) => axios.get('/Interact/getUserAtn', { params: data })
