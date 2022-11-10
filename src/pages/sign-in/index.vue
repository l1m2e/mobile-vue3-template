<script lang="ts" setup>
import { setReactive } from '~/utils/setReactve'
import dayjs from 'dayjs'
import { IcourseInfo, IIoRes } from './interface'
import manIcon from '~/assets/img/txnan.png'
import girlIcon from '~/assets/img/txnv.png'
import { getUrlParams } from '~/utils/getUrlParams'

const urlParams = getUrlParams()
console.log('url参数', urlParams)

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
	teacherName: '', // 老师名字P1000100
	courseName: '',  // 课程名字
	className: '',   // 教室名字
	stuInfo: [],     // 全部学生列表
	state: '',       // 签到状态
	signEndTime: 0,  // 签到结束
	aid:0,					 // 签到id
	stuSignAts:[]    // 已经签到的学生
})

// 缺席数组
const absentArr = computed(() => courseInfo.stuInfo.filter((item) => courseInfo.stuSignAts.includes(item.studentId)))
// 签到数组
const signInArr = computed(() => courseInfo.stuInfo.filter((item) => !courseInfo.stuSignAts.includes(item.studentId)))

// 获取课程信息
const isStart = ref(true) // true 未开启签到 ，false 已开始签到
const getCourseInfo = async () => {
	const res = await api.getCourseInfoApi({ cardId: 'P1000100' }) // 老师卡号 暂时写死
	if (Object.keys(res.data).length === 0) return console.log('没课 显示没课页面')
	setReactive(courseInfo, res.data)
	isStart.value = ['未开始', '已结束'].includes(courseInfo.state)
}
getCourseInfo()

//发起签到
const startSign = async () => {
	const params = {
		classRoomMac: '22:44:84:2b:8b:70', //教室Mac 暂时写死
		jobNum: 'P1000100',
		signEndTime: +dayjs() + signTimeTimestamp.value
	}
	const res = await api.startSign(params)
	if (res.status === 400) return Snackbar.error('发起签到失败')
	Snackbar.success('发起签到成功')
	getCourseInfo()
}

// 结束签到
const endSign = async () => {
	const res = await api.stopSign({ className: courseInfo.className, cardId: 'P1000100' })
	if (res.status === 200) {
		getCourseInfo()
		Snackbar.success('结束签到成功')
	}
}

// 自动签到结束
const autoEndSign = () => {
	Snackbar.success('签到已结束')
	isStart.value = true
}

//ws
const signInIo = api.signInIo({ cardId: 'P1000100' })
//监听签到
signInIo.on('onSign', (data: IIoRes) => {
	if (data.type === 'success') {
		let isRepeat = courseInfo.stuSignAts.includes(data.message) // 判断是否已经存在 如果不存在 那么添加进数组
		if (!isRepeat) courseInfo.stuSignAts.push(data.message)
	}
})

onBeforeUnmount(() => {
	Snackbar.error('离开页面')
	// signInIo.off('onSign')
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
				<span>时间：{{ dayjs(courseInfo.startTime).format('HH:mm') }}~{{ dayjs(courseInfo.endTime).format('HH:mm') }}</span>
			</div>
		</div>
	</div>
	<div h-auto w-screen p-1>
		<div flex>
			<var-button type="primary" font-700 block flex-1 @click="picker" v-if="isStart">
				<template center>
					<div i-carbon:time></div>
					<span ml-2>签到时间</span>
					<span ml-2>{{ signTime }}分钟</span>
				</template>
			</var-button>
			<var-button type="success" font-700 block flex-1 v-else>
				<var-countdown :time="courseInfo.signEndTime - +dayjs()" format="剩余 mm 分 ss 秒" @end="autoEndSign" />
			</var-button>
			<var-button ml-1 type="success" font-700 block flex-1 @click="startSign" v-if="isStart">开始签到</var-button>
			<var-button ml-1 type="danger" font-700 block flex-1 @click="endSign" v-else>结束签到</var-button>
		</div>
		<div class="title">
			<div>总人数：{{ courseInfo.stuInfo.length }}</div>
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
