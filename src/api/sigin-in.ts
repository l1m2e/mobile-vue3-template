import axios from "~/service/http";

// 获取上课信息
export const getCourseInfoApi = (data: any) =>
  axios.get("/Interact/getCourseInfo", { params: data });
// 获取学生签到记录
export const getUserAtnApi = (data: any) =>
  axios.get("/Interact/getUserAtn", { params: data });
