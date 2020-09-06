class Heap {
	// 默认小根堆
	constructor(arr = [], fn = (a, b) => a < b) {
		this.container = []
		this.fn = fn
		arr.length &&
			arr.forEach((v) => {
				this.insert(v)
			})
	}

	insert(data) {
		const { container, fn, swap } = this
		container.push(data)
		let index = container.length - 1
		while (index >= 0) {
			let parentIdx = Math.floor((index - 1) / 2)
			if (parentIdx < 0 || fn(container[parentIdx], container[index]))
				break
			swap(container, index, parentIdx)
			index = parentIdx
		}
	}

	extract() {
		const { container, fn, swap } = this
		if (!container.length) {
			return null
		}
		let index = 0
		swap(container, index, container.length - 1)
		const result = container.pop()
		const length = container.length
		let exchange = index * 2 + 1

		while (exchange < length) {
			// 如果有右节点，并且右节点的值大于左节点的值
			let right = index * 2 + 2
			if (right < length && fn(container[right], container[exchange])) {
				exchange = right
			}
			if (!fn(container[exchange], container[index])) {
				break
			}
			swap(container, exchange, index)
			index = exchange
			exchange = index * 2 + 1
		}
		return result
	}

	top() {
		return this.container.length ? this.container[0] : null
	}

	swap(arr, i, j) {
		return ([arr[i], arr[j]] = [arr[j], arr[i]])
	}
}
