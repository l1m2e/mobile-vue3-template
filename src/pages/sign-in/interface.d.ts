export interface IcourseInfo {
	startTime: number
	endTime: number
	teacherName: string
	courseName: string
	className: string
	stuSignAtn: Array<IstuInfo>
}
interface IstuInfo {
	name: string
	sex: number
	state: number
	icid: string
}
