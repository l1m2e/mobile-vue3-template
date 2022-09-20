export const getUrlParams = () => {
	let url = document.location.toString()
	let arrObj = url.split('?')
	let params = Object.create(null)
	if (arrObj.length > 1) {
		arrObj = arrObj[1].split('&')
		arrObj.forEach((item: any) => {
			item = item.split('=')
			params[item[0]] = item[1]
		})
	}
	if (params.Terminalmac) {
		params.Terminalmac = decodeURIComponent(params.Terminalmac)
		params.Terminalmac = params.Terminalmac.toLowerCase() //转换成小写
	}
	return params
}
