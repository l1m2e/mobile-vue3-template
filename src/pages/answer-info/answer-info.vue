<script lang="ts" setup>
import { urlParamsStore } from '~/store/urlParamsStore'

const socket = api.socket({ cardId: urlParamsStore.Teacher })
socket.on('onSubmitQuestion', (msg: any) => {
	console.log(msg)
})

onUnmounted(() => {
	socket.disconnect()
})
</script>

<template>
	<h1>hllo</h1>
</template>

<style lang="scss"></style>
