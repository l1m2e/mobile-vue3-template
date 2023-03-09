<script lang="ts" setup>
import dayjs from 'dayjs'
import { useSocket } from '~/service'
import { setReactive } from '~/utils'

const socket = useSocket()
socket.on('onSubmitQuestion', (msg: any) => {
	console.log(msg)
})

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
	wrong: ''
})
setReactive(urlParams, useUrlSearchParams('hash'))
const emdTime = computed(() => parseInt(urlParams.endTime) - dayjs().valueOf())
onUnmounted(() => {
	socket.disconnect()
})
</script>

<template>
	<div w-95vw m-auto mt-10px h-200px text-white rounded flex box-border flex-col bg="#3a7afe" shadow-xl>
		<div flex w="100%">
			<div flex justify-center items-center min-w-30vw h="100%" p-10px flex-col>
				<var-progress mode="circle" :value="50" :size="80" ripple color="#67eaa0" track-color="#ffffff" label label-class="progress-label" />
				<p text-14px mt-10px>完成度</p>
			</div>
			<div p-10px w="100%">
				<div flex items-center justify-end mr-10px>
					<span text-17px font-600>剩余时间</span>
					<var-countdown :time="emdTime" format="mm : ss" font-700 text-20px ml-10px text="#67eaa0" />
				</div>
				<div w="100%" mt-10px>
					<var-row>
						<var-col :span="12">班级总人数: 40</var-col>
						<var-col :span="12">答题人数: 39</var-col>
					</var-row>
					<var-row mt-10px>
						<var-col :span="12">已完成人数:15</var-col>
						<var-col :span="12">未完成人数: 32</var-col>
					</var-row>
					<var-row mt-10px>
						<var-col :span="12">正确率: 80%</var-col>
					</var-row>
				</div>
			</div>
		</div>
		<var-button w="80%" m-auto mb-10px type="danger">提前结束</var-button>
	</div>
	<!-- <div bg="#116ebb" h-40px w95vw m-auto mt-30px rounded text-white leading-40px font-700>已答题</div> -->
	<div bg="#ebeff2" mt-30px p10px rounded w-95vw m-auto>
		<div text-start border=" 0 solid #3a7afe l-5px" pl-5px>已答题</div>
	</div>
</template>

<style>
.progress-label {
	font-size: 700;
	color: white;
	font-size: 16px;
}
</style>
