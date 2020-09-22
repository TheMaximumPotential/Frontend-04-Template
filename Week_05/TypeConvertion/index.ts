// 进制转化正则
const system: {
	[name: string]: { reg: RegExp; radix: number }
} = {
	// 二进制
	binary: { reg: /^0b([0-1]+$)/, radix: 2 },
	// 八进制
	octal: { reg: /^0o([0-7]+$)/, radix: 8 },
	// 十进制
	decimal: { reg: /^[+-]?(\d*(e\d*)?$)/, radix: 10 },
	// 十六进制
	hexadecimal: { reg: /^0h([\da-f]+$)/, radix: 16 },
}

// 十六进制转化
enum hexadecimalMap {
	a = 10,
	b = 11,
	c = 12,
	d = 13,
	e = 14,
	f = 15,
}

function StringToNumber(string: string): number {
	// 进制
	let radix: number = null
	// 数字
	let numStr: string = null
	for (let k in system) {
		if (system[k].reg.test(string)) {
			radix = system[k].radix
			string.replace(system[k].reg, (...$): string => {
				numStr = $[1]
				return ''
			})
		}
	}
	console.log('数字：', numStr)
	console.log('进制：', radix)
	if (!numStr || !radix) {
		console.log('转化失败！')
		return
	}
	const numberStrArr: string[] = numStr.split('')
	// 去除进制前面无用的0
	while (1) {
		if (numberStrArr[0] === '0') numberStrArr.shift()
		else break
	}
	const numberArr: number[] = numberStrArr
		.map((v) => {
			let code: number = v.charCodeAt(0)
			if (code >= 97 && code <= 102) {
				return hexadecimalMap[v]
			} else {
				return Number(v)
			}
		})
		.reverse()
	const len: number = numberArr.length
	let i: number = 0
	let result: number = 0
	while (i < len) {
		result += numberArr[i] * radix ** i++
	}
	console.log('数字转化结果：', result)
	return result
}

StringToNumber('0b001101') // 13
StringToNumber('0o174') // 124
StringToNumber('1024') // 1024
StringToNumber('0haaf') // 2735

function NumberToString(number: number, radix: number): string {
	let result: Array<number | string> = []
	convert(number, radix, result)
	radix === 16 &&
		(result = result.map((v) => {
			return hexadecimalMap[v] || v
		}))

	// 计算对应进制
	function convert(
		number: number,
		radix: number,
		result: Array<number | string>
	) {
		const merchant = Math.floor(number / radix)
		const remainder = number % radix
		result.unshift(remainder)
		if (merchant > 0) {
			convert(merchant, radix, result)
		}
	}
	console.log('字符串转化结果：', result.join(''))
	return result.join('')
}

NumberToString(2735, 16) // aaf
NumberToString(127, 8) // 177
NumberToString(127, 10) // 127
NumberToString(10, 2) // 1010

console.log(typeof new Number(1)) // object
console.log(typeof 1) // number
