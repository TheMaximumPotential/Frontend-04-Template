## 运算符和表达式

### Expression

-   `Member`（由于搜索 `js` `Member` 运算符搜索不到，所以这里叫类似 `C++` 的成员运算符吧）
    -   `a.b`
    -   `a[b]`
    -   **foo\`string`**
        -   我搜了一下，这个东西叫标签函数，利用自定义函数处理模板字符串，函数的第一个参数是根据`${}`位置切割开的字符串数组，模板字符串的头和尾如果有`${}`则会多切割一个空串放进数组，后面所有的参数是`${}`的内容，有几个`${}`，后续参数就有多少，我用`...`扩展运算符放到数组里了（见下方代码示例）。
    -   `super.b`
    -   `super['b']`
    -   `new.target`
        -   在普通的函数调用中（和作为构造函数来调用相对），`new.target` 的值是 `undefined`（见下方代码示例）。
        -   在类的构造方法中，`new.target` 指向直接被 `new` 执行的构造函数（见下方代码示例）。
    -   `new Foo()`

> 以上七种表达式的优先级都是相同的

-   `New`
    -   `new Foo`

> 不加括号的 `new` 优先级比上面七种低，详情见下方代码最后一部分的举例打印。

```js
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

// new Foo 和 new Foo()的优先级比较
function Foo2() {
	return () => ({ a: 1 })
}
// new Foo2()()
console.log(new Foo2()())
// 根据打印结果看出，如果先执行 Foo2() 返回一个箭头函数，那么第二部执行new操作是会报错的，所以是先执行了new 操作符 // 问题：上式的执行顺序是 new [Foo2()] () 还是 [new Foo2()] ()，方括号括起来的部分为先执行的部分
// 即可以判断出new + 括号的运算符的优先级更高，之后才是函数执行。

// new new a()
// console.log(new new a())
// 问题：上述语句的括号是先和第一个new结合还是和第二个new结合
// 从上一个示例看出带括号的new优先级更高，所以括号会先和第二个new结合，之后变成new Foo再继续执行，所以new Foo的优先级低。
```

### Runtime 运行时的引用类型（Reference）

> a.b 操作访问了对象的属性，但是它从对象中取出来的可不是对象的值，而是一个引用，但引用不是 JS 的七种基本类型之一，但它确确实实存在于运行时，我们称它为标准中的类型而不是语言中的类型，一个 Reference 又两部分组成，第一部分是一个对象，第二部分是一个 key，对象就是 object，key 可以是 String 也可以是 Symbol，在处理 delete 或者 assign 相关的写操作时，就要知道操作的是哪个对象的哪个属性，即用到的引用类型。

-   `Call`（函数调用）
    -   `foo()`
    -   `super()`
    -   `foo()['b']`
    -   `foo().b`
    -   foo()\`abc\`

> `Call Expression` 的优先级没有上述 `Member` 和 `New` 的优先级高，所以导致后面的 `Member` 运算符的优先级也降低了，点运算的优先级是由它前面的表达式决定的。

> `new a()['b']`的优先级顺序是先 new 再取值

```js
const foo3 = () => (string, ...exp) => [string, ...exp]
// 和上方标签函数解析规则一样
console.log(foo3()`abc`) // [ [ 'abc' ] ]
```

-   Left Handside & Right Handside（左手运算和右手运算）

> 如果能放到等号左边的表达式就是 `Left Handside Expression`，比如`a.b`，否则就是 `Right Handside Expression`，比如`a+b`。并且`Left Handside Expression`一定是`Right Handside Expression`。

-   `Update`
    -   `a++`
    -   `a--`
    -   `--a`
    -   `++a`

> `Update Expression` 就是 `Right Handside Expression`，`++ a ++` 是不合法的。

-   `Unary`（单目运算符）

    -   `delete a.b`
    -   `void foo()`
        -   `void` 运算符对给定的表达式进行求值，然后返回 `undefined`。
    -   `typeof a`
    -   `+a`
        -   如果是字符串会发生类型转换转为数字
    -   `-a`
        -   同上
    -   `~a`
        -   按位取反，如果 `a` 不是整数，会把 `a` 强制转换为整数之后再按位取反。
    -   `!a`
    -   `await a`
        -   返回一个 Promise

-   `Exponential`（指数运算符）
    -   `\*\*`
        -   表示乘方运算

> `3 ** 2 ** 3` 的运算顺序是 `3 ** (2 ** 3)`从右到左。大部分运算符都是左结合的，唯有 `**` 是右结合的。

-   `Multiplicative`（乘法运算符）
    -   `\* / %`
-   `Additive`（加法运算符）
    -   `+ -`
-   `Shift`（移位运算符）
    -   `<< >> >>>`
-   `Relationship`(关系运算符)
    -   `< > <= >= instanceof in`
-   `Equality`（相等运算符）
    -   `==`
        -   转换规则见下集详解
    -   `!=`
    -   `===`
    -   `!==`
-   `Bitwise`（位运算符）
    -   `& ^ |`
-   `Logical`（逻辑运算符）
    -   `&&`
    -   `||`
-   `Conditional`（条件运算符）
    -   `? :`
