### Type Convertion 类型转换

|      原始值      | 转换为 Number |   转换为 String   | 转换为 Boolean |
| :--------------: | :-----------: | :---------------: | :------------: |
|      false       |       0       |      "false"      |     false      |
|       true       |       1       |      "true"       |      true      |
|        0         |       0       |        "0"        |     false      |
|        1         |       1       |        "1"        |      true      |
|       "0"        |       0       |        "0"        |      true      |
|       "1"        |       1       |        "1"        |      true      |
|       NaN        |      NaN      |       "NaN"       |     false      |
|     Infinity     |   Infinity    |    "Infinity"     |      true      |
|    -Infinity     |   -Infinity   |    "-Infinity"    |      true      |
|        ""        |       0       |        ""         |     false      |
|       "20"       |      20       |       "20"        |      true      |
|     "twenty"     |      NaN      |     "twenty"      |      true      |
|        []        |       0       |        ""         |      true      |
|       [20]       |      20       |       "20"        |      true      |
|     [10,20]      |      NaN      |      "10,20"      |      true      |
|    ["twenty"]    |      NaN      |     "twenty"      |      true      |
| ["ten","twenty"] |      NaN      |   "ten,twenty"    |      true      |
|   function(){}   |      NaN      |  "function(){}"   |      true      |
|        {}        |      NaN      | "[object Object]" |      true      |
|       null       |       0       |      "null"       |     false      |
|    undefined     |      NaN      |    "undefined"    |     false      |

### Unboxing（拆箱转换）

-   `ToPremitive`
    -   如遇到 `object` 参与运算，如 `object + object` 时，都会调用 `ToPremitive` 过程。
-   `toString vs valueOf`
    -   加法会优先调用 `valueOf` 方法，即使是字符串+对象，如 `'x' + o`，如果没有 `valueOf` 和 `Symbol.toPrimitive` 方法才会调用 `toString`，但是当 `object` 作为属性名的时候则会优先调用 `toString` 方法，如`x[o]`。
-   `Symbol.toPrimitives`
    -   优先级最高，如果调用了该方法，则会忽略 `toString` 和 `valueOf` 方法。

### Boxing（装箱转换）

| 类型    | 对象                    | 值          |
| ------- | ----------------------- | ----------- |
| Number  | new Number(1)           | 1           |
| String  | new String('a')         | 'a'         |
| Boolean | new Boolean(true)       | true        |
| Symbol  | new Object(Symbol('a')) | Symbol('a') |

> 若用 Member 运算符或者方括号去访问属性时，若被访问者是一个基础类型，则会自动调用装箱转换，如 `1 .tostring()`，1 后面必须有空格。原因：

```js
// 下面的测试案例是 https://www.jianshu.com/p/71d8d56f60b0 这位大佬的文章里摘抄并修改的。
1toString() // 报错，语法错误
1.toString() // 报错，JS引擎无法确定这里的`.`是什么意思，是点运算符（对象方法）还是浮点数？
1..toString() // 成功，运算结果"1" 解析: 第二个点被视为点运算符，前面的点是浮点数。
1.0.toString() // 成功，运算结果"1" 解析: 第二个点被视为点运算符，前面的点是浮点数。
1 .toString() // 成功，运算结果"1" 解析: 用空格和后面的.toString()隔开, 把前面的当成运算式处理
1['toString']() // 成功，运算结果“1” 解析：1会执行装箱操作调用new Number(1)之后在Number类中查找toString函数并执行
1 + 2.toString() // 报错，JS引擎无法确定这里的`.`是什么意思，是点运算符（对象方法）还是浮点数？
1 + 2 .toString() // 成功，运算结果"12" 解析: 用空格和后面的.toString()隔开, 把前面的当成运算式处理
(1 + 2).toString() // 成功，运算结果"3" 解析: 括号内部的先进行算法运算，在进行类型转换
(1) + (2).toString() // 运算s结果"12" 解析: 括号内部进行类型修改并将数字n转换为字符串“n “，在进行拼接，然后再应用toString方法。
(1) + (2) + 0 .toString() // 成功，运算结果"30" 解析: 如果有多个`+`号，且不包含中括号与""的情况下，则把最后一个加号之前的进行数学运算(不管他有没有被括号包住)，最后一个加号留作拼接作用。
(1) + (2) + 0 + (11) .toString() // 成功，运算结果"311" 解析: 同上
(1) + (2) + 0 + 12 .toString() // 成功，运算结果"312" 解析: 同上
([1] + [2] + [3]) + 12 .toString() // 成功，运算结果"12312" 解析: 如果里面只有方括号(单个数值的数组)，则+起连接作用
((1) + (2) + [3]) + 12 + 43 .toString() // 成功，运算结果"331243" 解析: 如果里面包含圆括号，则先要进行运算，再把运算的结果与后面的内容拼接起来。
(1) + (2) + 6 + 2 + 5 + "(15)" + 1 + 0 + (1) .toString() // 成功，运算结果"16(15)101"解析: 如果字符串包裹的前面有多个加号，则把字符串双引号前面的进行运算(不管他有没有被圆括号包住)，得到的数值拼接上字符串包裹的内容再拼接上之后的内容。
```

> `number 类型`和 `number 类`不是同一个东西，我们可以通过 `typeof` 进行区分

```js
console.log(typeof new Number(1)) // object
console.log(typeof 1) // number
```
