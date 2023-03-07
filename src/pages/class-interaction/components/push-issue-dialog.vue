<script lang="ts" setup>
const emits = defineEmits(['confirm'])
let id = 0
const show = ref(false)
const open = (num: number) => {
	show.value = true
	id = num
}
defineExpose({ open })

const endTime = ref(10)
const confirm = () => {
	emits('confirm', { endTime: endTime.value, id })
}

const beforeClose = () => {
	endTime.value = 10
	show.value = false
}
</script>

<template>
	<var-dialog v-model:show="show" @confirm="confirm" @before-close="beforeClose">
		<template #title>请选择结束时间</template>
		<div text-gray text-12px mt-5px mb-20px>将于{{ endTime }}分钟后结束答题</div>
		<var-slider v-model="endTime" max="60" step="5" min="10" label-visible="always" />
	</var-dialog>
</template>
