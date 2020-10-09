const http = require('http')
const fs = require('fs')

const server = http.createServer((request, response) => {
	let body = []
	request
		.on('error', (err) => {
			console.error(err)
		})
		.on('data', (thunk) => {
			console.log(thunk.toString())
			body.push(thunk)
		})
		.on('end', () => {
			body = Buffer.concat(body).toString()
			fs.readFile('./index.html', (err, data) => {
				if (err) throw err
				response.writeHead(200, { 'Content-Type': 'text/html' })
				response.end(data.toString())
			})
		})
})

server.listen(8088, () => {
	console.log('正在监听8088端口...')
})
