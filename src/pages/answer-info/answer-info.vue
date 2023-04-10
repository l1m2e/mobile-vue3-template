<script lang="ts" setup>
import dayjs from 'dayjs'
import { useSocket } from '~/service'
import { setReactive, getKeysObjec } from '~/utils'
import manIcon from '~/assets/img/txnan.png'
import girlIcon from '~/assets/img/txnv.png'
import { courseInfoStore } from '~/store'

//获取url传递过来的参数
const urlParams = reactive({
	/** 答题总人数 */
	count: '',
	/** 结束时间 */
	endTime: '',
	/** 任务id */
	id: '',
	/** 回答正确的人数 */
	just: '',
	/** 可抢答人数 */
	signCount: '',
	/** 开始时间 */
	startTime: '',
	/** 问题类型 */
	type: '',
	/** 未批改人数 */
	uncorrected: '',
	/** 回答错误的人数 */
	wrong: '',
	/** 老师工号 */
	Teacher: '',
	/** 班级名称 */
	className: ''
})
setReactive(urlParams, useUrlSearchParams('hash'))

const emdTime = computed(() => parseInt(urlParams.endTime) - dayjs().valueOf()) // 结束时间
const answeredList = ref<Array<any>>([]) //答题列表
// 未答题列表
const unansweredStudents = computed(() =>
	courseInfoStore.classList.filter((item) => !answeredList.value.map((item) => item.studentId).includes(item.studentId))
)
//正确的列表
const correctPercent = computed(() => {
	const trueCount = answeredList.value.filter((item) => item.resultFlag).length
	return trueCount === 0 ? 0 : (trueCount / answeredList.value.length) * 100
})

//获取已答题列表
const getAnswerInfo = async () => {
	const res = await api.queryAnswerInfoByTaskId(urlParams.id)
	if (res.status === 200) {
		answeredList.value = res.data
	}
}
getAnswerInfo()

// webSocket 监听
const socket = useSocket()

socket.on('onSubmitQuestion', (res: any) => {
	const data = JSON.parse(res.data)
	if (!answeredList.value.includes(data.studentId)) {
		answeredList.value.push(data)
	}
})

//关闭按钮
const stopTaskButoon = async () => {
	const res = await api.stopTask(urlParams.id, urlParams.Teacher)
	urlParams.endTime = dayjs().valueOf().toString()
	if (res.status === 200) {
		Snackbar.success('提前结束任务成功')
	} else {
		Snackbar.error('提前结束任务失败')
	}
}

//倒计时结束跳回页面
const router = useRouter()
const countDownEnd = () => {
	const params = getKeysObjec(urlParams, ['Teacher'])
	router.push({ path: '/issue-list', query: params })
}

//离开页面
onUnmounted(() => {
	socket.disconnect()
})
</script>

<template>
	<div w-95vw m-auto mt-10px h-200px text-white rounded flex box-border flex-col bg="#3a7afe" shadow-xl>
		<div flex w="100%">
			<div flex justify-center items-center min-w-30vw h="100%" p-10px flex-col>
				<var-progress
					mode="circle"
					:value="(answeredList.length / courseInfoStore.classList.length) * 100"
					:size="80"
					ripple
					color="#67eaa0"
					track-color="#ffffff"
					label
					label-class="progress-label" />
				<p text-14px mt-10px>完成度</p>
			</div>
			<div p-10px w="100%">
				<div flex items-center justify-end mr-10px>
					<span text-17px font-600>剩余时间</span>
					<var-countdown :time="emdTime" @end="countDownEnd" format="mm : ss" font-700 text-20px ml-10px text="#67eaa0" />
				</div>
				<div w="100%" mt-10px>
					<var-row>
						<var-col :span="12">班级总人数: {{ courseInfoStore.classList.length }}</var-col>
						<var-col :span="12">正确率: {{ correctPercent }}%</var-col>
					</var-row>
					<var-row mt-20px>
						<var-col :span="12">已完成人数:{{ answeredList.length }}</var-col>
						<var-col :span="12">未完成人数: {{ unansweredStudents.length }}</var-col>
					</var-row>
				</div>
			</div>
		</div>
		<var-button w="80%" m-auto mb-10px type="danger" @click="stopTaskButoon">提前结束</var-button>
	</div>
	<div class="stuBox">
		<div text-start border=" 0 solid #3a7afe l-5px" pl-5px>已答题</div>
		<div w="100%" p-2 bg="#ebeff2" mt-2 rounded grid grid-cols-5 gap-2>
			<div center flex-col v-for="item in answeredList">
				<img :src="item.sex ? manIcon : girlIcon" w-10 h-10 />
				<div center text-1 mt-1>{{ item.studentName }}</div>
			</div>
		</div>
	</div>
	<div class="stuBox">
		<div text-start border=" 0 solid #3a7afe l-5px" pl-5px>未答题</div>
		<div w="100%" p-2 bg="#ebeff2" mt-2 rounded grid grid-cols-5 gap-2>
			<div center flex-col v-for="item in unansweredStudents">
				<img :src="item.sex ? manIcon : girlIcon" w-10 h-10 />
				<div center text-1 mt-1>{{ item.name }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.progress-label {
	font-size: 700;
	color: white;
	font-size: 16px;
}
.stuBox {
	background-color: #ebeff2;
	margin: 30px auto;
	border-radius: 5px;
	width: 95vw;
	padding: 10px;
}
</style>
