import { Component } from './framework'
import { TimeLine, Animation } from './animation'
import { enableGesture } from './gesture'
import { liner } from './cubicBezier'

class Carousel extends Component {
	constructor() {
		super()
		this.attributes = Object.create(null)
	}
	setAttribute(name, value) {
		this.attributes[name] = value
	}
	mountTo(parent) {
		parent.appendChild(this.render())
	}
	render() {
		let src = this.attributes.src
		this.root = document.createElement('div')
		this.root.classList.add('carousel')
		for (let url of src) {
			// 为什么不用 img 呢，因为 img 默认是可拖动的，会影响效果。
			let div = document.createElement('div')
			div.style.backgroundImage = `url(${url})`
			this.root.appendChild(div)
		}

		enableGesture(this.root)
		let timeLine = new TimeLine()
		timeLine.start()
		let children = this.root.children
		let position = 0
		let handler = null
		let t = 0
		let ax = 0

		this.root.addEventListener('start', (event) => {
			timeLine.pause()
			clearInterval(handler)
			if (t) {
				let progress = (Date.now() - t) / 1500
				ax = liner(progress) * 200 - 200
			}
		})

		this.root.addEventListener('pan', (event) => {
			let x = event.clientX - event.startX - ax
			let current = position - (x - (x % 200)) / 200
			for (let offset of [-1, 0, 1]) {
				let pos = current + offset
				pos =
					((pos % children.length) + children.length) %
					children.length
				children[pos].style.transition = 'none'
				children[pos].style.transform = `translateX(${
					-pos * 200 + offset * 200 + (x % 200)
				}px)`
			}
		})
		this.root.addEventListener('end', (event) => {
			// 时间线重置
			timeLine.reset()
			// 时间线启动
			timeLine.start()
			// 开启动画
			handler = setInterval(nextGesture, 3000)
			let x = event.clientX - event.startX - ax
			let current = position - (x - (x % 200)) / 200
			let direction = Math.round((x % 200) / 200)
			if (event.isFlick) {
				console.log('flick')
				if (event.velocity < 0) {
					direction = Math.ceil((x % 200) / 200)
				} else {
					direction = Math.floor((x % 200) / 200)
				}
			}

			for (let offset of [-1, 0, 1]) {
				let pos = current + offset
				pos =
					((pos % children.length) + children.length) %
					children.length
				children[pos].style.transition = 'none'
				timeLine.add(
					new Animation(
						children[pos].style,
						'transform',
						-pos * 200 + offset * 200 + (x % 200),
						-pos * 200 + offset * 200 + direction * 200,
						1500,
						0,
						liner,
						(v) => `translateX(${v}px)`
					)
				)
			}
			position = position - (x - (x % 200)) / 200 - direction
			position =
				((position % children.length) + children.length) %
				children.length
		})
		// this.root.addEventListener('mousedown', (event) => {
		// 	let startX = event.clientX
		// 	const move = (event) => {
		//
		// 	}
		// 	const up = (event) => {
		// 		let x = event.clientX - startX
		// 		position -= Math.round(x / 200)
		// 		position %= children.length
		// 		for (let offset of [
		// 			0,
		// 			-Math.sign(Math.round(x / 200) - x + 100 * Math.sign(x)),
		// 		]) {
		// 			console.log(offset)
		// 			let pos = position + offset
		// 			pos = (pos + children.length) % children.length
		// 			children[pos].style.transition = ''
		// 			children[pos].style.transform = `translateX(${
		// 				-pos * 200 + offset * 200
		// 			}px)`
		// 		}
		// 		document.removeEventListener('mousemove', move)
		// 		document.removeEventListener('mouseup', up)
		// 	}
		// 	document.addEventListener('mousemove', move)
		// 	document.addEventListener('mouseup', up)
		// })

		// let children = this.root.children
		// let currentIndex = 0
		const nextGesture = () => {
			let nextIndex = (position + 1) % children.length
			let current = children[position]
			let next = children[nextIndex]
			t = Date.now()
			// next.style.transition = 'none'
			// next.style.transform = `translateX(${200 - nextIndex * 200}px)`
			timeLine.add(
				new Animation(
					current.style,
					'transform',
					-position * 200,
					-200 - position * 200,
					1500,
					0,
					liner,
					(v) => `translateX(${v}px)`
				)
			)
			timeLine.add(
				new Animation(
					next.style,
					'transform',
					200 - nextIndex * 200,
					-nextIndex * 200,
					1500,
					0,
					liner,
					(v) => `translateX(${v}px)`
				)
			)
			position = nextIndex
		}
		handler = setInterval(nextGesture, 3000)
		return this.root
	}
}

export default Carousel
