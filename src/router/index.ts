import { createRouter, createWebHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		name: 'root',
		component: () => import('~/pages/index.vue')
	},
	{
		path: '/sign-in',
		name: 'sign-in',
		component: () => import('~/pages/sign-in/sign-in.vue')
	},
	{
		path: '/issue-list',
		name: 'issue-list',
		component: () => import('~/pages/issue-list/issue-list.vue')
	},
	{
		path: '/answer-info',
		name: 'answer-info',
		component: () => import('~/pages/answer-info/answer-info.vue')
	}
]

const router = createRouter({
	history: createWebHistory('/teacher-web'),
	routes
})

// 路由 前置守卫
router.beforeEach((to, from, next) => {
	next()
})
// 路由 后置守卫
router.afterEach(() => {})

export default router
