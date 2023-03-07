import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
	presetWebFonts,
	transformerDirectives
	// transformerVariantGroup,
} from 'unocss'

export default defineConfig({
	shortcuts: [
		[
			'btn',
			'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'
		],
		[
			'icon-btn',
			'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none'
		],
		['center', 'flex justify-center items-center']
	],
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			collections: {
				carbon: () => import('@iconify-json/carbon/icons.json').then((i) => i.default)
			},
			scale: 1.2,
			warn: true
		}),
		presetWebFonts({
			fonts: {
				sans: 'DM Sans',
				serif: 'DM Serif Display',
				mono: 'DM Mono'
			}
		})
	],
	transformers: [
		transformerDirectives()
		// transformerVariantGroup(),
	]
	// theme: {
	//   colors: {
	//     'primary': '#116ebb', // 主题色 bg-primary
	//     'bg':'#ebeff2'
	//     // 'brand': {
	//     //   'primary': '#116ebb', //class="bg-brand-primary"
	//     // }
	//   },
	// }
})
