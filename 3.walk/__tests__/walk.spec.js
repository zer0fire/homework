describe('walk 测试', () => {
    test('单个节点', () => {
        // 建立 
        const ast = {
            "type": "Program",
            "start": 0,
            "end": 279,
            "body": [
              {
                "type": "VariableDeclaration",
                "start": 178,
                "end": 197,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 184,
                    "end": 189,
                    "id": {
                      "type": "Identifier",
                      "start": 184,
                      "end": 185,
                      "name": "a"
                    },
                    "init": {
                      "type": "Literal",
                      "start": 188,
                      "end": 189,
                      "value": 0,
                      "raw": "0"
                    }
                  },
                  {
                    "type": "VariableDeclarator",
                    "start": 191,
                    "end": 196,
                    "id": {
                      "type": "Identifier",
                      "start": 191,
                      "end": 192,
                      "name": "b"
                    },
                    "init": {
                      "type": "Literal",
                      "start": 195,
                      "end": 196,
                      "value": 1,
                      "raw": "1"
                    }
                  }
                ],
                "kind": "const"
              },
              {
                "type": "IfStatement",
                "start": 198,
                "end": 232,
                "test": {
                  "type": "Literal",
                  "start": 202,
                  "end": 206,
                  "value": true,
                  "raw": "true"
                },
                "consequent": {
                  "type": "BlockStatement",
                  "start": 208,
                  "end": 232,
                  "body": [
                    {
                      "type": "VariableDeclaration",
                      "start": 214,
                      "end": 230,
                      "declarations": [
                        {
                          "type": "VariableDeclarator",
                          "start": 220,
                          "end": 229,
                          "id": {
                            "type": "Identifier",
                            "start": 220,
                            "end": 221,
                            "name": "c"
                          },
                          "init": {
                            "type": "Literal",
                            "start": 224,
                            "end": 229,
                            "value": "123",
                            "raw": "'123'"
                          }
                        }
                      ],
                      "kind": "const"
                    }
                  ]
                },
                "alternate": null
              },
              {
                "type": "FunctionDeclaration",
                "start": 233,
                "end": 267,
                "id": {
                  "type": "Identifier",
                  "start": 242,
                  "end": 245,
                  "name": "fn1"
                },
                "expression": false,
                "generator": false,
                "async": false,
                "params": [],
                "body": {
                  "type": "BlockStatement",
                  "start": 248,
                  "end": 267,
                  "body": [
                    {
                      "type": "VariableDeclaration",
                      "start": 254,
                      "end": 265,
                      "declarations": [
                        {
                          "type": "VariableDeclarator",
                          "start": 260,
                          "end": 265,
                          "id": {
                            "type": "Identifier",
                            "start": 260,
                            "end": 261,
                            "name": "d"
                          },
                          "init": {
                            "type": "Literal",
                            "start": 264,
                            "end": 265,
                            "value": 1,
                            "raw": "1"
                          }
                        }
                      ],
                      "kind": "const"
                    }
                  ]
                }
              },
              {
                "type": "VariableDeclaration",
                "start": 268,
                "end": 279,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 274,
                    "end": 279,
                    "id": {
                      "type": "Identifier",
                      "start": 274,
                      "end": 275,
                      "name": "e"
                    },
                    "init": {
                      "type": "Literal",
                      "start": 278,
                      "end": 279,
                      "value": 3,
                      "raw": "3"
                    }
                  }
                ],
                "kind": "const"
              }
            ],
            "sourceType": "module"
          }
        // 假函数，会记录调用次数
        const { walk, enter, leave } = require('../walk')

        // 执行一次创建一次 fn 的实例，特点是被调用的时候会被记录运行
        const mockEnter = jest.fn()
        const mockLeave = jest.fn()
        
        walk(ast, { enter, leave })
        // calls 是个数组，调用一次增加一个成员，mock 是属性
        // let calls = mockEnter.mock.calls
        // expect(calls.length).toBe(2)
        // // calls[0][0] 表示第一次调用的第一个参数
        // expect(calls[0][0]).toEqual({ 
        //     a: 1, 
        //     children: [
        //         {
        //             b: 2
        //         }
        //     ]
        // })

        // calls = mockLeave.mock.calls
        // expect(calls.length).toBe(2)
        // // calls[0][0] 表示第一次调用的第一个参数
        // expect(calls[0][0]).toEqual({ 
        //     a: 1, 
        //     children: [
        //         {
        //             b: 2
        //         }
        //     ]
        // })


        // 数组的情况
        // 这里是 enter
        // let calls = mockEnter.mock.calls;

        // expect(calls.length).toBe(3);
        // expect(calls[0][0]).toEqual({ a: [{ b: "2" }] });
        // expect(calls[1][0]).toEqual([{ b: "2" }]);
        // expect(calls[2][0]).toEqual({ b: "2" });
    
        // calls = mockLeave.mock.calls;
    
        // expect(calls.length).toBe(3);
        // expect(calls[0][0]).toEqual({ b: "2" });
        // expect(calls[1][0]).toEqual([{ b: "2" }]);
        // expect(calls[2][0]).toEqual({ a: [{ b: "2" }] });
        
        // 对象的情况
    })
})
