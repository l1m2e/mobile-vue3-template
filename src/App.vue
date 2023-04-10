<script setup>
import { getCourseInfo, courseInfoStore, urlParamsStore } from '~/store'
import { useSocket } from './service'

// 进入页面连接websocket 在ws 连接成功的情况下 请求课程信息 如果有课程 信息 自动加入房间 并且将课程信息存入 courseInfoStore
const socket = useSocket()
socket.on('connect', getCourseInfo)
</script>

<template>
	<main font-sans text="center gray-700 dark:gray-200">
		<router-view />
	</main>
</template>
