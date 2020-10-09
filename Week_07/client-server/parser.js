const css = require('css')
const EOF = Symbol('EOF') // EOF: End of file

let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = [{ type: 'document', children: [] }]
let rules = []

/**
 * p[0]:内联样式，如: style="..."，权值为1000。
 * p[1]:ID选择器，如：#content，权值为0100。
 * p[2]类.，伪类:、属性选择器[]，如.content，权值为0010。
 * p[3]类型选择器.、伪元素选择器::，如div p，权值为0001。
 * 通配符*、子选择器>、相邻选择器+等。如* > +，权值为0000。
 * 继承的样式没有权值
 */

// 优先级计算还是不好搞啊
function specificity(selector) {
	let p = [0, 0, 0, 0]
	let selectorParts = selector
		.split(' ')
		.map((v) => v.split('>'))
		.flat()
	for (let part of selectorParts) {
		let flag = true
		for (let i = 0; i < part.length; ++i) {
			if (!flag) {
				flag = true
				continue
			}
			if (i === 0 && part[i].match(/^[a-zA-Z]$/)) {
				p[3]++
				continue
			}
			if (part[i] === '#') {
				p[1]++
			} else if (part[i] === ':' && part[i + 1] === ':') {
				p[3]++
				flag = false
			} else if (part[i] === '.' || part[i] === ':' || part[i] === '[') {
				p[2]++
			}
		}
	}
	return p
}

function compare(sp1, sp2) {
	if (sp1[0] - sp2[0]) {
		return sp1[0] - sp2[0]
	} else if (sp1[1] - sp2[1]) {
		return sp1[1] - sp2[1]
	} else if (sp1[2] - sp2[2]) {
		return sp1[2] - sp2[2]
	} else {
		return sp1[3] - sp2[3]
	}
}

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

function addCSSRules(text) {
	let ast = css.parse(text)
	// css 中的注释也会解析进去，所以要过滤一下没有 selectors 的 rules
	rules = [...ast.stylesheet.rules].filter((v) => v.selectors)
}

function computedCSS(element) {
	// 从内向外匹配
	let elements = stack.slice().reverse()

	if (!element.computedStyle) {
		element.computedStyle = {}
	}

	for (let rule of rules) {
		// 逗号选择器会放在一个 selectors 里
		for (let selectors of rule.selectors) {
			let selectorParts = selectors.split(' ').reverse()
			if (!match(element, selectorParts[0])) {
				continue
			}
			let matched = false
			let j = 1
			for (let i = 0; i < elements.length; ++i) {
				if (match(elements[i], selectorParts[j])) {
					j++
				}
			}
			// 元素已经把 selector 完全匹配完
			if (j >= selectorParts.length) {
				matched = true
			}
			if (matched) {
				let sp = specificity(selectors)
				let computedStyle = element.computedStyle
				for (let declaration of rule.declarations) {
					if (!computedStyle[declaration.property]) {
						computedStyle[declaration.property] = {}
					}
					if (!computedStyle[declaration.property].specificity) {
						computedStyle[declaration.property].value =
							declaration.value
						computedStyle[declaration.property].specificity = sp
					} else if (
						compare(
							computedStyle[declaration.property].specificity,
							sp
						) < 0
					) {
						computedStyle[declaration.property].value =
							declaration.value
						computedStyle[declaration.property].specificity = sp
					}
					console.log('Element:::', element)
				}
			}
		}
	}
}

function emit(token) {
	// console.log(token)
	let top = stack[stack.length - 1]
	if (token.type === 'startTag') {
		let element = {
			type: 'element',
			attributes: [],
			children: [],
		}
		element.tagName = token.tagName
		for (let p in token) {
			if (p !== 'type' && p !== 'tagName') {
				element.attributes.push({
					name: p,
					value: token[p],
				})
			}
		}
		// 先挂一下 parent 是为了 computedCSS 解析 >（子代选择器）
		element.parent = top
		computedCSS(element)
		top.children.push(element)

		if (!token.isSelfClosing) {
			stack.push(element)
		}
		currentTextNode = null
	} else if (token.type === 'text') {
		if (currentTextNode === null) {
			currentTextNode = {
				type: 'text',
				content: '',
			}
			top.children.push(currentTextNode)
		}
		currentTextNode.content += token.content
	} else if (token.type === 'endTag') {
		if (top.tagName !== token.tagName) {
			throw new Error("Tag start end doesn't match!")
		} else {
			if (top.tagName === 'style') {
				addCSSRules(currentTextNode.content)
			}
			stack.pop()
		}
		currentTextNode = null
	}
}

