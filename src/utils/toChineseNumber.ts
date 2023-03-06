export const toChineseNumber = (num: number) => {
	const chineseNumArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
	const unitArr = ['', '十', '百', '千', '万', '亿']

	const numStr = num.toString()
	let result = ''
	let zeroFlag = true

	for (let i = 0; i < numStr.length; i++) {
		const digit = parseInt(numStr[i])
		const position = numStr.length - i - 1
		const unit = unitArr[position % 5]
		if (digit === 0) {
			zeroFlag = true
			if (position % 4 === 0 && position > 0 && result[result.length - 1] !== '零') {
				result += '零'
			}
		} else {
			if (!zeroFlag) {
				result += '零'
			}
			result += chineseNumArr[digit] + unit
			zeroFlag = false
		}
	}

	if (result[result.length - 1] === '零') {
		result = result.slice(0, result.length - 1)
	}

	return result
}
