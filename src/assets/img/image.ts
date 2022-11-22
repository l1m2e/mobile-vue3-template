import { baseUrl } from '~/config/host'

const Svg = reactive({
	noNetwork: `${baseUrl.httpUrl}/applet/image/noNetwork.svg`, // 没有网络
	error: `${baseUrl.httpUrl}/applet/image/error.svg`, // 错误
	noData: `${baseUrl.httpUrl}/applet/image/noData.svg`, // 没有数据
	noCourse: `${baseUrl.httpUrl}/applet/image/noCourse.svg`, // 没有课程
	signIn: `${baseUrl.httpUrl}/applet/image/sign-in.svg`, // 签到
	logo: `${baseUrl.httpUrl}/applet/image/logo.svg`, // 小程序图标
	state403: `${baseUrl.httpUrl}/applet/image/403.svg`, //403 无权访问
	baseAvatar: `${baseUrl.httpUrl}/applet/image/avatar/male.svg`
})

export default Svg
