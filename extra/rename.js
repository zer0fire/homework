// 批量改文件名从中划线到驼峰，并修改引用
const fs = require("fs");
const childrenProcess = require("child_process");
const { exec } = childrenProcess;

function readFile(dir, callback) {
    const stat = fs.statSync(dir)
    if (stat.isFile() && ) {

    } else {

    }
}

function main() {
    const cwd = process.cwd();

    

    readFile(cwd, (dir) => {
        const list = dir.spilt('-')
        list[1] = list[1].replace(/-([a-z])/, (a, b) => b.toUpperCase())
        exec('mv ${} ${}')
    })
}

main();
