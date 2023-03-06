<script setup lang="ts">
import { ref } from 'vue'
import { setReactive, toChineseNumber } from '~/utils'
const show = ref(false)
const open = (id: number) => {
	show.value = true
	getIssueInfo(id)
}
defineExpose({ open })

// prettier-ignore
const issueInfo = reactive({
	analysis: '',                                           // 答案解析
	answer: new Array<string>(),                            // 答案数组
	choices: new Array<{ unique: string; text: string }>(), // 选项
	createdTimestamp: 0,                                    // 创建时间戳
	id: 0,                                                  // 问题id
	shareFlag: false,                                       // 是否共享
	srcId: new Array<number>(),                             // 附件id
	teacherName: '',                                        // 老师名称
	title: '',                                              // 标题
	type: 0                                                 // 类型
})

//获取问题详情
const getIssueInfo = async (id: number) => {
	const res = await api.getIssueInfoById(id)
	if (res.status === 200) {
		setReactive(issueInfo, res.data)
		console.log(issueInfo)
	}
}
</script>

<template>
	<var-popup v-model:show="show" position="bottom">
		<div p-10px box-border pt-0 w-100vw h-70vh text-start relative>
			<div text-center sticky top-0 left-0 right-0 p-10px bg-white>
				{{ ['', '选择题', '填空题', '简答题', '判断题', '多选题'][issueInfo.type] }}
			</div>
			<h1 class="title" style="margin-top: 0px">题目描述</h1>
			<div class="card">
				<div v-html="issueInfo.title"></div>
			</div>
			<!-- 选择题 -->
			<template v-if="[1, 5].includes(issueInfo.type)">
				<h1 class="title">题目选项</h1>
				<div class="card">
					<div v-for="item in issueInfo.choices" mt-20px first:mt-0>
						<div class="py-5px border-l-5px border-blue bg-#116ebb10">
							<span ml-8px font-700>{{ item.unique }}</span>
						</div>
						<div mt-10px>
							<div v-html="item.text"></div>
						</div>
					</div>
				</div>
			</template>
			<h1 class="title">答案</h1>
			<div class="card">
				<div v-if="[1, 5].includes(issueInfo.type)">
					<div>{{ issueInfo.answer.join(',') }}</div>
				</div>
				<div v-if="issueInfo.type === 2">
					<div v-for="(item, index) in issueInfo.answer" mt-10px>
						<span>第{{ toChineseNumber(index + 1) }}空</span>
						<span ml-10px>{{ item }}</span>
					</div>
				</div>
				<div v-if="issueInfo.type === 3">
					<div v-html="issueInfo.answer"></div>
				</div>
				<div v-if="issueInfo.type === 4">
					{{ issueInfo.answer[0] === 'A' ? '对' : '错' }}
				</div>
			</div>
			<h1 class="title">答案解析</h1>
			<div class="card">
				<div v-html="issueInfo.analysis"></div>
			</div>
			<footer class="h-100px w-100%"></footer>
		</div>
	</var-popup>
</template>
<style scoped>
.card {
	--at-apply: p-10px box-border bg-gray-1 mt-10px rounded;
}
.title {
	--at-apply: font-700 mt-30px;
}
</style>