function data(c) {
	if (c === '<') {
		return tagOpen
	} else if (c === EOF) {
		emit({
			type: 'EOF',
		})
		return
	} else {
		emit({
			type: 'text',
			content: c,
		})
		return data
	}
}

function tagOpen(c) {
	if (c === '/') {
		return endTagOpen
	} else if (c.match(/^[a-zA-Z]$/)) {
		currentToken = {
			type: 'startTag',
			tagName: '',
		}
		return tagName(c)
	} else {
		return tagOpen
	}
}

function endTagOpen(c) {
	if (c.match(/^[a-zA-Z]$/)) {
		currentToken = {
			type: 'endTag',
			tagName: '',
		}
		return tagName(c)
	} else if (c === '>') {
		return data
	} else if (c === EOF) {
	} else {
	}
}

function tagName(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return beforeAttributeName
	} else if (c === '/') {
		return selfClosingStartTag
	} else if (c.match(/^[a-zA-Z]$/)) {
		currentToken.tagName += c
		return tagName
	} else if (c === '>') {
		emit(currentToken)
		return data
	} else {
		return tagName
	}
}

function beforeAttributeName(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return beforeAttributeName
	} else if (c === '/' || c === '>' || c === EOF) {
		return afterAttributeName
	} else if (c === '=') {
	} else {
		currentAttribute = {
			name: '',
			value: '',
		}
		return attributeName(c)
	}
}

function afterAttributeName(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return afterAttributeName(c)
	} else if (c === '/' || c === '>') {
		return selfClosingStartTag
	} else if (c === EOF) {
		return data
	} else if (c === '=') {
		return beforeAttributeValue
	} else {
		return afterAttributeName
	}
}

function attributeName(c) {
	if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
		return afterAttributeName(c)
	} else if (c === '=') {
		return beforeAttributeValue
	} else if (c === '\u0000') {
	} else if (c === '"' || c === "'" || c === '<') {
	} else {
		currentAttribute.name += c
		return attributeName
	}
}

function beforeAttributeValue(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return beforeAttributeValue
	} else if (c === '"') {
		return doubleQuotedAttributeValue
	} else if (c === "'") {
		return singleQuotedAttributeValue
	} else if (c === '/' || c === '>' || c === EOF) {
		return data
	} else {
		return UnquotedAttributeValue(c)
	}
}

function doubleQuotedAttributeValue(c) {
	if (c === '"') {
		currentToken[currentAttribute.name] = currentAttribute.value
		return afterQuotedAttributeValue
	} else if (c === '\u0000') {
	} else if (c === EOF) {
	} else {
		currentAttribute.value += c
		return doubleQuotedAttributeValue
	}
}

function singleQuotedAttributeValue(c) {
	if (c === "'") {
		currentToken[currentAttribute.name] = currentAttribute.value
		return afterQuotedAttributeValue
	} else if (c === '\u0000') {
	} else if (c === EOF) {
	} else {
		currentAttribute.value += c
		return singleQuotedAttributeValue
	}
}

function UnquotedAttributeValue(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		currentToken[currentAttribute.name] = currentAttribute.value
		return beforeAttributeName
	} else if (c === '/') {
		currentToken[currentAttribute.name] = currentAttribute.value
		return selfClosingStartTag
	} else if (c === '>') {
		currentToken[currentAttribute.name] = currentAttribute.value
		emit(currentToken)
		return data
	} else if (c === '\u0000') {
	} else if (c === '"' || c === "'" || c === '<' || c === '=') {
	} else if (c === EOF) {
	} else {
		currentAttribute.value += c
		return UnquotedAttributeValue
	}
}

function afterQuotedAttributeValue(c) {
	if (c.match(/^[\t\n\f ]$/)) {
		return afterQuotedAttributeValue
	} else if (c.match(/^[a-zA-Z]$/)) {
		return beforeAttributeName(c)
	} else if (c === '/') {
		return selfClosingStartTag
	} else if (c === '>') {
		currentToken[currentAttribute.name] = currentAttribute.value
		emit(currentToken)
		return data
	} else if (c === EOF) {
	} else {
		currentAttribute.value += c
		return doubleQuotedAttributeValue
	}
}

function selfClosingStartTag(c) {
	if (c === '>') {
		currentToken.isSelfClosing = true
		emit(currentToken)
		return data
	} else if (c === 'EOF') {
	} else {
		return data
	}
}

module.exports = {
	parserHTML(html) {
		let state = data
		for (let c of html) {
			state = state(c)
		}
		state = state(EOF)
		return stack[0]
	},
}
