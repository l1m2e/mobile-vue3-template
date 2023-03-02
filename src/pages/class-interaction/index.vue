<script lang="ts" setup>
import { urlParamsStore } from '~/store/urlParamsStore'
import { setReactive } from '~/utils'
import empty from '~/components/empty-page/index.vue'

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

// 获取问题列表
const getIsuueList = async () => {
	const res = await api.getIssueListById(preparingInfo.id)
	if (res.status === 200) {
		console.log(res)
	}
}

//空页提示信息
const emptyTitle = computed(() => {
	if (!urlParamsStore.Teacher) return '没有卡号'
	if (!preparingInfo.courseName) return '暂无课程'
	if (preparingInfo.id === 0) return '题库无数据当前课程暂未备课'
})
</script>

<template>
	<var-loading description="加载中" type="rect" color="#00c48f" h-100vh :loading="loading">
		<div v-if="urlParamsStore.Teacher"></div>
		<empty v-if="preparingInfo.id === 0" type="noData" :text="emptyTitle" z-99999></empty>
	</var-loading>
</template>

<style scoped></style>
