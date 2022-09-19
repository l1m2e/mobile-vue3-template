<script lang="ts" setup>
// import { getCourseInfoApi } from '~/api'
// import { setReactive } from '~/utils/setReactve'
// import dayjs from 'dayjs'
// import { IcourseInfo, IScoketMsg } from './interface'
// import { ws } from '~/service/scoket'
// import manIcon from '~/assets/img/txnan.png'
// import girlIcon from '~/assets/img/txnv.png'

// const tempTime = ref(5) //默认签到时间
// const columns = [[5, 10, 15, 20, 25, 30, 35]]
// const picker = async () => {
// 	await Picker({ columns, title: '请选择时间(分钟)', onConfirm })
// }
// const tempTimeTimestamp = computed(() => tempTime.value * 60 * 1000)
// const onConfirm = (e: any) => {
// 	tempTime.value = e[0]
// 	console.log(tempTime.value)
// }

// const courseInfo = reactive<IcourseInfo>({
// 	startTime: 0, //开始时间戳
// 	endTime: 0, // 结束时间戳
// 	teacherName: '', // 老师名字
// 	courseName: '', // 课程名字
// 	className: '', // 教室名字
// 	stuSignAtn: [] // 学生列表 包含签到状态
// })

// // 缺席数组
// const absentArr = computed(() => courseInfo.stuSignAtn.filter(item => item.state === 0))
// // 签到数组
// const signInArr = computed(() => courseInfo.stuSignAtn.filter(item => item.state === 1))

// // 获取课程信息
// const getCourseInfo = async () => {
// 	const params = {
// 		cardId: 'P1000100',
// 		time: '1663036678000',
// 		interfaceNum: '47-1'
// 	}
// 	const res = await getCourseInfoApi(params)
// 	setReactive(courseInfo, res)
// }
// getCourseInfo()

// const { data, send } = ws('/IClassWebsocket/Teacher/P1000100')
// // 发起签到
// const isStart = ref(true)
// const startSignIn = () => {
// 	const msg = {
// 		type: 'startSign',
// 		data: {
// 			classRoomMac: '16:02:0a:0e:20:2e',
// 			signStartTime: 1663036678000,
// 			signEndTime: 166303727800
// 		}
// 	}
// 	send(msg)
// }

// // 结束签到按钮
// const endSignIn = async () => {
// 	const res = await Dialog({
// 		title: '警告',
// 		message: '是否要结束签到'
// 	})
// 	if (res == 'confirm') {
// 		Snackbar.success('签到已结束')
// 		isStart.value = true
// 	}
// }

// enum MsgType {
// 	signRes = 'sign_change', // 签到返回
// 	error = 'error', // 错误
// 	success = 'success', // 成功
// 	repeatWarning = 'repeatWarning' // 已经存在签到 签到过时 或者重复发起
// }

const test = ref({ hello: 'name' })
const change = () => {
	test.value = { hello: 'helw' }
}
watch(test, v => {
	console.log('%c监听到变更', 'color: white; background-color: #007acc;', v)
	Dialog({
		title: '警告',
		message: '是否要结束签到'
	})
})

// watch(data, (v: IScoketMsg) => {
// 	console.log('%c监听到变更', 'color: white; background-color: #007acc;', v)
// 	Dialog({
// 		title: '警告',
// 		message: '是否要结束签到'
// 	})
// 	// switch (v.type) {
// 	// 	case MsgType.signRes:
// 	// 		signChange(v.data)
// 	// 		break
// 	// 	case MsgType.error:
// 	// 		signChange(v.data)
// 	// 		break
// 	// 	case MsgType.success:
// 	// 		break
// 	// 	case MsgType.repeatWarning:
// 	// 		reSignIn()
// 	// 		break
// 	// }
// })

// const signChange = (data: string) => {
// 	const item = courseInfo.stuSignAtn.find(item => item.icid === data)
// 	if (item) {
// 		item.state = 1
// 	}
// }

// // 重新签到
// const reSignIn = () => {
// 	console.log('%cindex.vue', 'color: white; background-color: #007acc;', '进入了函数')
// 	// Dialog({
// 	// 	title: '警告',
// 	// 	message: '是否要结束签到'
// 	// })
// }

// onBeforeUnmount(() => {
// 	Snackbar.error('离开页面')
// 	console.log('%cindex.vue line:117 离开页面', 'color: #007acc;')
// })
</script>

<template>
	<div w-screen h-30 p-1 color-black text-5>
		<var-button @click="change">改变</var-button>
		<!-- <div class="text-box">
			<div class="text">
				<div i-carbon:user-speaker></div>
				<span>老师：{{ courseInfo.teacherName }}</span>
			</div>
			<div class="text">
				<div i-carbon:notebook></div>
				<span>课程：{{ courseInfo.courseName }}</span>
			</div>
		</div>
		<div class="text-box">
			<div class="text">
				<div i-carbon:calendar></div>
				<span>班级：{{ courseInfo.className }}</span>
			</div>
			<div class="text">
				<div i-carbon:time></div>
				<span> 时间：{{ dayjs(courseInfo.startTime).format('hh:mm') }}~{{ dayjs(courseInfo.endTime).format('hh:mm') }} </span>
			</div>
		</div> -->
	</div>
	<!-- <div h-auto w-screen p-1>
		<div flex>
			<var-button type="primary" font-700 block flex-1 @click="picker">
				<template center>
					<div i-carbon:time></div>
					<span ml-2> 签到时间</span>
					<span ml-2>{{ tempTime }}分钟</span>
				</template>
			</var-button>
			<var-button ml-1 type="success" font-700 block flex-1 @click="startSignIn" v-if="isStart">开始签到</var-button>
			<var-button ml-1 type="danger" font-700 block flex-1 @click="endSignIn" v-else>结束签到</var-button>
		</div>
		<div class="title">
			<div>总人数：{{ courseInfo.stuSignAtn.length }}</div>
			<div>实到人数：{{ signInArr.length }}</div>
		</div>
		<div class="content-box">
			<template v-for="item in courseInfo.stuSignAtn">
				<div v-if="item.state">
					<div center flex-col>
						<img :src="item.sex ? manIcon : girlIcon" w-10 h-10 />
						<div center text-1 mt-1>{{ item.name }}</div>
					</div>
				</div>
			</template>
		</div>
		<div class="title" center>缺席人数{{ absentArr.length }}</div>
		<div class="content-box">
			<template v-for="item in courseInfo.stuSignAtn">
				<div v-if="!item.state">
					<div center flex-col>
						<img :src="item.sex ? manIcon : girlIcon" w-10 h-10 />
						<div center text-1 mt-1>{{ item.name }}</div>
					</div>
				</div>
			</template>
		</div>
	</div> -->
</template>

<style scoped>
.text-box {
	--at-apply: w-1/1 h-1/2 flex justify-between items-center;
}

.text {
	--at-apply: center flex-1 justify-start font-700;
}

.text > span {
	--at-apply: ml-1;
}

.title {
	--at-apply: flex mt-3 h-10 bg-#116ebb color-white rounded font-700;
}

.title > div {
	--at-apply: flex-1 center;
}

.content-box {
	--at-apply: w-1/1 p-2 bg-#ebeff2 mt-2 rounded h-auto grid grid-cols-5 gap-2;
}
</style>
