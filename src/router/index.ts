import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
	{
		path: '/',
		name: 'root',
		component: () => import('~/pages/index.vue')
	},
	{
		path: '/sign-in',
		name: 'sign-in',
		component: () => import('~/pages/sign-in/index.vue')
	},
	{
		path: '/class-interaction',
		name: 'class-interaction',
		component: () => import('~/pages/class-interaction/index.vue')
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

// 路由 前置守卫
router.beforeEach((to, from, next) => {
	next()
})
// 路由 后置守卫
router.afterEach(() => {})

export default router
