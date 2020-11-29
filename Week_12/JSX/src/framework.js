export class Component {
	constructor() {
		// this.root = this.render()
		// this.attributes = Object.create(null)
	}
	setAttribute(name, value) {
		this.root.setAttribute(name, value)
	}
	appendChild(child) {
		child.mountTo(this.root)
	}
	mountTo(parent) {
		parent.appendChild(this.root)
	}
}

class ElementWrapper extends Component {
	constructor(type) {
		// super()
		// this.type = type
		// this.root = this.render()
		this.root = document.createElement(type)
	}
	render() {
		return document.createElement(this.type)
	}
}

class TextWrapper extends Component {
	constructor(content) {
		super()
		this.content = content
		this.root = this.render()
	}
	render() {
		return document.createTextNode(this.content)
	}
}

export function createElement(type, attributes, ...children) {
	let element = null
	if (typeof type === 'string') {
		element = new ElementWrapper(type)
	} else {
		element = new type()
	}
	for (let name in attributes) {
		element.setAttribute(name, attributes[name])
	}
	for (let child of children) {
		if (typeof child === 'string') {
			child = new TextWrapper(child)
		}
		element.appendChild(child)
	}
	return element
}
