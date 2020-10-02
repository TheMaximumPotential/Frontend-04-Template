export default function findStr(str) {
	const target = 'abcdef'
	outer: for (let i = 0; i < str.length; ++i) {
		if (str[i] === target[0]) {
			for (let j = 0; j < target.length; ++j) {
				if (str[i + j] !== target[j]) {
					continue outer
				}
				if (j === target.length - 1) {
					return true
				}
			}
		}
	}
	return false
}
