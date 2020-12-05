let handle = null
let startX, startY
let isTap = true
let isPress = false
let isPan = false

const start = (point, context) => {
	context.startX = point.clientX
	context.startY = point.clientY
	context.isTap = true
	context.isPress = false
	context.isPan = false
	// 按压
	context.handle = setTimeout(() => {
		context.isTap = false
		context.isPress = true
		context.isPan = false
		context.handle = null
		console.log('press')
	}, 1000)
}
const move = (point, context) => {
	let dx = point.clientX - startX
	let dy = point.clientY - startY
	// 移动距离超过误差范围
	if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
		context.isPan = true
		context.isTap = false
		context.isPress = false
		clearTimeout(handle)
	}
	if (context.isPan) {
		console.log(dx, dy)
	}
}
const end = (point, context) => {
	// 点击
	if (context.isTap) {
		clearTimeout(handle)
		console.log('tapend')
	}
	// 移动
	if (context.isPan) {
		console.log('panend')
	}
	// 按压
	if (context.isPress) {
		console.log('pressend')
	}
}
const cancel = (point, context) => {
	clearTimeout(context.handle)
}

const element = document.documentElement

element.addEventListener('mousedown', () => {
	console.log('down')

	const move = () => {
		console.log('move')
	}

	const up = () => {
		console.log('up')
		element.removeEventListener('mousemove', move)
		element.removeEventListener('mouseup', up)
	}

	element.addEventListener('mouseup', up)
	element.addEventListener('mousemove', move)
})

const contexts = new Map()

element.addEventListener('touchstart', (event) => {
	for (let touch of event.changedTouches) {
		let context = Object.create(null)
		context.set(touch.identifier, context)
		start(touch, context)
	}
})

element.addEventListener('touchmove', (event) => {
	for (let touch of event.changedTouches) {
		let context = contexts.get(touch.identifier)
		move(touch, context)
	}
})

element.addEventListener('touchend', (event) => {
	for (let touch of event.changedTouches) {
		let context = contexts.get(touch.identifier)
		end(touch, context)
		contexts.delete(touch.identifier)
	}
})

element.addEventListener('touchcancel', (event) => {
	for (let touch of event.changedTouches) {
		let context = contexts.get(touch.identifier)
		cancel(touch, context)
		contexts.delete(touch.identifier)
	}
})
