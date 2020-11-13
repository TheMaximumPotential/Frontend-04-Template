function match(element, selector) {
	if (!selector || !element.attributes) {
		return false
	}
	// 判断顺序及其重要
	if (selector.includes('::')) {
		let matchList = selector.split('::')
		return match(element, matchList[0])
	} else if (selector.includes(':')) {
		let matchList = selector.split(':')
		return match(element, matchList[0])
	} else if (selector.includes('>')) {
		// 寻找一个或者多个>子代选择器
		let matchList = selector.split('>').reverse()
		let temp = { parent: element }
		// 寻找每一个父级匹配 如果都通过才返回匹配成功
		return matchList.every((v) => {
			let result = match(temp.parent, v)
			temp = temp.parent
			return result
		})
	} else if (selector.includes('#')) {
		if (selector.charAt(0) === '#') {
			let attr = element.attributes.filter(
				(attr) => attr.name === 'id'
			)[0]
			if (attr && attr.value === selector.replace('#', '')) {
				return true
			}
		} else {
			let matchList = selector.split('#')
			return (
				match(element, matchList[0]) &&
				match(element, '#' + matchList[1])
			)
		}
	} else if (selector.includes('.')) {
		if (selector.charAt(0) === '.') {
			// 处理.title.first
			let matchList = selector.split('.').filter((v) => v)
			let attr = element.attributes.filter(
				(attr) => attr.name === 'class'
			)[0]
			if (attr) {
				if (typeof attr.value !== 'object') {
					attr.value = attr.value.split(' ')
				}
				return matchList.every((v) => {
					return attr.value.includes(v)
				})
			}
		} else {
			let matchList = selector.split('.')
			// 匹配 p.title.first
			return matchList.every((v, i) =>
				i === 0 ? match(element, v) : match(element, '.' + v)
			)
		}
	} else {
		if (element.tagName === selector) {
			return true
		}
	}
	return false
}
