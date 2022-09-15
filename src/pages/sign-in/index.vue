<script lang="ts" setup>
import { getUserAtnApi, getCourseInfoApi } from '~/api'
import { setReactive } from '~/utils/setReactve'
import dayjs from 'dayjs'
import { Picker } from '@varlet/ui'
import '@varlet/ui/es/picker/style/index'
const getUserAtn = async () => {
	const res = await getUserAtnApi({ cardID: '20001' })
}
getUserAtn()
const courseInfo = reactive<IcourseInfo>({
	startTime: 0, //开始时间戳
	endTime: 0, // 结束时间戳
	teacherName: '', // 老师名字
	courseName: '', // 课程名字
	className: '', // 教室名字
	stuSignAtn: {} // 需要签到的完整学生列表
})
interface IcourseInfo {
	startTime: number
	endTime: number
	teacherName: string
	courseName: string
	className: string
	stuSignAtn: IstuSignAtn
}
interface IstuSignAtn {
	[key: number]: IstuInfo
}
interface IstuInfo {
	name: string
	sex: number
	state: number
	icid: string
}
const getCourseInfo = async () => {
	const params = {
		cardId: 'P1000100',
		time: '1663036678000',
		interfaceNum: '47-1'
	}
	const res = await getCourseInfoApi(params)
	setReactive(courseInfo, res)
	console.log('%cindex.vue line:28 res', 'color: white; background-color: #007acc;', res)
}
getCourseInfo()

const tempTime = ref(5) //默认签到时间
const columns = [[5, 10, 15, 20, 25, 30, 35]]
const picker = async () => {
	await Picker({ columns, title: '请选择时间(分钟)', onConfirm })
}
const onConfirm = (e: any) => {
	tempTime.value = e[0]
	console.log(tempTime.value)
}

const headCount = ref(0)
const absentCount = ref(0)
const signInCount = ref(0)

//发起签到
const startSignIn = () => {
	const ws = new WebSocket('ws://192.168.88.123:8080/IClassWebsocket/Teacher/P1000100')
	// 链接成功
	ws.onopen = function () {
		console.log('连接成功')
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
	// 链接关闭
	ws.onclose = function (event) {
		console.log('链接关闭了', event)
	}
	// 监听链接
	ws.onmessage = function (e) {
		enum MsgType {
			signRes = 'sign_change' // 签到返回
		}
		let data = JSON.parse(e.data)
		console.log('收到服务器信息', data)
		if (data.type == MsgType.signRes) {
			if (data.data in courseInfo.stuSignAtn) {
				console.log('设置成功')
				//@ts-ignore
				courseInfo.stuSignAtn[data.data].state = 1
				console.log(courseInfo.stuSignAtn)
			}
		}
	}
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
				<span>时间：{{ dayjs(courseInfo.startTime).format('hh:mm') }}~{{ dayjs(courseInfo.endTime).format('hh:mm') }}</span>
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
			<var-button ml-1 type="success" font-700 block flex-1 @click="startSignIn">开始签到</var-button>
		</div>
		<div class="title">
			<div>总人数：{{ headCount }}</div>
			<div>实到人数：{{ signInCount }}</div>
		</div>
		<div class="content-box">
			<template v-for="item in courseInfo.stuSignAtn">
				<div bg-red v-if="item.state">{{ item.state }}</div>
			</template>
		</div>
		<div class="title" center>缺席人数{{ absentCount }}</div>
		<div class="content-box">
			<template v-for="item in courseInfo.stuSignAtn">
				<div bg-red v-if="!item.state">{{ item.state }}</div>
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
	--at-apply: w-1/1 p-2 bg-#ebeff2 mt-1 rounded h-auto grid;
}
</style>
