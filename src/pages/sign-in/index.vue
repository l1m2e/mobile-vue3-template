<script lang="ts" setup>
import { getCourseInfoApi } from '~/api'
import { setReactive } from '~/utils/setReactve'
import dayjs from 'dayjs'
import manIcon from '~/assets/img/txnan.png'
import girlIcon from '~/assets/img/txnv.png'
import { IcourseInfo } from './interface'
// import { Picker, Dialog, Snackbar } from '@varlet/ui'

const ws = new WebSocket('ws://192.168.88.123:8080/IClassWebsocket/Teacher/P1000100')
// 链接成功
ws.onopen = function () {
	console.log('连接成功')
}
// 监听链接
ws.onmessage = function (e) {
	console.log('%cindex.vue line:20 e', 'color: white; background-color: #007acc;', e)
	enum MsgType {
		signRes = 'sign_change', // 签到返回
		error = 'error',
		success = 'success'
	}
	let { data: res, type } = JSON.parse(e.data)
	if (type == MsgType.signRes) {
		const item = courseInfo.stuSignAtn.find(item => item.icid === res)
		if (item) {
			item.state = 1
		}
	}
	if ((type = MsgType.success)) {
		switch (res) {
			case '发起签到成功':
				isStart.value = false
				break
			case '该课程已发起过签到':
				isStart.value = false
				break
		}
	}
}
// 链接关闭
ws.onclose = function (event) {
	console.log('链接关闭了', event)
}

const tempTime = ref(5) //默认签到时间
const columns = [[5, 10, 15, 20, 25, 30, 35]]
const isStart = ref(true)
const picker = async () => {
	await Picker({ columns, title: '请选择时间(分钟)', onConfirm })
}
const onConfirm = (e: any) => {
	tempTime.value = e[0]
	console.log(tempTime.value)
}

const courseInfo = reactive<IcourseInfo>({
	startTime: 0, //开始时间戳
	endTime: 0, // 结束时间戳
	teacherName: '', // 老师名字
	courseName: '', // 课程名字
	className: '', // 教室名字
	stuSignAtn: [] // 学生列表 包含签到状态
})

// 缺席数组
const absentArr = computed(() => courseInfo.stuSignAtn.filter(item => item.state === 0))
// 签到数组
const signInArr = computed(() => courseInfo.stuSignAtn.filter(item => item.state === 1))

const getCourseInfo = async () => {
	const params = {
		cardId: 'P1000100',
		time: '1663036678000',
		interfaceNum: '47-1'
	}
	const res = await getCourseInfoApi(params)
	setReactive(courseInfo, res)
}
getCourseInfo()

const startSignIn = () => {
	const obj = {
		type: 'startSign',
		data: {
			classRoomMac: '教室mac',
			startTime: 1663036678000,
			endTime: 1663037278000
		}
	}
	ws.send(JSON.stringify(obj))
}

const actions = {
	confirm: () => Snackbar.success('confirm'),
	cancel: () => Snackbar.error('cancel'),
	close: () => Snackbar.info('close')
}
const createAction = async () => actions[await Dialog('兰亭临帖 行书如行云流水')]()
const endSignIn = () => {
	createAction()
}
</script>

<template>
	<div w-screen h-30 p-1 color-black text-5>
		<div class="text-box">
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
		</div>
	</div>
	<div h-auto w-screen p-1>
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
	</div>
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
