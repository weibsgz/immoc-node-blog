const fs = require('fs')
const path = require('path') 

const filename = path.resolve(__dirname,'log.txt')

//读取文件内容

// fs.readFile(filename,(err,data)=>{
//     if(err) {
//         console.error(err)
//         return
//     }
//     //二进制要换成字符串类型
//     console.log(data.toString())
// })

//写入内容
// const content = '这是要写入的内容\n'
// const opt = {
//     flag:'a'  //a 是追加内容  w是覆盖内容
// }

// fs.writeFile(filename,content,opt,(err)=>{
//     if(err) {
//         console.log(err)        
//     }
// })

//判断文件是否存在
// fs.exists(filename,exist=>{
//     console.log('exist',exist)
// })