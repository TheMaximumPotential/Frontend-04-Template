function cubicBezier(a1, a2, a3, a4, t) {
	return (
		a1 * (1 - t) * (1 - t) * (1 - t) +
		3 * a2 * t * (1 - t) * (1 - t) +
		3 * a3 * t * t * (1 - t) +
		a4 * t * t * t
	)
}

export const liner = cubicBezier.bind(null, 0, 0, 1, 1)
export const ease = cubicBezier.bind(null, 0.25, 0.1, 0.25, 1)
export const easeIn = cubicBezier.bind(null, 0.42, 0, 1, 1)
export const easeOut = cubicBezier.bind(null, 0, 0, 0.58, 1)
export const easeInOut = cubicBezier.bind(null, 0.42, 0, 0.58, 1)
