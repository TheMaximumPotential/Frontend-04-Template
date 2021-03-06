let usedReactivties = []
const callbacks = new Map()
const reactivities = new Map()

const effect = (callback) => {
	usedReactivties = []
	callback()
	for (let reactivity of usedReactivties) {
		if (!callbacks.has(reactivity[0])) {
			callbacks.set(reactivity[0], new Map())
		}
		if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
			callbacks.get(reactivity[0]).set(reactivity[1], [])
		}
		callbacks.get(reactivity[0]).get(reactivity[1]).push(callback)
	}
}

const reactive = (object) => {
	if (reactivities.has(object)) {
		return reactivities.get(object)
	}
	let proxy = new Proxy(object, {
		get(obj, prop) {
			usedReactivties.push([obj, prop])
			if (typeof obj[prop] === 'object') {
				return reactive(obj[prop])
			}
			return obj[prop]
		},
		set(obj, prop, value) {
			obj[prop] = value
			if (callbacks.get(obj))
				if (callbacks.get(obj).get(prop))
					for (let callback of callbacks.get(obj).get(prop))
						callback()
			return obj[prop]
		},
	})

	reactivities.set(object, proxy)

	return proxy
}
