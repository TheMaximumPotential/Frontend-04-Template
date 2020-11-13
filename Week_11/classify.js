let js = new Set()
let objects = [
	'globalThis',
	'BigInt',
	'BigInt64Array',
	'BigUint64Array',
	'Infinity',
	'NaN',
	'undefined',
	'eval',
	'isFinite',
	'isNaN',
	'parseFloat',
	'parseInt',
	'decodeURI',
	'decodeURIComponent',
	'encodeURI',
	'encodeURIComponent',
	'Array',
	'Date',
	'RegExp',
	'Promise',
	'Proxy',
	'Map',
	'WeakMap',
	'Set',
	'WeakSet',
	'Function',
	'Boolean',
	'String',
	'Number',
	'Symbol',
	'Object',
	'Error',
	'EvalError',
	'RangeError',
	'ReferenceError',
	'SyntaxError',
	'TypeError',
	'URIError',
	'ArrayBuffer',
	'SharedArrayBuffer',
	'DataView',
	'Float32Array',
	'Float64Array',
	'Int8Array',
	'Int16Array',
	'Int32Array',
	'Uint8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8ClampedArray',
	'Atomics',
	'JSON',
	'Math',
	'Reflect',
	'escape',
	'unescape',
]
objects.forEach((o) => js.add(o))
let names = Object.getOwnPropertyNames(window)
names = names.filter((e) => !js.has(e))

// 过滤node与node子类
names = names
	.filter((e) => {
		try {
			return !(window[e].prototype instanceof Node)
		} catch (err) {
			return true
		}
	})
	.filter((e) => e != 'Node')

// js中定义的函数和属性
let windowprops = new Set()
objects = [
	'window',
	'self',
	'document',
	'name',
	'location',
	'history',
	'customElements',
	'locationbar',
	'menubar',
	'personalbar',
	'scrollbars',
	'statusbar',
	'toolbar',
	'status',
	'close',
	'closed',
	'stop',
	'focus',
	'blur',
	'frames',
	'length',
	'top',
	'opener',
	'parent',
	'frameElement',
	'open',
	'navigator',
	'applicationCache',
	'alert',
	'confirm',
	'prompt',
	'print',
	'postMessage',
	'console',
]
objects.forEach((o) => windowprops.add(o))
names = names.filter((e) => !windowprops.has(e))

// 过滤掉所有的事件
names = names.filter((e) => !e.match(/^on/))

// 过滤掉 webkit 前缀的私有属性
names = names.filter((e) => !e.match(/^webkit/))

// 过滤掉 HTML 标准中的所有接口
let interfaces = new Set()
objects = [
	'ApplicationCache',
	'AudioTrack',
	'AudioTrackList',
	'BarProp',
	'BeforeUnloadEvent',
	'BroadcastChannel',
	'CanvasGradient',
	'CanvasPattern',
	'CanvasRenderingContext2D',
	'CloseEvent',
	'CustomElementRegistry',
	'DOMStringList',
	'DOMStringMap',
	'DataTransfer',
	'DataTransferItem',
	'DataTransferItemList',
	'DedicatedWorkerGlobalScope',
	'Document',
	'DragEvent',
	'ErrorEvent',
	'EventSource',
	'External',
	'FormDataEvent',
	'HTMLAllCollection',
	'HashChangeEvent',
	'History',
	'ImageBitmap',
	'ImageBitmapRenderingContext',
	'ImageData',
	'Location',
	'MediaError',
	'MessageChannel',
	'MessageEvent',
	'MessagePort',
	'MimeType',
	'MimeTypeArray',
	'Navigator',
	'OffscreenCanvas',
	'OffscreenCanvasRenderingContext2D',
	'PageTransitionEvent',
	'Path2D',
	'Plugin',
	'PluginArray',
	'PopStateEvent',
	'PromiseRejectionEvent',
	'RadioNodeList',
	'SharedWorker',
	'SharedWorkerGlobalScope',
	'Storage',
	'StorageEvent',
	'TextMetrics',
	'TextTrack',
	'TextTrackCue',
	'TextTrackCueList',
	'TextTrackList',
	'TimeRanges',
	'TrackEvent',
	'ValidityState',
	'VideoTrack',
	'VideoTrackList',
	'WebSocket',
	'Window',
	'Worker',
	'WorkerGlobalScope',
	'WorkerLocation',
	'WorkerNavigator',
]
objects.forEach((o) => interfaces.add(o))
names = names.filter((e) => !interfaces.has(e))

function filterOut(names, props) {
	let set = new Set()
	props.forEach((o) => set.add(o))
	return names.filter((e) => !set.has(e))
}

// http://www.ecma-international.org/ecma-402/5.0/index.html#Title
names = names.filter((e) => e != 'Intl')

// https://streams.spec.whatwg.org/#blqs-clas
names = filterOut(names, [
	'ReadableStream',
	'ReadableStreamDefaultReader',
	'ReadableStreamBYOBReader',
	'ReadableStreamDefaultController',
	'ReadableByteStreamController',
	'ReadableStreamBYOBRequest',
	'WritableStream',
	'WritableStreamDefaultWriter',
	'WritableStreamDefaultController',
	'TransformStream',
	'TransformStreamDefaultController',
	'ByteLengthQueuingStrategy',
	'CountQueuingStrategy',
])

