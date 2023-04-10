子状态机 - parseElement -> 内部循环，循环转递归

jest 命令，跑单独的测试用例

jest -t "parse props and directive"

html ast -> transform -> js ast -> 生成代码

- template -> ast -> render function (js function)
- 1.  解析 template -> ast 中间产物，生产 ast 对象，可以做很多事情
- 2.  转换 transform: ast -> ast 深加工，一种转换成另外一种 html ast -> js ast
- 3.  生成 ast -> render function
- isUnary ，自闭合
