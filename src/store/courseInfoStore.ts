import { setReactive } from '~/utils'
import { urlParamsStore } from './urlParamsStore'

export const courseInfoStore = reactive({
	/** 课程名称 */
	courseName: '',
	/** 上课时间戳 */
	startTime: 0,
	/** 下课时间戳 */
	endTime: 0,
	/** 当前课时 */
	courseHour: 0,
	/** 老师名称 */
	teacherName: '',
	/** 班级名称 */
	className: '',
	/** 课程索引 sid */
	sid: '',
	/** 教师mac */
	classDeviceMac: '',
	/** 学生列表 */
	classList: new Array<any>()
})

export const useIssueId = useStorage('issueId', 0)

/** 获取课程信息 */
export const getCourseInfo = async () => {
	const res = await api.getCourseInfo(urlParamsStore.Teacher)
	if (res.status === 200) {
		setReactive(courseInfoStore, res.data)
		getClassList()
	} else {
		Snackbar.error('获取课程信息失败')
	}
}

/** 获取学生列表 */
export const getClassList = async () => {
	const res = await api.getClassList(courseInfoStore.className)
	if (res.status === 200) {
		courseInfoStore.classList = res.data
	}
}
