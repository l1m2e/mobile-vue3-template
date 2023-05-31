<script lang="ts" setup>
const emits = defineEmits<{
	(e: 'confirm', val: { endTime: number; id: number; isAnsweringEnabled: boolean; count: number }): void
}>()

let id = 0
const show = ref(false)
const open = (num: number) => {
	show.value = true
	id = num
}
defineExpose({ open })

const isQuestionAnsweringEnabled = ref(false)

const answeringCount = ref(1)

const endTime = ref(5)
const confirm = () => {
	emits('confirm', { endTime: endTime.value, id, isAnsweringEnabled: isQuestionAnsweringEnabled.value, count: answeringCount.value })
}

const beforeClose = () => {
	endTime.value = 5
	show.value = false
}
</script>

<template>
	<var-dialog v-model:show="show" @confirm="confirm" @before-close="beforeClose" :width="320">
		<template #title>请选择结束时间</template>
		<div text-gray text-12px mt-5px mb-20px>将于{{ endTime }}分钟后结束答题</div>
		<var-slider v-model="endTime" max="60" step="5" min="5" label-visible="always" />
		<!-- 是否抢答 -->
		<div class="flex justify-between w-100%">
			<div>是否开启抢答</div>
			<var-switch v-model="isQuestionAnsweringEnabled" />
		</div>
		<div class="flex justify-between w-100% mt-10px" v-if="isQuestionAnsweringEnabled">
			<div>抢答的人数</div>
			<var-counter :rules="[(v) => v > 0 || '至少要有一个人抢答']" v-model="answeringCount" />
		</div>
	</var-dialog>
</template>
