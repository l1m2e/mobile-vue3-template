<script lang="ts" setup>
import { urlParamsStore } from '~/store/urlParamsStore'
import { setReactive, richTextFilterText } from '~/utils'
import { useRouter } from 'vue-router'
import empty from '~/components/empty-page/index.vue'
import issueInfoPopup from './components/issue-info-popup.vue'
import richTextPicture from './components/rich-text-picture.vue'
import pushIssueDialog from './components/push-issue-dialog.vue'
import dayjs from 'dayjs'

// 课程信息对象
const preparingInfo = reactive({
	classDeviceName: '', // 教室
	className: '', // 班级名称
	classRoomMac: '', // 教室mac
	courseHour: 0, // 课时
	courseName: '', // 课程名称
	createdTimestamp: 0, // 开始时间戳
	id: 0, // 备课id
	jobNum: '', // 老师工号
	teacherName: '', // 老师名称
	title: '课程名称1',
	updateTimestamp: 0 // 修改时间戳
})

// 获取课程信息
const loading = ref(false)
const getPreparingInfo = async () => {
	if (!urlParamsStore.Teacher) return
	loading.value = true
	const res = await api.getPreparingInfo(urlParamsStore.Teacher)
	if (res.status === 200) {
		setReactive(preparingInfo, res.data)
		if (preparingInfo.id) {
			await getIsuueList()
			await getTasklog(preparingInfo.id)
		}
	}
	loading.value = false
}
getPreparingInfo()

const issuePaging = reactive<{ current: number; pages: number; isuueList: Array<any> }>({
	current: 1,
	pages: 1,
	isuueList: []
})

// 获取问题列表
const getIsuueList = async () => {
	const res = await api.getIssueListById({ pid: preparingInfo.id, type: '', current: issuePaging.current, size: 20 })
	if (res.status === 200) {
		issuePaging.isuueList = res.data.records
	}
}

//空页提示信息
const emptyTitle = computed(() => {
	if (!urlParamsStore.Teacher) return '没有卡号'
	if (!preparingInfo.courseName) return '暂无课程'
	if (preparingInfo.id === 0) return '题库无数据当前课程暂未备课'
})

//发布问题
const pushIssue = async (sid: number, endTime: number) => {
	const params = {
		pid: preparingInfo.id,
		sid,
		endTime,
		jobNum: preparingInfo.jobNum,
		type: 2
	}
	const res = await api.pushIssue(params)
	if (res.status === 200) {
		getTasklog(preparingInfo.id)
	} else {
		Snackbar.error('发布问题失败')
	}
}

const pushIssueDialogConfirm = (confirmInfo: { id: number; endTime: number }) => {
	const startTimestamp = dayjs().valueOf()
	const endTimestamp = startTimestamp + confirmInfo.endTime * 60000
	pushIssue(confirmInfo.id, endTimestamp)
}
const pushIssueDialogRef = ref()
const issueInfoPopupRef = ref()

const snackbarShow = computed({
	get() {
		return tasklog.value.length === 0 ? false : true
	},
	set(value) {
		return value
	}
})
const tasklog = ref<Array<any>>([])

//获取任务记录进行中
const TasklogEndTime = ref(0)
const getTasklog = async (pid: number) => {
	const res = await api.getTasklogById({ pid, timeType: 2 })
	if (res.status === 200) {
		tasklog.value = res.data
		const timeOut = Math.abs(dayjs().valueOf() - res.data[0].endTime)
		TasklogEndTime.value = timeOut
		setTimeout(() => {
			tasklog.value = []
		}, timeOut)
	} else {
		tasklog.value = []
	}
}

const router = useRouter()
const goToAnswerInfoPage = () => {
	router.push('/answer-info')
}
</script>

<template>
	<var-loading description="加载中" type="rect" color="#00c48f" h-100vh :loading="loading" relative>
		<div v-if="urlParamsStore.Teacher">
			<div flex justify-between items-center py-10px px-10px border-0 border-solid border-b-1px v-for="item in issuePaging.isuueList">
				<div max-w-200px truncate text-12px>
					{{ richTextFilterText(item.title) }}
					<richTextPicture :rich-text="item.title"></richTextPicture>
				</div>
				<div>
					<var-button size="small" type="info" @click="issueInfoPopupRef.open(item.id)">详细信息</var-button>
					<var-button size="small" type="success" :disabled="snackbarShow" ml-10px @click="pushIssueDialogRef.open(item.id)">发布题目</var-button>
				</div>
			</div>
		</div>
		<empty
			v-if="preparingInfo.id === 0"
			type="noData"
			:text="emptyTitle"
			w-100
			h-100vh
			z-99999
			absolute
			top-0
			left-0
			bottom-0
			right-0
			bg-white></empty>
	</var-loading>
	<pushIssueDialog ref="pushIssueDialogRef" @confirm="pushIssueDialogConfirm"></pushIssueDialog>
	<issueInfoPopup ref="issueInfoPopupRef"></issueInfoPopup>
	<var-snackbar v-model:show="snackbarShow" position="bottom" :duration="Infinity">
		<div>
			<span>您有一个已发布的任务</span>
			<div flex>
				<span>将于</span>
				<var-countdown :time="TasklogEndTime" format="mm分ss秒" class="text-green font-700 mx-4px" />
				<span>后结束</span>
			</div>
		</div>
		<template #action>
			<var-button type="success" @click="goToAnswerInfoPage">查看</var-button>
		</template>
	</var-snackbar>
</template>
