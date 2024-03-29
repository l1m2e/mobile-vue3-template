<script lang="ts" setup>
import { setReactive } from '~/utils/objectTool'
import { urlParamsStore } from '~/store'
import { useSocket } from '~/service'
import dayjs from 'dayjs'
import { IIoRes } from './interface'
import manIcon from '~/assets/img/txnan.png'
import girlIcon from '~/assets/img/txnv.png'
import empty from '~/components/empty-page/index.vue'
import { courseInfoStore } from '~/store'

/** 签到状态 */
const sginInState = reactive({
	/** 开始签到时间 */
	signStartTime: 0,
	/** 结束签到时间 */
	signEndTime: 0,
	/** 签到状态 */
	state: '',
	/** 签到学生列表 */
	stuSignAts: new Array<any>()
})

// 获取签到状态
const getSginInState = async () => {
	const res = await api.getSginInList(urlParamsStore.Teacher)
	if (res.status === 200) {
		setReactive(sginInState, res.data)
	}
}
getSginInState()

const absentArr = computed(() => courseInfoStore.classList.filter((item) => !sginInState.stuSignAts.includes(item.studentId))) // 缺席数组
const signInArr = computed(() => courseInfoStore.classList.filter((item) => sginInState.stuSignAts.includes(item.studentId))) // 签到数组
const isStart = computed(() => ['未开始', '已结束'].includes(sginInState.state)) // true 未开启签到 ，false 已开始签到
const isWifiCheck = ref(true) // 默认开启wifi校验
const signTime = ref(5) //默认签到时间
const signTimeTimestamp = computed(() => signTime.value * 60 * 1000)
const columns = [[5, 10, 15, 20, 25, 30, 35]] //可选签到时间列表

const picker = async () => {
	await Picker({ columns, title: '请选择时间(分钟)', onConfirm })
}

const onConfirm = (e: any) => {
	signTime.value = e[0]
	console.log(signTime.value)
}

//发起签到
const startSign = async (retroactive: boolean = false) => {
	const params = {
		classRoomMac: urlParamsStore.Terminalmac, //教室Mac
		jobNum: urlParamsStore.Teacher, // 老师是工号
		signEndTime: dayjs().valueOf() + signTimeTimestamp.value,
		wifiFlag: isWifiCheck.value,
		...(retroactive && { signStartTime: sginInState.signStartTime }) //判断是否为补签
	}

	const res = await api.startSign(params)
	if (res.status === 400) return Snackbar.error('发起签到失败')
	Snackbar.success('发起签到成功')
	getSginInState()
}

// 结束签到
const endSign = async () => {
	const res = await api.stopSign({ className: courseInfoStore.className, cardId: urlParamsStore.Teacher })
	if (res.status === 200) {
		getSginInState()
		Snackbar.success('结束签到成功')
	}
}

// 自动签到结束
const autoEndSign = () => {
	Snackbar.success('签到已结束')
	sginInState.state = '已结束'
}

//连接ws
const socket = useSocket()

//监听签到
socket.on('onSign', (data: IIoRes) => {
	console.log(data)
	if (data.type === 'success') {
		let isRepeat = sginInState.stuSignAts.includes(data.message) // 判断是否已经存在 如果不存在 那么添加进数组
		if (!isRepeat) sginInState.stuSignAts.push(data.message)
	}
})

onBeforeUnmount(() => {
	Snackbar.error('离开页面')
	socket.disconnect()
})
</script>

<template>
	<empty v-if="!urlParamsStore.Teacher" type="error" text="没有卡号"></empty>
	<empty v-else-if="!urlParamsStore.Terminalmac" type="error" text="没有MAC"></empty>
	<empty v-else-if="!courseInfoStore.className" text="暂无课程"></empty>
	<div v-else>
		<div w-screen h-30 p-1 color-black text-5>
			<div class="text-box">
				<div class="text">
					<div i-carbon:user-speaker></div>
					<span>老师：{{ courseInfoStore.teacherName }}</span>
				</div>
				<div class="text">
					<div i-carbon:notebook></div>
					<span>课程：{{ courseInfoStore.courseName }}</span>
				</div>
			</div>
			<div class="text-box">
				<div class="text">
					<div i-carbon:calendar></div>
					<span>班级：{{ courseInfoStore.className }}</span>
				</div>
				<div class="text">
					<div i-carbon:time></div>
					<span>时间：{{ dayjs(courseInfoStore.startTime).format('HH:mm') }}~{{ dayjs(courseInfoStore.endTime).format('HH:mm') }}</span>
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
					<var-countdown :time="sginInState.signEndTime - dayjs().valueOf()" format="剩余 mm 分 ss 秒" @end="autoEndSign" />
				</var-button>
				<div v-if="isStart" flex flex-1>
					<var-button
						ml-1
						type="success"
						font-700
						block
						flex-1
						@click="() => (['未开始'].includes(sginInState.state) ? startSign() : startSign(true))">
						{{ ['未开始'].includes(sginInState.state) ? '开始签到' : '补签' }}
					</var-button>
					<var-button ml-1 type="success" font-700 block flex-1 @click="startSign()" v-if="!['未开始'].includes(sginInState.state)">
						重新签到
					</var-button>
				</div>
				<var-button ml-1 type="danger" font-700 block flex-1 @click="endSign" v-else>结束签到</var-button>
			</div>
			<var-button m-auto mt-10px :type="isWifiCheck ? 'warning' : 'success'" font-700 block flex-1 @click="isWifiCheck = !isWifiCheck">
				{{ isWifiCheck ? '已开启 wifi 校验' : '已关闭 wifi 校验' }}
			</var-button>
			<div class="title">
				<div>总人数：{{ courseInfoStore.classList.length }}</div>
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
