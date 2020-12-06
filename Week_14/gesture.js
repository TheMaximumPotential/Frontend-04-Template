class Listener {
	constructor(element, recognizer) {
		this.recognizer = recognizer
		const contexts = new Map()
		let isListenerMouse = true

		element.addEventListener('mousedown', (event) => {
			let context = Object.create(null)
			contexts.set('mouse' + (1 << event.button), context)
			recognizer.start(event, context)
			const mousemove = (event) => {
				let button = 1
				while (button <= event.buttons) {
					if (button & event.buttons) {
						let key
						if (button === 2) {
							key = 4
						} else if (button === 4) {
							key = 2
						} else {
							key = button
						}
						const context = contexts.get('mouse' + key)
						recognizer.move(event, context)
					}
					button = button << 1
				}
			}

			const mouseup = (event) => {
				const context = contexts.get('mouse' + (1 << event.button))
				recognizer.end(event, context)
				contexts.delete('mouse' + (1 << event.button))
				if (event.buttons === 0) {
					document.removeEventListener('mousemove', mousemove)
					document.removeEventListener('mouseup', mouseup)
					isListenerMouse = true
				}
			}

			if (isListenerMouse) {
				document.addEventListener('mouseup', mouseup)
				document.addEventListener('mousemove', mousemove)
				isListenerMouse = false
			}
		})

		element.addEventListener('touchstart', (event) => {
			for (let touch of event.changedTouches) {
				let context = Object.create(null)
				contexts.set(touch.identifier, context)
				recognizer.start(touch, context)
			}
		})

		element.addEventListener('touchmove', (event) => {
			for (let touch of event.changedTouches) {
				let context = contexts.get(touch.identifier)
				recognizer.move(touch, context)
			}
		})

		element.addEventListener('touchend', (event) => {
			for (let touch of event.changedTouches) {
				let context = contexts.get(touch.identifier)
				recognizer.end(touch, context)
				contexts.delete(touch.identifier)
			}
		})

		element.addEventListener('touchcancel', (event) => {
			for (let touch of event.changedTouches) {
				let context = contexts.get(touch.identifier)
				recognizer.cancel(touch, context)
				contexts.delete(touch.identifier)
			}
		})
	}
}

class Recognizer {
	constructor(dispatcher) {
		this.dispatcher = dispatcher
	}
	start(point, context) {
		context.startX = point.clientX
		context.startY = point.clientY
		context.isTap = true
		context.isPress = false
		context.isPan = false
		context.points = [
			{
				t: Date.now(),
				x: point.clientX,
				y: point.clientY,
			},
		]
		// 按压
		context.handle = setTimeout(() => {
			context.isTap = false
			context.isPress = true
			context.isPan = false
			context.handle = null
			// console.log('press')
			this.dispatcher.dispatch('press', {})
		}, 500)
	}
	move(point, context) {
		let dx = point.clientX - context.startX
		let dy = point.clientY - context.startY
		// 移动距离超过误差范围
		if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
			context.isPan = true
			context.isTap = false
			context.isPress = false
			context.isVertical = Math.abs(dx) < Math.abs(dy)
			this.dispatcher.dispatch('panstart', {
				startX: context.startX,
				startY: context.startY,
				clientX: point.clientX,
				clientY: point.clientY,
				isVertical: context.isVertical,
			})
			clearTimeout(context.handle)
		}
		if (context.isPan) {
			this.dispatcher.dispatch('pan', {
				startX: context.startX,
				startY: context.startY,
				clientX: point.clientX,
				clientY: point.clientY,
				isVertical: context.isVertical,
			})
		}
		context.points = context.points.filter(
			(point) => Date.now() - point.t < 500
		)
		context.points.push({
			t: Date.now(),
			x: point.clientX,
			y: point.clientY,
		})
	}
	end(point, context) {
		// 点击
		if (context.isTap) {
			clearTimeout(context.handle)
			this.dispatcher.dispatch('tap', {})
		}
		// 按压
		if (context.isPress) {
			this.dispatcher.dispatch('pressend', {})
		}
		context.points = context.points.filter(
			(point) => Date.now() - point.t < 500
		)
		let v = 0,
			d = 0
		if (!context.points.length) {
			v = 0
		} else {
			let p = context.points[0]
			d = Math.sqrt(
				(point.clientX - p.x) ** 2 + (point.clientY - p.y) ** 2
			)
			v = d / (Date.now() - p.t)
		}
		// 快速滑动
		if (v > 1.5) {
			this.dispatcher.dispatch('flick', {
				startX: context.startX,
				startY: context.startY,
				clientX: point.clientX,
				clientY: point.clientY,
				isVertical: context.isVertical,
				isFlick: context.isFlick,
				velocity: v,
			})
			context.isFlick = true
		} else {
			context.isFlick = false
		}
		// 移动
		if (context.isPan) {
			this.dispatcher.dispatch('panend', {
				startX: context.startX,
				startY: context.startY,
				clientX: point.clientX,
				clientY: point.clientY,
				isVertical: context.isVertical,
				isFlick: context.isFlick,
			})
		}
	}
	cancel(point, context) {
		clearTimeout(context.handle)
		this.dispatcher.dispatch('cancel', {})
	}
}

class Dispatcher {
	constructor(element) {
		this.element = element
	}
	dispatch(type, properties) {
		let event = new Event(type)
		for (let name in properties) {
			event[name] = properties[name]
		}
		this.element.dispatchEvent(event)
	}
}

export function enableGesture(element) {
	new Listener(element, new Recognizer(new Dispatcher(element)))
}
