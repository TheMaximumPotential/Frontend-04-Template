// const UTF_Encodeing = (string) => {
// 	let code = encodeURI(string)
// 	console.log(code, code.length)
// 	let codeList = []
// 	let i = 0
// 	while (i < code.length) {
// 		if (code[i] === '%') {
// 			codeList.push(parseInt(code[i + 1] + code[i + 2], 16))
// 			i += 3
// 		} else {
// 			codeList.push(code[i].charCodeAt())
// 			i++
// 		}
// 	}
// 	return Buffer.from(codeList)
// }
// console.log(UTF_Encodeing('今天天气不错'))

class Dog {
	constructor(name) {
		this.name = '狗'
	}
}

class Human {
	hurt(obj) {
		console.log(`我被${obj.name}伤害了`)
	}
}

const dog = new Dog()
const me = new Human()

me.hurt(dog)
