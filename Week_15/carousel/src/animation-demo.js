import { TimeLine, Animation } from './animation.js'
import { easeOut, ease, easeIn, easeInOut, liner } from './cubicBezier.js'

let el = document.querySelector('.wrap')

let tl = new TimeLine()
let animation = new Animation(
	el.style,
	'transform',
	0,
	200,
	2000,
	0,
	ease,
	(v) => `translateX(${v}px)`
)
tl.add(animation)
tl.start()
document.querySelector('#pause').addEventListener('click', () => tl.pause())
document.querySelector('#resume').addEventListener('click', () => tl.resume())
