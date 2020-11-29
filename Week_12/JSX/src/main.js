import { Component, createElement } from './framework'

class Wrapper extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return <div></div>
	}
}

const images = [
	'./images/a1.png',
	'./images/a2.png',
	'./images/a3.png',
	'./images/a4.png',
	'./images/a5.png',
	'./images/a6.png',
]

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
		let children = this.root.children
		let position = 0
		this.root.addEventListener('mousedown', (event) => {
			let startX = event.clientX
			const move = (event) => {
				let x = event.clientX - startX
				let current = position - (x - (x % 200)) / 200
				for (let offset of [-1, 0, 1]) {
					let pos = current + offset
					pos = (pos + children.length) % children.length
					children[pos].style.transition = 'none'
					children[pos].style.transform = `translateX(${
						-pos * 200 + offset * 200 + (x % 200)
					}px)`
				}
			}
			const up = (event) => {
				let x = event.clientX - startX
				position -= Math.round(x / 200)
				position %= children.length
				for (let offset of [
					0,
					-Math.sign(Math.round(x / 200) - x + 100 * Math.sign(x)),
				]) {
					console.log(offset)
					let pos = position + offset
					pos = (pos + children.length) % children.length
					children[pos].style.transition = ''
					children[pos].style.transform = `translateX(${
						-pos * 200 + offset * 200
					}px)`
				}
				document.removeEventListener('mousemove', move)
				document.removeEventListener('mouseup', up)
			}
			document.addEventListener('mousemove', move)
			document.addEventListener('mouseup', up)
		})
		// let children = this.root.children
		// let currentIndex = 0
		// setInterval(() => {
		// 	let nextIndex = (currentIndex + 1) % children.length
		// 	let current = children[currentIndex]
		// 	let next = children[nextIndex]
		// 	next.style.transition = 'none'
		// 	next.style.transform = `translateX(${100 - nextIndex * 100}%)`
		// 	setTimeout(() => {
		// 		next.style.transition = ''
		// 		current.style.transform = `translateX(${
		// 			-100 - currentIndex * 100
		// 		}%)`
		// 		next.style.transform = `translateX(${-nextIndex * 100}%)`
		// 		currentIndex = nextIndex
		// 	}, 16)
		// }, 3000)
		return this.root
	}
}

// var a = createElement(
// 	Wrapper,
// 	null,
// 	createElement(
// 		'div',
// 		null,
// 		'123'
// 	),
// 	createElement(Carousel, {
// 		src: images,
// 	})
// )

let a = <Carousel src={images} />

// console.log(a)
a.mountTo(document.body)
