const model = import.meta.env.MODE === 'development' ? true : false
let baseURL = '120.76.223.28:8086/'
if (!model) {
	baseURL = `${window.location.host}`
}
export default baseURL
