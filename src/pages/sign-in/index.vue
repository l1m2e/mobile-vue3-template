<script lang="ts" setup>
import { getUserAtnApi } from '~/api'
const msg = $ref('hello')
const fn = async () => {
	const param = {
		cardID: '20001'
	}
	const res = await getUserAtnApi(param)
	console.log(res)
}
fn()
</script>

<template>
	<div btn @click="toggleDark()">{{ msg }}</div>
</template>

<style scoped></style>
