<script lang="ts" setup>
const props = defineProps<{
	richText: string
}>()

//将富文本转换成dom获取img中的src属性
const imageList = computed(() => {
	const parser = new DOMParser()
	const doc = parser.parseFromString(props.richText, 'text/html')
	return Array.from(doc.querySelectorAll('img')).map((img) => img.getAttribute('src')) as string[]
})
const show = ref(false)
const imageTagCLick = () => {
	show.value = true
}
</script>

<template>
	<var-chip color="#00968820" text-color="#009688" v-if="imageList.length !== 0" size="small" @click="imageTagCLick">图片</var-chip>
	<var-popup v-model:show="show">
		<var-swipe class="swipe-example">
			<var-swipe-item v-for="item in imageList">
				<img class="swipe-example-image" :src="item" />
			</var-swipe-item>
		</var-swipe>
	</var-popup>
</template>
<style scoped>
.swipe-example {
	height: 200px;
	width: 90vw;
}

.swipe-example-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	pointer-events: none;
}
</style>
