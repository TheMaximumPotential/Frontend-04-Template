/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/animation.js":
/*!**************************!*\
  !*** ./src/animation.js ***!
  \**************************/
/*! namespace exports */
/*! export Animation [provided] [no usage info] [missing usage info prevents renaming] */
/*! export TimeLine [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimeLine": () => /* binding */ TimeLine,
/* harmony export */   "Animation": () => /* binding */ Animation
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TICK = Symbol('tick');
var TICK_HANDLE = Symbol('tick-handle');
var ANIMATION = Symbol('animation');
var START_TIME = Symbol('start-time');
var PAUSE_START = Symbol('pause-start');
var PAUSE_TIME = Symbol('pause-time');
var TimeLine = /*#__PURE__*/function () {
  function TimeLine() {
    _classCallCheck(this, TimeLine);

    this[ANIMATION] = new Set();
    this[START_TIME] = new Map();
    this[PAUSE_START] = 0;
    this[PAUSE_TIME] = 0;
    this.state = 'Inited';
  }

  _createClass(TimeLine, [{
    key: "start",
    value: function start() {
      var _this = this;

      if (this.state !== 'Inited') {
        return;
      }

      this.state = 'started';
      var startTime = Date.now();

      this[TICK] = function () {
        var now = Date.now();

        var _iterator = _createForOfIteratorHelper(_this[ANIMATION]),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var animation = _step.value;
            var t = 0;

            if (_this[START_TIME].get(animation) < startTime) {
              t = now - startTime - _this[PAUSE_TIME] - animation.delay;
            } else {
              t = now - _this[START_TIME].get(animation) - _this[PAUSE_TIME] - animation.delay;
            }

            if (t > animation.duration) {
              _this[ANIMATION]["delete"](animation);

              t = animation.duration;
            }

            if (t > 0) {
              animation.receive(t);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        _this[TICK_HANDLE] = requestAnimationFrame(_this[TICK]);
      };

      this[TICK]();
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.state !== 'started') {
        return;
      }

      this.state = 'paused';
      this[PAUSE_START] = Date.now();
      cancelAnimationFrame(this[TICK_HANDLE]);
    }
  }, {
    key: "resume",
    value: function resume() {
      if (this.state !== 'paused') {
        return;
      }

      this.state = 'resumed';
      this[PAUSE_TIME] = Date.now() - this[PAUSE_START];
      this[TICK]();
    }
  }, {
    key: "add",
    value: function add(animation, startTime) {
      if (arguments.length < 2) {
        startTime = Date.now();
      }

      this[ANIMATION].add(animation);
      this[START_TIME].set(animation, startTime);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.pause();
      this.state = 'Inited';
      this[ANIMATION] = new Set();
      this[START_TIME] = new Map();
      this[PAUSE_START] = 0;
      this[PAUSE_TIME] = 0;
      this[TICK_HANDLE] = null;
    }
  }]);

  return TimeLine;
}();
var Animation = /*#__PURE__*/function () {
  function Animation(object, property, startTime, endTime, duration, delay, timingFunction, template) {
    _classCallCheck(this, Animation);

    timingFunction = timingFunction || function (v) {
      return v;
    };

    template = template || function (v) {
      return v;
    };

    this.object = object;
    this.property = property;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction = timingFunction;
    this.template = template;
  }

  _createClass(Animation, [{
    key: "receive",
    value: function receive(time) {
      var range = this.endTime - this.startTime;
      var progress = this.timingFunction(time / this.duration);
      this.object[this.property] = this.template(this.startTime + range * progress); // console.log(this.object[this.property])
    }
  }]);

  return Animation;
}();

/***/ }),

/***/ "./src/carousel.js":
/*!*************************!*\
  !*** ./src/carousel.js ***!
  \*************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./framework */ "./src/framework.js");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animation */ "./src/animation.js");
/* harmony import */ var _gesture__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gesture */ "./src/gesture.js");
/* harmony import */ var _cubicBezier__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cubicBezier */ "./src/cubicBezier.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }






