const a = { b: 1 }
const b = 'b'
const foo1 = (string, exp1, exp2) => [string, exp1, exp2]
const foo2 = (string, ...exp) => [string, exp]

console.log(a.b) // 1
console.log(a[b]) // 1
console.log(foo1`string${1}number${2}`) // [ [ 'string', 'number', '' ], 1, 2 ]
console.log(foo2`string${1}number${2}boolean`) // [ [ 'string', 'number', 'boolean' ], [ 1, 2 ] ]

class Dog {
	get b() {
		return 'WangWangWang!'
	}
}
class BlackDog extends Dog {
	call() {
		console.log(super.b) // WangWangWang!
		console.log(super['b']) // WangWangWang!
	}
}
new BlackDog().call()

// new.target 下方示例摘抄与MDN中

// 函数调用中的 new.target，测试函数是否是被 new 关键字调用
function Foo() {
	// if (!new.target) throw 'Foo() must be called with new'
	console.log('Foo instantiated with new')
}
Foo() // throws "Foo() must be called with new"
new Foo() // logs "Foo instantiated with new"

// 构造方法中的 new.target，方法指向初始化类的类定义
class A {
	constructor() {
		console.log(new.target.name)
	}
}
class B extends A {
	constructor() {
		super()
	}
}
var a1 = new A() // logs "A"
var b1 = new B() // logs "B"
class C {
	constructor() {
		console.log(new.target)
	}
}
class D extends C {
	constructor() {
		super()
	}
}
var c1 = new C() // logs class C{constructor(){console.log(new.target);}}
var d1 = new D() // logs class D extends C{constructor(){super();}}

// new Foo 和 new Foo()

function Foo2() {
	return () => ({ a: 1 })
}
console.log(new Foo2()())
// 问题：上式的执行顺序是 new [Foo2()] () 还是 [new Foo2()] ()，方括号括起来的部分为先执行的部分
// 根据打印结果看出，如果先执行 Foo2() 返回一个箭头函数，那么第二部执行new操作是会报错的，所以是先执行了new 操作符
// 即可以判断出new + 括号的运算符的优先级更高，之后才是函数执行。
// console.log(new new a())
// 问题：上述语句的括号是先和第一个new结合还是和第二个new结合
// 从上一个示例看出带括号的new优先级更高，所以括号会先和第二个new结合，之后变成new Foo再继续执行，所以new Foo的优先级低。
