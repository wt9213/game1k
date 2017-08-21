
let cccc = 0

const getMaxSave = (sourceCode) => {
    let arr = sourceCode.split('')//!!!!!!!!!!
    let saveArr = []// as { str: string, count: number, save: number }[]

    let f = (n) => {
        let dic = Object.create(null)

        arr.forEach((v, i) => {
            if (i < arr.length - n + 1) {
                v = arr.slice(i, i + n).join('')
                if (dic[v] == null) dic[v] = 0
                dic[v]++
            }
        })

        // a | b | c | AAAA

        for (let k in dic) {
            let count = dic[k]
            if (count != 1) {
                saveArr.push({
                    str: k,
                    count,
                    save: n * count - count - n - 1//
                })
            }
        }
    }

    for (let i = 2; i < 32; i++) {//
        f(i)
    }

    saveArr.sort((a, b) => b.save - a.save)
    if (saveArr[0] && saveArr[0].save > 0)
        return saveArr[0]
    else
        return null
}


const getTable = (sourceCode) => {
    let table = []//string[]ƒ
    for (let i = 1; i < 128; i++) {
        let s = String.fromCharCode(i)
        if (
            i != '`'.charCodeAt(0) &&
            i != '\\'.charCodeAt(0) &&
            i != '\r'.charCodeAt(0) &&
            sourceCode.indexOf(s) == -1)
            table.push(s)
    }
    return table
}

const compress = sourceCode => {
    let table = getTable(sourceCode)
    let tableStr = ''
    while (table.length > 0) {
        let oneChar = table.pop()
        let obj = getMaxSave(sourceCode)
        if (obj == null) break
        let s = obj.str
        console.log(`${++cccc} "${s}"  ${oneChar.charCodeAt(0)} count:${obj.count}  save:${obj.save}`)
        tableStr += oneChar
        sourceCode = sourceCode.split(s).join(oneChar) + oneChar + s
    }
    tableStr = tableStr.split('').reverse().join('')
    let output = '_=`' + sourceCode + '`;for(Y in $=`' + tableStr + '`)with(_.split($[Y]))_=join(pop());eval(_)'
    return output
}



let fs = require('fs')


let s = fs.readFileSync('src.js', 'utf-8')


//
s = s.replace(/\/\/start[\s\S\r\n]+?\/\/end/g, '')

//去单行注释
s = s.replace(/\/\/.*/g, '')

// //去空格回车
s = s.replace(/40px /g, 'zzzzzzzzzzzzzz')
s = s.replace(/[ \r\n]+/g, '')
s = s.replace(/zzzzzzzzzzzzzz/g, '40px ')





let unesed = 'defghklmopqrstuw'
let ok = unesed.split('')

let r = (a, b) => s = s.split(a).join(b)

r('状态_左_', -1)
r('状态_右_', 0)

r('状态_开始_', 1)
r('状态_正常_', 2)

r('状态_开始下落_', 3)
r('状态_结束下落_', 14)//--> top 爆炸 end

r('状态_爆炸_', 15)
r('状态_爆炸结束_', 26)//--> 开始下落

r('状态_游戏结束_', 27)


let abc = unesed.split('')

    ;[
        '动画开始位置x', '动画开始位置y',
        '动画结束位置x', '动画结束位置y',
        '动画开始时间', '是结束',
        '到xy', '到x', '到y'
    ].forEach(v => {
        s = s.split(v).join(abc.pop())
    })

    //关键词
    ;[
        '结束下落标记',
        '状态', '现在时间', '出现方块x坐标',
        '地图', '动画到',
        '渲染', '时光', '倒流', '计数器'
    ].forEach(v => {
        s = s.split(v).join(ok.pop())
    })


s = compress(s)
fs.writeFileSync('./../index.js', s)
console.log(s.length, s.length - 1024)