const dragable = document.getElementById('dragable')

let baseX = 0
let baseY = 0

let ranges = []
let container = document.getElementById('container')

for (let i = 0; i < container.childNodes[0].textContent.length; ++i) {
	let range = document.createRange()
	range.setStart(container.childNodes[0], i)
	range.setEnd(container.childNodes[0], i)
	// console.log(range.getBoundingClientRect())
	ranges.push(range)
}

const getNearest = (x, y) => {
	let min = Infinity
	let nearest = null
	for (let range of ranges) {
		let rect = range.getBoundingClientRect()
		let distance = (rect.x - x) ** 2 + (rect.y - y) ** 2
		if (distance < min) {
			nearest = range
			min = distance
		}
	}
	return nearest
}

dragable.addEventListener('mousedown', (e) => {
	startX = e.clientX
	startY = e.clientY
	const move = (e) => {
		// dragable.style.transform = `translate(${
		// 	baseX + e.clientX - startX
		// }px, ${baseY + e.clientY - startY}px)`
		let range = getNearest(e.clientX, e.clientY)
		range.insertNode(dragable)
	}
	const up = (e) => {
		baseX += e.clientX - startX
		baseY += e.clientY - startY
		document.removeEventListener('mousemove', move)
		document.removeEventListener('mouseup', up)
	}
	document.addEventListener('mousemove', move)
	document.addEventListener('mouseup', up)
})

document.addEventListener('selectstart', (e) => e.preventDefault())
