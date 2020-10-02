console.log(generator('aaabababx', 'abababx'))
// 好吧我这个是每个字符生成一个状态机，我知道写的不对，但KMP我到现在还是搞不懂是咋弄的
function generator(target, str) {
	let fnArr = new Array(str.length)
	for (let i = fnArr.length - 1; i > 0; --i) {
		if (i === fnArr.length - 1) {
			fnArr[i] = function (s) {
				if (s === str[i]) {
					return end
				}
				return start(s)
			}
		} else {
			fnArr[i] = function (s) {
				if (s === str[i]) {
					return fnArr[i + 1]
				}
				return start(s)
			}
		}
	}
	function start(s) {
		if (s === s[0]) {
			return fnArr[1]
		}
		return start
	}
	function end() {
		return end
	}
	function match(target) {
		let state = start
		for (let s of target) {
			state = state(s)
		}
		return state === end
	}
	return match(target)
}
