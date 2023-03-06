<script lang="ts" setup>
import { urlParamsStore } from '~/store/urlParamsStore'
import { setReactive } from '~/utils'
import empty from '~/components/empty-page/index.vue'
import issueInfoPopup from './components/issue-info-popup.vue'
import richTextPicture from './components/rich-text-picture.vue'
// import dayjs from 'dayjs'
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
			getIsuueList()
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

const issueInfoPopupRef = ref()
</script>

<template>
	<var-loading description="加载中" type="rect" color="#00c48f" h-100vh :loading="loading" relative>
		<div v-if="urlParamsStore.Teacher">
			<div flex justify-between items-center py-10px px-10px border-0 border-solid border-b-1px v-for="item in issuePaging.isuueList">
				<div max-w-200px truncate text-12px>
					{{ item.title.replace(/<[^>]+>/g, '') }}
					<richTextPicture :rich-text="item.title"></richTextPicture>
				</div>
				<div>
					<var-button size="small" type="info" @click="issueInfoPopupRef.open(item.id)">详细信息</var-button>
					<var-button size="small" type="success" ml-10px>发布题目</var-button>
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
	<issueInfoPopup ref="issueInfoPopupRef"></issueInfoPopup>
</template>

<style scoped></style>
