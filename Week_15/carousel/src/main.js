import { createElement } from './framework'
import Carousel from './carousel'
import { TimeLine, Animation } from './animation'

const images = [
	'./images/a1.png',
	'./images/a2.png',
	'./images/a3.png',
	'./images/a4.png',
	'./images/a5.png',
	'./images/a6.png',
]

let a = <Carousel src={images} />

a.mountTo(document.body)

// let tl = new TimeLine()
// let animation = new Animation({}, length, 0, 100, 1000, 1000, null)
// tl.add(animation, Date.now() + 1000)
// tl.start()
