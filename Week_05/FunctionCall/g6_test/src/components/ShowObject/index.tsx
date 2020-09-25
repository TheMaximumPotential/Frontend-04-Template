import React, { Children, useEffect } from 'react'
import ReactDOM from 'react-dom'
import G6 from '@antv/g6'
import { idText } from 'typescript'

interface Node {
	id: string
	label?: string
	children?: Array<Node>
	type?: string
	style?: {
		[name: string]: string | number
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

const objects: Node = {
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

const nodes: Array<Node> = []

nodes.forEach((node: Node) => {
	if (!node.style) {
		node.style = {}
	}
	node.style.lineWidth = 1
	node.style.stroke = '#666'
	node.style.fill = 'skybule'
	node.type = 'circle'
})

const loop = (node: Node) => {
	if (!node.label) {
		node.label = node.id
	}
	if (node.children) {
		for (let obj of node.children) {
			loop(obj)
		}
	}
	return node
}

let node: Node = loop(objects)

console.log(node)

export default function () {
	const ref = React.useRef(null)
	let treeGraph: { data: Function; render: Function } | null = null

	useEffect(() => {
		if (!treeGraph) {
			treeGraph = new G6.TreeGraph({
				container: ReactDOM.findDOMNode(ref.current) as HTMLElement,
				width: window.innerWidth,
				height: window.innerHeight,
				fitView: true,
				fitCenter: true,
				modes: {
					default: [
						{
							type: 'collapse-expand',
						},
						'drag-canvas',
						'zoom-canvas',
					],
				},
				layout: {
					type: 'dendrogram',
					direction: 'LR', // H / V / LR / RL / TB / BT
					nodeSep: 100,
					rankSep: 200,
					radial: true,
				},
				defaultNode: {
					type: 'circle', // 节点类型
					// ... 其他配置
					size: 60,
				},
			})
		}
		treeGraph.data(node)
		treeGraph.render()
	}, [])

	return <div ref={ref}></div>
}
