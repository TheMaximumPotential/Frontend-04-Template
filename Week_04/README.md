学习笔记

## 泛用语言分类方法

> 乔姆斯基体系是由诺·乔姆斯基于 1956 年提出的，是刻画形式文法表达能力的一个分类谱系。它包括四个层次：

| 文法 |      语言      |        自动机        |      产生式规则      |
| :--: | :------------: | :------------------: | :------------------: |
| 0-型 | 递归可枚举语言 |        图灵机        |        无限制        |
| 1-型 | 上下文相关语言 | 线性有界非确定图灵机 |      αAβ -> αγβ      |
| 2-型 | 上下文无关语言 |   非确定下推自动机   |        A -> γ        |
| 3-型 |    正规语言    |    有限状态自动机    | A -> aB <br/> A -> a |

> 自动机：https://baike.baidu.com/item/%E8%87%AA%E5%8A%A8%E6%9C%BA/7444872?fr=aladdin

哎，完全看不懂自动机是什么...

## 什么是产生式

> 产生式： 在计算机中指 Tiger 编译器将源程序经过词法分析（Lexical Analysis）和语法分析（Syntax Analysis）后得到的一系列符合文法规则（Backus-Naur Form，BNF）的语句

> 巴科斯诺尔范式：即巴科斯范式（英语：Backus Normal Form，缩写为 BNF）是一种用于表示上下文无关文法的语言，上下文无关文法描述了一类形式语言。它是由约翰·巴科斯（John Backus）和彼得·诺尔（Peter Naur）首先引入的用来描述计算机语言语法的符号集。

> 终结符： 最终在代码中出现的字符（ https://zh.wikipedia.org/wiki/ 終結符與非終結符)，不能再分解。

## 编程语言的性质

> 静态语言（强类型语言）：
> 静态语言是在编译时变量的数据类型即可确定的语言，多数静态类型语言要求在使用变量之前必须声明数据类型。
> 例如：C++、Java、Delphi、C#等。

> 动态语言（弱类型语言）：
> 动态语言是在运行时确定数据类型的语言。变量使用之前不需要类型声明，通常变量的类型是被赋值的那个值的类型。
> 例如：PHP/ASP/Ruby/Python/Perl/ABAP/SQL/JavaScript/Unix Shell 等等。

> 强类型定义语言：
> 强制数据类型定义的语言。也就是说，一旦一个变量被指定了某个数据类型，如果不经过强制转换，那么它就永远是这个数据类型了。举个例子：如果你定义了一个整型变量 a,那么程序根本不可能将 a 当作字符串类型处理。强类型定义语言是类型安全的语言。

> 弱类型定义语言：
> 数据类型可以被忽略的语言。它与强类型定义语言相反, 一个变量可以赋不同数据类型的值。强类型定义语言在速度上可能略逊色于弱类型定义语言，但是强类型定义语言带来的严谨性能够有效的避免许多错误。

## Number

> 关于 js 中 0.1+0.2 !== 0.3 的问题，看这两篇关于 IEEE754 标准下的浮点数运算的详细计算过程就懂了

1. https://segmentfault.com/a/1190000008268668
2. https://developers.weixin.qq.com/community/develop/article/doc/000ccc707b06d82b47aad9c6551813

## String

> charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。

> encodeURI() 函数可把字符串作为 URI 进行编码。

```js
const UTF_Encodeing = (string) => {
	let code = encodeURI(string)
	let codeList = []
	let i = 0
	while (i < code.length) {
		if (code[i] === '%') {
			codeList.push(parseInt(code[i + 1] + code[i + 2], 16))
			i += 3
		} else {
			codeList.push(code[i].charCodeAt())
			i++
		}
	}
	return Buffer.from(codeList)
}
console.log(UTF_Encodeing('今天天气不错'))
```

## 其他类型

> symbol：每个从 Symbol()返回的 symbol 值都是唯一的。一个 symbol 值能作为对象属性的标识符；这是该数据类型仅有的目的。

> undefined: 建议写 void 0

## 对象的基础知识

```js
class Dog {
	constructor(name) {
		this.name = '狗'
	}
}

class Human {
	hurt(obj) {
		console.log(`我被${obj.name}伤害了`)
	}
}

const dog = new Dog()
const me = new Human()

me.hurt(dog) // 我被狗伤害了
```