var Carousel = /*#__PURE__*/function (_Component) {
  _inherits(Carousel, _Component);

  var _super = _createSuper(Carousel);

  function Carousel() {
    var _this;

    _classCallCheck(this, Carousel);

    _this = _super.call(this);
    _this.attributes = Object.create(null);
    return _this;
  }

  _createClass(Carousel, [{
    key: "setAttribute",
    value: function setAttribute(name, value) {
      this.attributes[name] = value;
    }
  }, {
    key: "mountTo",
    value: function mountTo(parent) {
      parent.appendChild(this.render());
    }
  }, {
    key: "render",
    value: function render() {
      var src = this.attributes.src;
      this.root = document.createElement('div');
      this.root.classList.add('carousel');

      var _iterator = _createForOfIteratorHelper(src),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var url = _step.value;
          // 为什么不用 img 呢，因为 img 默认是可拖动的，会影响效果。
          var div = document.createElement('div');
          div.style.backgroundImage = "url(".concat(url, ")");
          this.root.appendChild(div);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var children = this.root.children;
      var position = 0;
      (0,_gesture__WEBPACK_IMPORTED_MODULE_2__.enableGesture)(this.root);
      this.root.addEventListener('pan', function (e) {
        console.log(e);
      }); // this.root.addEventListener('mousedown', (event) => {
      // 	let startX = event.clientX
      // 	const move = (event) => {
      // 		let x = event.clientX - startX
      // 		let current = position - (x - (x % 200)) / 200
      // 		for (let offset of [-1, 0, 1]) {
      // 			let pos = current + offset
      // 			pos = (pos + children.length) % children.length
      // 			children[pos].style.transition = 'none'
      // 			children[pos].style.transform = `translateX(${
      // 				-pos * 200 + offset * 200 + (x % 200)
      // 			}px)`
      // 		}
      // 	}
      // 	const up = (event) => {
      // 		let x = event.clientX - startX
      // 		position -= Math.round(x / 200)
      // 		position %= children.length
      // 		for (let offset of [
      // 			0,
      // 			-Math.sign(Math.round(x / 200) - x + 100 * Math.sign(x)),
      // 		]) {
      // 			console.log(offset)
      // 			let pos = position + offset
      // 			pos = (pos + children.length) % children.length
      // 			children[pos].style.transition = ''
      // 			children[pos].style.transform = `translateX(${
      // 				-pos * 200 + offset * 200
      // 			}px)`
      // 		}
      // 		document.removeEventListener('mousemove', move)
      // 		document.removeEventListener('mouseup', up)
      // 	}
      // 	document.addEventListener('mousemove', move)
      // 	document.addEventListener('mouseup', up)
      // })
      // let children = this.root.children
      // let currentIndex = 0
      // setInterval(() => {
      // 	let nextIndex = (currentIndex + 1) % children.length
      // 	let current = children[currentIndex]
      // 	let next = children[nextIndex]
      // 	next.style.transition = 'none'
      // 	next.style.transform = `translateX(${100 - nextIndex * 100}%)`
      // 	setTimeout(() => {
      // 		next.style.transition = ''
      // 		current.style.transform = `translateX(${
      // 			-100 - currentIndex * 100
      // 		}%)`
      // 		next.style.transform = `translateX(${-nextIndex * 100}%)`
      // 		currentIndex = nextIndex
      // 	}, 16)
      // }, 3000)

      return this.root;
    }
  }]);

  return Carousel;
}(_framework__WEBPACK_IMPORTED_MODULE_0__.Component);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Carousel);

/***/ }),

/***/ "./src/cubicBezier.js":
/*!****************************!*\
  !*** ./src/cubicBezier.js ***!
  \****************************/
/*! namespace exports */
/*! export ease [provided] [no usage info] [missing usage info prevents renaming] */
/*! export easeIn [provided] [no usage info] [missing usage info prevents renaming] */
/*! export easeInOut [provided] [no usage info] [missing usage info prevents renaming] */
/*! export easeOut [provided] [no usage info] [missing usage info prevents renaming] */
/*! export liner [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "liner": () => /* binding */ liner,
/* harmony export */   "ease": () => /* binding */ ease,
/* harmony export */   "easeIn": () => /* binding */ easeIn,
/* harmony export */   "easeOut": () => /* binding */ easeOut,
/* harmony export */   "easeInOut": () => /* binding */ easeInOut
/* harmony export */ });
function cubicBezier(a1, a2, a3, a4, t) {
  return a1 * (1 - t) * (1 - t) * (1 - t) + 3 * a2 * t * (1 - t) * (1 - t) + 3 * a3 * t * t * (1 - t) + a4 * t * t * t;
}

var liner = cubicBezier.bind(null, 0, 0, 1, 1);
var ease = cubicBezier.bind(null, 0.25, 0.1, 0.25, 1);
var easeIn = cubicBezier.bind(null, 0.42, 0, 1, 1);
var easeOut = cubicBezier.bind(null, 0, 0, 0.58, 1);
var easeInOut = cubicBezier.bind(null, 0.42, 0, 0.58, 1);

