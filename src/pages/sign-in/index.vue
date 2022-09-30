<script lang="ts" setup>
import { getCourseInfoApi } from '~/api'
import { setReactive } from '~/utils/setReactve'
import dayjs from 'dayjs'
import { IcourseInfo, IScoketMsg } from './interface'
import { ws } from '~/service/scoket'
import manIcon from '~/assets/img/txnan.png'
import girlIcon from '~/assets/img/txnv.png'
import { getUrlParams } from '~/utils/getUrlParams'

const urlParams = getUrlParams()
console.log(urlParams)
const signTime = ref(5) //默认签到时间
const columns = [[5, 10, 15, 20, 25, 30, 35]]
const picker = async () => {
	await Picker({ columns, title: '请选择时间(分钟)', onConfirm })
}
const signTimeTimestamp = computed(() => signTime.value * 60 * 1000)
const onConfirm = (e: any) => {
	signTime.value = e[0]
	console.log(signTime.value)
}

//prettier-ignore
const courseInfo = reactive<IcourseInfo>({
	startTime: 0,    // 开始时间戳
	endTime: 0,      // 结束时间戳
	teacherName: '', // 老师名字
	courseName: '',  // 课程名字
	className: '',   // 教室名字
	stuSignAtn: [],  // 学生列表 包含签到状态
	state: '',       // 签到状态
	signEndTime: 0   // 签到结束
})

// 缺席数组
const absentArr = computed(() => courseInfo.stuSignAtn.filter(item => item.state === 1))
// 签到数组
const signInArr = computed(() => courseInfo.stuSignAtn.filter(item => item.state === 0))

// 获取课程信息
const isStart = ref(true) // true 未开启签到 ，false 已开始签到
const getCourseInfo = async () => {
	const params = {
		cardId: 'admin',
		time: +dayjs(),
		interfaceNum: '47-1'
	}
	const res = await getCourseInfoApi(params)
	if (Object.keys(res).length === 0) {
		console.log('没课 显示没课页面')
	}
	setReactive(courseInfo, res)
	isStart.value = ['未开始', '已结束'].includes(courseInfo.state)
}
getCourseInfo()

// webscoket
const { data, send } = ws('/IClassWebsocket/Teacher/admin')

watch(data, (v: IScoketMsg) => {
	console.log('%c监听到变更', 'color: white; background-color: #007acc;', v)
	switch (v.type) {
		case 'sign_change':
			signChange(v.data)
			break
		case 'successSign':
			startSignInSuccess()
			break
		case 'error':
			msgError(v.data)
			break
		case 'success':
			break
		case 'repeatWarning':
			reSignIn()
			break
	}
})

// 发起签到
const startSignIn = (e: any, type = 'startSign') => {
	const msg = {
		type,
		data: {
			classRoomMac: '16:02:0a:0e:20:2e',
			signStartTime: +dayjs(),
			signEndTime: +dayjs() + signTimeTimestamp.value
		}
	}
	send(msg)
}

const startSignInSuccess = () => {
	getCourseInfo()
	Snackbar.success('发起签到成功')
}
// 重新签到
const reSignIn = async () => {
	const res = await Dialog({
		title: '警告',
		message: '重新发起需要学生重新签到'
	})
	if (res == 'confirm') {
		startSignIn(null, 'startSignCoerce') // 发起签到强制
		isStart.value = false
	}
}

// 结束签到按钮
const endSignIn = async () => {
	const res = await Dialog({
		title: '警告',
		message: '是否要结束签到'
	})
	if (res == 'confirm') {
		const msg = {
			type: 'endSign',
			data: {
				startTime: courseInfo.startTime
			}
		}
		send(msg)
		Snackbar.success('签到已结束')
		isStart.value = true
	}
}

// 自动签到结束
const autoEndSign = () => {
	Snackbar.success('签到已结束')
	isStart.value = true
}

// 学生签到触发
const signChange = (data: string) => {
	const item = courseInfo.stuSignAtn.find(item => item.icid === data)
	if (item) {
		item.state = 0
	}
}

const msgError = (e: string) => {
	Snackbar.error(e)
}

onBeforeUnmount(() => {
	Snackbar.error('离开页面')
	console.log('%cindex.vue line:117 离开页面', 'color: #007acc;')
})
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
				<span> 时间：{{ dayjs(courseInfo.startTime).format('HH:mm') }}~{{ dayjs(courseInfo.endTime).format('HH:mm') }} </span>
			</div>
		</div>
	</div>
	<div h-auto w-screen p-1>
		<div flex>
			<var-button type="primary" font-700 block flex-1 @click="picker" v-if="isStart">
				<template center>
					<div i-carbon:time></div>
					<span ml-2> 签到时间</span>
					<span ml-2>{{ signTime }}分钟</span>
				</template>
			</var-button>
			<var-button type="success" font-700 block flex-1 v-else>
				<var-countdown :time="courseInfo.signEndTime - +dayjs()" format="剩余 mm 分 ss 秒" @end="autoEndSign" />
			</var-button>
			<var-button ml-1 type="success" font-700 block flex-1 @click="startSignIn" v-if="isStart">开始签到</var-button>
			<var-button ml-1 type="danger" font-700 block flex-1 @click="endSignIn" v-else>结束签到</var-button>
		</div>
		<div class="title">
			<div>总人数：{{ courseInfo.stuSignAtn.length }}</div>
			<div>实到人数：{{ signInArr.length }}</div>
		</div>
		<div class="content-box">
			<div center flex-col v-for="item in signInArr">
				<img :src="item.sex ? manIcon : girlIcon" w-10 h-10 />
				<div center text-1 mt-1>{{ item.name }}</div>
			</div>
		</div>
		<div class="title" center>缺席人数{{ absentArr.length }}</div>
		<div class="content-box">
			<div center flex-col v-for="item in absentArr">
				<img :src="item.sex ? manIcon : girlIcon" w-10 h-10 />
				<div center text-1 mt-1>{{ item.name }}</div>
			</div>
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
