const TICK = Symbol('tick')
const TICK_HANDLE = Symbol('tick-handle')
const ANIMATION = Symbol('animation')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')

export class TimeLine {
	constructor() {
		this[ANIMATION] = new Set()
		this[START_TIME] = new Map()
		this[PAUSE_START] = 0
		this[PAUSE_TIME] = 0
		this.state = 'Inited'
	}

	start() {
		if (this.state !== 'Inited') {
			return
		}
		this.state = 'started'
		let startTime = Date.now()
		this[TICK] = () => {
			let now = Date.now()
			for (let animation of this[ANIMATION]) {
				let t = 0
				if (this[START_TIME].get(animation) < startTime) {
					t = now - startTime - this[PAUSE_TIME] - animation.delay
				} else {
					t =
						now -
						this[START_TIME].get(animation) -
						this[PAUSE_TIME] -
						animation.delay
				}
				if (t > animation.duration) {
					this[ANIMATION].delete(animation)
					t = animation.duration
				}
				if (t > 0) {
					animation.receive(t)
				}
			}
			this[TICK_HANDLE] = requestAnimationFrame(this[TICK])
		}
		this[TICK]()
	}

	pause() {
		if (this.state !== 'started') {
			return
		}
		this.state = 'paused'
		this[PAUSE_START] = Date.now()
		cancelAnimationFrame(this[TICK_HANDLE])
	}

	resume() {
		if (this.state !== 'paused') {
			return
		}
		this.state = 'resumed'
		this[PAUSE_TIME] = Date.now() - this[PAUSE_START]
		this[TICK]()
	}

	add(animation, startTime) {
		if (arguments.length < 2) {
			startTime = Date.now()
		}
		this[ANIMATION].add(animation)
		this[START_TIME].set(animation, startTime)
	}
	reset() {
		this.pause()
		this.state = 'Inited'
		this[ANIMATION] = new Set()
		this[START_TIME] = new Map()
		this[PAUSE_START] = 0
		this[PAUSE_TIME] = 0
		this[TICK_HANDLE] = null
	}
}

export class Animation {
	constructor(
		object,
		property,
		startTime,
		endTime,
		duration,
		delay,
		timingFunction,
		template
	) {
		timingFunction = timingFunction || ((v) => v)
		template = template || ((v) => v)

		this.object = object
		this.property = property
		this.startTime = startTime
		this.endTime = endTime
		this.duration = duration
		this.delay = delay
		this.timingFunction = timingFunction
		this.template = template
	}
	receive(time) {
		let range = this.endTime - this.startTime
		let progress = this.timingFunction(time / this.duration)
		this.object[this.property] = this.template(
			this.startTime + range * progress
		)
		// console.log(this.object[this.property])
	}
}
