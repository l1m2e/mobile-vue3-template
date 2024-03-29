/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import requireTransform from 'vite-plugin-require-transform'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
	resolve: {
		alias: {
			'~/': `${path.resolve(__dirname, 'src')}/`
		}
	},
	plugins: [
		Vue({
			reactivityTransform: true
		}),
		requireTransform({ fileRegex: /.ts$|.tsx$|.vue$/ }),

		// https://github.com/hannoeru/vite-plugin-pages
		// Pages(),

		AutoImport({
			imports: ['vue', 'vue/macros', 'vue-router', '@vueuse/core', { '@varlet/ui': ['Picker', 'Dialog', 'Snackbar'], '~/api': [['*', 'api']] }],
			dts: true,
			dirs: ['./src/composables'],
			vueTemplate: true
		}),
		Components({
			resolvers: [VarletUIResolver()],
			dts: true
		}),

		// https://github.com/antfu/unocss
		// see unocss.config.ts for config
		Unocss()
	],

	// https://github.com/vitest-dev/vitest
	test: {
		environment: 'jsdom'
	},
	base: '/teacher-web'
})
