import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import G6 from '@antv/g6'

const objects = {
	id: 'Object',
	children: [
		{ id: 'Boolean' },
		{ id: 'String' },
		{ id: 'Number' },
		{ id: 'Symbol' },
		{ id: 'Date' },
		{ id: 'Promise' },
		{ id: 'RegExp' },
		{ id: 'Proxy' },
		{ id: 'Map' },
		{ id: 'WeakMap' },
		{ id: 'Set' },
		{ id: 'WeakSet' },
		{ id: 'Function' },
		{ id: 'ArrayBuffer' },
		{ id: 'ShareArrayBuffer' },
		{ id: 'DataView' },
		{
			id: 'Array',
			children: [
				{ id: 'Float32Array' },
				{ id: 'Float64Array' },
				{ id: 'Int8Array' },
				{ id: 'Int32Array' },
				{ id: 'UInt8Array' },
				{ id: 'UInt16Array' },
				{ id: 'UInt32Array' },
				{ id: 'UInt8ClampedArray' },
			],
		},
		{
			id: 'Error',
			children: [
				{ id: 'EvalError' },
				{ id: 'RangeError' },
				{ id: 'ReferenceError' },
				{ id: 'SyntaxError' },
				{ id: 'TypeError' },
				{ id: 'URIError' },
			],
		},
	],
}

interface Node {
	id: string
	label?: string
	children?: Array<Node>
	type?: string
	style?: {
		[name: string]: string | number
	}
}

function generateNodes(node: Node, nodes: Array<Node>) {
	if (node.id) {
		nodes.push({
			id: node.id,
			label: node.id,
		})
	}
	if (node.children) {
		for (let n of node.children) {
			generateNodes(n, nodes)
		}
	}
}

interface Edge {
	source: string
	target: string
	children?: Array<Edge>
	style?: {
		[name: string]: string | number
	}
}

function generateEdges(node: Node, edges: Array<Edge>) {
	if (!node.children) {
		return
	}
	for (let n of node.children) {
		edges.push({
			source: node.id,
			target: n.id,
		})
		generateEdges(n, edges)
	}
}

const nodes: Array<Node> = []
const edges: Array<Edge> = []
generateNodes(objects, nodes)
generateEdges(objects, edges)

nodes.forEach((node: Node) => {
	if (!node.style) {
		node.style = {}
	}
	node.style.lineWidth = 1
	node.style.stroke = '#666'
	node.style.fill = 'skybule'
	node.type = 'circle'
})

edges.forEach((edge) => {
	if (!edge.style) {
		edge.style = {}
	}
	edge.style.lineWidth = 1
	edge.style.opacity = '#666'
	edge.style.stroke = 'grey'
})

const data = {
	nodes,
	edges,
}

export default function () {
	const ref = React.useRef(null)
	let graph: { data: Function; render: Function } | null = null

	useEffect(() => {
		if (!graph) {
			graph = new G6.Graph({
				container: ReactDOM.findDOMNode(ref.current) as HTMLElement,
				width: 1200,
				height: 800,
				modes: {
					default: ['drag-canvas'],
				},
				layout: {
					type: 'dagre',
					direction: 'LR',
				},
				defaultNode: {
					type: 'node',
					labelCfg: {
						style: {
							fill: '#000000A6',
							fontSize: 10,
						},
					},
					style: {
						stroke: '#72CC4A',
						width: 150,
					},
				},
				defaultEdge: {
					type: 'polyline',
				},
			})
		}
		graph.data(data)
		graph.render()
	}, [])

	return <div ref={ref}></div>
}
