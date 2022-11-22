<script lang="ts" setup>
import Svg from '~/assets/img/image'

type IEmptyType = 'noNetwork' | 'noData' | 'error'

interface Props {
	type?: IEmptyType
	text?: string
	img?: string
}
const props = withDefaults(defineProps<Props>(), {
	type: 'noData', // 类型
	img: '', // 自定义图片
	text: '' // 自定义文字
})
const emptyType = {
	noNetwork: { img: 'noNetwork', text: '网络异常' },
	noData: { img: 'noData', text: '无数据' },
	error: { img: 'error', text: '错误' }
}
const defaultInfo = computed(() => emptyType[props.type])
</script>

<template>
	<div class="w-100% center flex-col">
		<img :src="props.img ? props.img : Svg[defaultInfo.img]" alt="" class="w-100% object-contain mt-100px mb-30px" />
		<div class="text-18px color-gray">{{ props.text ? props.text : defaultInfo.text }}</div>
	</div>
</template>

<style lang="scss"></style>