/***/ }),

/***/ "./src/framework.js":
/*!**************************!*\
  !*** ./src/framework.js ***!
  \**************************/
/*! namespace exports */
/*! export Component [provided] [no usage info] [missing usage info prevents renaming] */
/*! export createElement [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => /* binding */ Component,
/* harmony export */   "createElement": () => /* binding */ createElement
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component() {// this.root = this.render()
    // this.attributes = Object.create(null)

    _classCallCheck(this, Component);
  }

  _createClass(Component, [{
    key: "setAttribute",
    value: function setAttribute(name, value) {
      this.root.setAttribute(name, value);
    }
  }, {
    key: "appendChild",
    value: function appendChild(child) {
      child.mountTo(this.root);
    }
  }, {
    key: "mountTo",
    value: function mountTo(parent) {
      parent.appendChild(this.root);
    }
  }]);

  return Component;
}();

var ElementWrapper = /*#__PURE__*/function (_Component) {
  _inherits(ElementWrapper, _Component);

  var _super = _createSuper(ElementWrapper);

  function ElementWrapper(type) {
    var _this;

    _classCallCheck(this, ElementWrapper);

    // super()
    // this.type = type
    // this.root = this.render()
    _this.root = document.createElement(type);
    return _possibleConstructorReturn(_this);
  }

  _createClass(ElementWrapper, [{
    key: "render",
    value: function render() {
      return document.createElement(this.type);
    }
  }]);

  return ElementWrapper;
}(Component);

var TextWrapper = /*#__PURE__*/function (_Component2) {
  _inherits(TextWrapper, _Component2);

  var _super2 = _createSuper(TextWrapper);

  function TextWrapper(content) {
    var _this2;

    _classCallCheck(this, TextWrapper);

    _this2 = _super2.call(this);
    _this2.content = content;
    _this2.root = _this2.render();
    return _this2;
  }

  _createClass(TextWrapper, [{
    key: "render",
    value: function render() {
      return document.createTextNode(this.content);
    }
  }]);

  return TextWrapper;
}(Component);

function createElement(type, attributes) {
  var element = null;

  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }

  for (var name in attributes) {
    element.setAttribute(name, attributes[name]);
  }

  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  for (var _i = 0, _children = children; _i < _children.length; _i++) {
    var child = _children[_i];

    if (typeof child === 'string') {
      child = new TextWrapper(child);
    }

    element.appendChild(child);
  }

  return element;
}

/***/ }),

/***/ "./src/gesture.js":
/*!************************!*\
  !*** ./src/gesture.js ***!
  \************************/