// https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.15
names = filterOut(names, [
	'WebGLVertexArrayObject',
	'WebGLTransformFeedback',
	'WebGLSync',
	'WebGLSampler',
	'WebGLQuery',
	'WebGL2RenderingContext',
	'WebGLContextEvent',
	'WebGLObject',
	'WebGLBuffer',
	'WebGLFramebuffer',
	'WebGLProgram',
	'WebGLRenderbuffer',
	'WebGLShader',
	'WebGLTexture',
	'WebGLUniformLocation',
	'WebGLActiveInfo',
	'WebGLShaderPrecisionFormat',
	'WebGLRenderingContext',
])

// https://www.w3.org/TR/webaudio/

names = filterOut(names, [
	'AudioContext',
	'AudioNode',
	'AnalyserNode',
	'AudioBuffer',
	'AudioBufferSourceNode',
	'AudioDestinationNode',
	'AudioParam',
	'AudioListener',
	'AudioWorklet',
	'AudioWorkletGlobalScope',
	'AudioWorkletNode',
	'AudioWorkletProcessor',
	'BiquadFilterNode',
	'ChannelMergerNode',
	'ChannelSplitterNode',
	'ConstantSourceNode',
	'ConvolverNode',
	'DelayNode',
	'DynamicsCompressorNode',
	'GainNode',
	'IIRFilterNode',
	'MediaElementAudioSourceNode',
	'MediaStreamAudioSourceNode',
	'MediaStreamTrackAudioSourceNode',
	'MediaStreamAudioDestinationNode',
	'PannerNode',
	'PeriodicWave',
	'OscillatorNode',
	'StereoPannerNode',
	'WaveShaperNode',
	'ScriptProcessorNode',
	'AudioProcessingEvent',
])

// https://encoding.spec.whatwg.org/#dom-textencoder
names = filterOut(names, [
	'TextDecoder',
	'TextEncoder',
	'TextDecoderStream',
	'TextEncoderStream',
])

// https://wicg.github.io/BackgroundSync/spec/#sync-manager-interface
names = filterOut(names, ['SyncManager'])

// https://www.w3.org/TR/WebCryptoAPI/
names = filterOut(names, ['CryptoKey', 'SubtleCrypto', 'Crypto', 'crypto'])

// https://www.w3.org/TR/media-source/
names = filterOut(names, ['MediaSource', 'SourceBuffer', 'SourceBufferList'])

// https://www.w3.org/TR/screen-orientation/
names = filterOut(names, ['ScreenOrientation'])

// https://w3c.github.io/webrtc-pc/#constructors-3
names = filterOut(names, [
	'RTCTrackEvent',
	'RTCStatsReport',
	'RTCSctpTransport',
	'RTCRtpTransceiver',
	'RTCRtpSender',
	'RTCRtpReceiver',
	'RTCPeerConnection',
	'RTCErrorEvent',
	'RTCError',
	'RTCDtlsTransport',
	'RTCDataChannelEvent',
	'RTCDataChannel',
	'RTCDTMFToneChangeEvent',
	'RTCDTMFSender',
	'RTCCertificate',
	'RTCSessionDescription',
	'RTCPeerConnectionIceEvent',
	'RTCPeerConnectionIceErrorEvent',
	'RTCIceCandidate',
])

// https://svgwg.org/svg2-draft/
names = filterOut(names, [
	'SVGUnitTypes',
	'SVGTransformList',
	'SVGTransform',
	'SVGStringList',
	'SVGRect',
	'SVGPreserveAspectRatio',
	'SVGPointList',
	'SVGPoint',
	'SVGNumberList',
	'SVGNumber',
	'SVGMatrix',
	'SVGLengthList',
	'SVGLength',
	'SVGAnimatedTransformList',
	'SVGAnimatedString',
	'SVGAnimatedRect',
	'SVGAnimatedPreserveAspectRatio',
	'SVGAnimatedNumberList',
	'SVGAnimatedNumber',
	'SVGAnimatedLengthList',
	'SVGAnimatedLength',
	'SVGAnimatedInteger',
	'SVGAnimatedEnumeration',
	'SVGAnimatedBoolean',
	'SVGAnimatedAngle',
	'SVGAngle',
])

// https://www.w3.org/TR/navigation-timing/
names = filterOut(names, [
	'PerformanceTiming',
	'PerformanceServerTiming',
	'PerformanceResourceTiming',
	'PerformancePaintTiming',
	'PerformanceObserverEntryList',
	'PerformanceObserver',
	'PerformanceNavigationTiming',
	'PerformanceNavigation',
	'PerformanceMeasure',
	'PerformanceMark',
	'PerformanceLongTaskTiming',
	'PerformanceEventTiming',
	'PerformanceEntry',
	'PerformanceElementTiming',
	'Performance',
])
