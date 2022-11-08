const model = import.meta.env.MODE === 'development' ? true : false
let baseURL = '192.168.88.123'
if (!model) {
	baseURL = `${window.location.hostname}`
}
export default baseURL
