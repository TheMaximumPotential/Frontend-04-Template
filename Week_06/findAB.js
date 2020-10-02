export default function findStr(str) {
	let len = str.length
	for (let i = 0; i < len; ++i) {
		if (str[i] === 'a' && str[i + 1] && str[i + 1] === 'b') {
			return true
		}
	}
	return false
}
