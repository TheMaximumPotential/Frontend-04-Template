const net = require('net')
const images = require('images')
const parser = require('./parser')
const render = require('./render')

// 解析的body里不能有中文，不然按照Content-Length解析会出问题
class TrunkedBodyParser {
	constructor() {
		this.state = this.waitingLength
		this.length = 0
		this.content = []
		this.isFinished = false
	}

	waitingLength(char) {
		if (char === '\r') {
			if (this.length === 0) {
				this.isFinished = true
				return this.waitingNewLine
			} else {
				return this.waitingLengthEnd
			}
		} else {
			this.length *= 16
			this.length += parseInt(char, 16)
			return this.waitingLength
		}
	}
	waitingLengthEnd(char) {
		if (char === '\n') {
			return this.readingTrunk
		} else {
			return this.waitingLengthEnd
		}
	}
	readingTrunk(char) {
		this.content.push(char)
		this.length--
		if (this.length === 0) {
			return this.waitingNewLine
		} else {
			return this.readingTrunk
		}
	}
	waitingNewLine(char) {
		if (char === '\r') {
			return this.waitingNewLineEnd
		} else {
			return this.waitingNewLine
		}
	}
	waitingNewLineEnd(char) {
		if (char === '\n') {
			return this.waitingLength
		} else {
			return this.waitingNewLineEnd
		}
	}

	receiveChar(char) {
		this.state = this.state(char)
	}
}

class ResponseParser {
	constructor() {
		this.state = this.waitingStatusLine
		this.statusLine = ''
		this.headers = {}
		this.headerName = ''
		this.headerValue = ''
		this.bodyParser = null
	}

	get isFinished() {
		return this.bodyParser && this.bodyParser.isFinished
	}
	get response() {
		this.statusLine.match(/HTTP\/1\.1 ([0-9]+) ([\s\S]+)/)
		return {
			statusCode: RegExp.$1,
			statusText: RegExp.$2,
			headers: this.headers,
			body: this.bodyParser.content.join(''),
		}
	}
	receive(string) {
		for (let i = 0; i < string.length; ++i) {
			this.receiveChar(string.charAt(i))
		}
	}
	receiveChar(char) {
		this.state = this.state(char)
	}

	waitingStatusLine(char) {
		if (char === '\r') {
			return this.waitingStatusLineEnd
		} else {
			this.statusLine += char
			return this.waitingStatusLine
		}
	}
	waitingStatusLineEnd(char) {
		if (char === '\n') {
			return this.waitingHeaderName
		} else {
			return this.waitingStatusLineEnd
		}
	}
	waitingHeaderName(char) {
		if (char === ':') {
			return this.waitingHeaderSpace
		} else if (char === '\r') {
			if (this.headers['Transfer-Encoding'] === 'chunked') {
				this.bodyParser = new TrunkedBodyParser()
			}
			return this.waitingHeaderBlockEnd
		} else {
			this.headerName += char
			return this.waitingHeaderName
		}
	}
	waitingHeaderSpace(char) {
		if (char === ' ') {
			return this.waitingHeaderValue
		} else {
			return this.waitingHeaderSpace
		}
	}
	waitingHeaderValue(char) {
		if (char === '\r') {
			this.headers[this.headerName] = this.headerValue
			this.headerName = ''
			this.headerValue = ''
			return this.waitingHeaderLineEnd
		} else {
			this.headerValue += char
			return this.waitingHeaderValue
		}
	}
	waitingHeaderLineEnd(char) {
		if (char === '\n') {
			return this.waitingHeaderName
		} else {
			return this.waitingHeaderBlockEnd
		}
	}
	waitingHeaderBlockEnd(char) {
		if (char === '\n') {
			return this.waitingBody
		} else {
			return this.waitingHeaderBlockEnd
		}
	}
	waitingBody(char) {
		this.bodyParser.receiveChar(char)
		return this.waitingBody
	}
}

class Request {
	constructor(options) {
		this.method = options.method || 'GET'
		this.host = options.host
		this.port = options.port || 80
		this.path = options.path || '/'
		this.body = options.body || {}
		this.headers = options.headers || {}
		if (!this.headers['Content-Type']) {
			this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
		}
		if (this.headers['Content-Type'] === 'application/json') {
			this.bodyText = JSON.stringify(this.body)
		} else if (
			this.headers['Content-Type'] === 'application/x-www-form-urlencoded'
		) {
			this.bodyText = Object.keys(this.body)
				.map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
				.join('&')
		}
		this.headers['Content-Length'] = this.bodyText.length
	}

	send(connection) {
		return new Promise((resolve, reject) => {
			const parser = new ResponseParser()
			if (connection) {
				connection.write(this.toString())
			} else {
				connection = net.createConnection(
					{
						host: this.host,
						port: this.port,
					},
					() => {
						connection.write(this.toString())
					}
				)
			}
			connection.on('data', (data) => {
				// console.log(data.toString())
				parser.receive(data.toString())
				if (parser.isFinished) {
					resolve(parser.response)
					connection.end()
				}
			})
			connection.on('error', (err) => {
				reject(err)
				connection.end()
			})
		})
	}

	toString() {
		return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(
			this.headers
		)
			.map((key) => `${key}: ${this.headers[key]}`)
			.join('\r\n')}\r\n\r\n${this.bodyText}`
	}
}

void (async function () {
	let request = new Request({
		method: 'POST',
		host: '127.0.0.1',
		port: '8088',
		path: '/',
		headers: {
			['X-Foo2']: 'customed',
		},
		body: {
			name: 'jinxing',
			age: 16,
		},
	})

	let response = await request.send()

	// console.log(response.body)

	let dom = parser.parserHTML(response.body)

	// console.log(dom)

	let viewport = images(800, 600)

	render(viewport, dom)

	viewport.save('viewport.jpg')
})()