/*! namespace exports */
/*! export enableGesture [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "enableGesture": () => /* binding */ enableGesture
/* harmony export */ });
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Listener = function Listener(element, recognizer) {
  _classCallCheck(this, Listener);

  this.recognizer = recognizer;
  var contexts = new Map();
  var isListenerMouse = true;
  element.addEventListener('mousedown', function (event) {
    var context = Object.create(null);
    contexts.set('mouse' + (1 << event.button), context);
    recognizer.start(event, context);

    var mousemove = function mousemove(event) {
      var button = 1;

      while (button <= event.buttons) {
        if (button & event.buttons) {
          var key = void 0;

          if (button === 2) {
            key = 4;
          } else if (button === 4) {
            key = 2;
          } else {
            key = button;
          }

          var _context = contexts.get('mouse' + key);

          recognizer.move(event, _context);
        }

        button = button << 1;
      }
    };

    var mouseup = function mouseup(event) {
      var context = contexts.get('mouse' + (1 << event.button));
      recognizer.end(event, context);
      contexts["delete"]('mouse' + (1 << event.button));

      if (event.buttons === 0) {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        isListenerMouse = true;
      }
    };

    if (isListenerMouse) {
      document.addEventListener('mouseup', mouseup);
      document.addEventListener('mousemove', mousemove);
      isListenerMouse = false;
    }
  });
  element.addEventListener('touchstart', function (event) {
    var _iterator = _createForOfIteratorHelper(event.changedTouches),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var touch = _step.value;
        var context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  element.addEventListener('touchmove', function (event) {
    var _iterator2 = _createForOfIteratorHelper(event.changedTouches),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var touch = _step2.value;
        var context = contexts.get(touch.identifier);
        recognizer.move(touch, context);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  });
  element.addEventListener('touchend', function (event) {
    var _iterator3 = _createForOfIteratorHelper(event.changedTouches),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var touch = _step3.value;
        var context = contexts.get(touch.identifier);
        recognizer.end(touch, context);
        contexts["delete"](touch.identifier);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  });
  element.addEventListener('touchcancel', function (event) {
    var _iterator4 = _createForOfIteratorHelper(event.changedTouches),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var touch = _step4.value;
        var context = contexts.get(touch.identifier);
        recognizer.cancel(touch, context);
        contexts["delete"](touch.identifier);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  });
};

var Recognizer = /*#__PURE__*/function () {
  function Recognizer(dispatcher) {
    _classCallCheck(this, Recognizer);

    this.dispatcher = dispatcher;
  }

  _createClass(Recognizer, [{
    key: "start",
    value: function start(point, context) {
      var _this = this;

      context.startX = point.clientX;
      context.startY = point.clientY;
      context.isTap = true;
      context.isPress = false;
      context.isPan = false;
      context.points = [{
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      }]; // 按压

      context.handle = setTimeout(function () {
        context.isTap = false;
        context.isPress = true;
        context.isPan = false;
        context.handle = null; // console.log('press')

        _this.dispatcher.dispatch('press', {});
      }, 500);
    }
  }, {
    key: "move",
    value: function move(point, context) {
      var dx = point.clientX - context.startX;
      var dy = point.clientY - context.startY; // 移动距离超过误差范围

      if (!context.isPan && Math.pow(dx, 2) + Math.pow(dy, 2) > 100) {
        context.isPan = true;
        context.isTap = false;
        context.isPress = false;
        context.isVertical = Math.abs(dx) < Math.abs(dy);
        this.dispatcher.dispatch('panstart', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical
        });
        clearTimeout(context.handle);
      }

      if (context.isPan) {
        this.dispatcher.dispatch('pan', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical
        });
      }

      context.points = context.points.filter(function (point) {
        return Date.now() - point.t < 500;
      });
      context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      });
    }
  }, {
    key: "end",
    value: function end(point, context) {
      // 点击
      if (context.isTap) {
        clearTimeout(context.handle);
        this.dispatcher.dispatch('tap', {});
      } // 按压


      if (context.isPress) {
        this.dispatcher.dispatch('pressend', {});
      }

      context.points = context.points.filter(function (point) {
        return Date.now() - point.t < 500;
      });
      var v = 0,
          d = 0;

      if (!context.points.length) {
        v = 0;
      } else {
        var p = context.points[0];
        d = Math.sqrt(Math.pow(point.clientX - p.x, 2) + Math.pow(point.clientY - p.y, 2));
        v = d / (Date.now() - p.t);
      } // 快速滑动


      if (v > 1.5) {
        this.dispatcher.dispatch('flick', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick,
          velocity: v
        });
        context.isFlick = true;
      } else {
        context.isFlick = false;
      } // 移动


      if (context.isPan) {
        this.dispatcher.dispatch('panend', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          isVertical: context.isVertical,
          isFlick: context.isFlick
        });
      }
    }
  }, {
    key: "cancel",
    value: function cancel(point, context) {
      clearTimeout(context.handle);
      this.dispatcher.dispatch('cancel', {});
    }
  }]);

  return Recognizer;
}();

var Dispatcher = /*#__PURE__*/function () {
  function Dispatcher(element) {
    _classCallCheck(this, Dispatcher);

    this.element = element;
  }

  _createClass(Dispatcher, [{
    key: "dispatch",
    value: function dispatch(type, properties) {
      var event = new Event(type);

      for (var name in properties) {
        event[name] = properties[name];
      }

      this.element.dispatchEvent(event);
    }
  }]);

  return Dispatcher;
}();

function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _framework__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./framework */ "./src/framework.js");
/* harmony import */ var _carousel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./carousel */ "./src/carousel.js");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./animation */ "./src/animation.js");
;


var images = ['./src/assets/images/a1.png', './src/assets/images/a2.png', './src/assets/images/a3.png', './src/assets/images/a4.png', './src/assets/images/a5.png', './src/assets/images/a6.png'];
var a = (0,_framework__WEBPACK_IMPORTED_MODULE_0__.createElement)(_carousel__WEBPACK_IMPORTED_MODULE_1__.default, {
  src: images
});
a.mountTo(document.body); // let tl = new TimeLine()
// let animation = new Animation({}, length, 0, 100, 1000, 1000, null)
// tl.add(animation, Date.now() + 1000)
// tl.start()

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/main.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=main.js.map