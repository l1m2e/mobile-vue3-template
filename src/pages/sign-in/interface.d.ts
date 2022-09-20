import { type } from 'os'

export interface IcourseInfo {
	startTime: number
	endTime: number
	teacherName: string
	courseName: string
	className: string
	stuSignAtn: Array<IstuInfo>
	state: string
	signEndTime: number
}
interface IstuInfo {
	name: string
	sex: number
	state: number
	icid: string
}
interface IScoketMsg {
	type: string
	data: any
}
