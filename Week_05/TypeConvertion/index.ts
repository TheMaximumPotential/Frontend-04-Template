// 进制转化正则
const system: {
	[name: string]: { reg: RegExp; radix: number }
} = {
	// 二进制
	binary: { reg: /^([+-]?)0b([1-2]+$)/, radix: 2 },
	// 八进制
	octal: { reg: /^([+-]?)0o([1-7]+$)/, radix: 8 },
	// 十进制
	decimal: { reg: /^([+-]?)(\d*(e\d*)?$)/, radix: 10 },
	// 十六进制
	hexadecimal: { reg: /^([+-]?)0x([\da-f]+$)/, radix: 16 },
}

// 十六进制转化
const hexadecimalMap = {
	a: 10,
	b: 11,
	c: 12,
	d: 13,
	e: 14,
	f: 15,
}

function stringToNumber(string: string): number {
	// 进制
	let radix: number = null
	// 数字
	let numStr: string = null
	// 符号
	let sign: string = null
	for (let k in system) {
		if (system[k].reg.test(string)) {
			radix = system[k].radix
			string.replace(system[k].reg, (...$): string => {
				sign = $[1] || '+'
				numStr = $[2]
				return ''
			})
		}
	}
	console.log('数字：', numStr)
	console.log('符号：', sign)
	console.log('进制：', radix)
	const numberArr: number[] = numStr
		.split('')
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
	console.log('转化结果：', sign === '+' ? result : -result)
	return result
}

stringToNumber('-1024')

function numberToString(number: number): string {
	return ''
}
