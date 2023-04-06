export interface IcourseInfo {
	startTime: number
	endTime: number
	teacherName: string
	courseName: string
	className: string
	stuInfo: Array<IstuInfo>
	state: string
	signStartTime: number
	signEndTime: number
	aid: number
	stuSignAts: Array<string>
}
export interface IIoRes {
	message: any
	type: string
}
interface IstuInfo {
	studentId: string
	sex: number
	name: string
}
