console.log(match('aabbcdef'))

function match(str) {
	let state = start
	for (let s of str) {
		state = state(s)
	}
	return state === end
}

function start(s) {
	if (s === 'a') {
		return foundA
	}
	return start
}

function end(s) {
	return end
}

function foundA(s) {
	if (s === 'b') {
		return foundB
	}
	return start(s)
}
function foundB(s) {
	if (s === 'c') {
		return foundC
	}
	return start(s)
}
function foundC(s) {
	if (s === 'd') {
		return foundD
	}
	return start(s)
}
function foundD(s) {
	if (s === 'e') {
		return foundE
	}
	return start(s)
}
function foundE(s) {
	if (s === 'f') {
		return end
	}
	return start(s)
}
