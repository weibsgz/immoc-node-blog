// 标准输入输出 控制台输入
// process.stdin.pipe(process.stdout)

//可通过POSTMAN测试
// const http = require('http')
// const server = http.createServer((req,res)=>{
//     if(req.method === 'POST') {
//         req.pipe(res)
//     }
// })

// server.listen(9000)



//copy文件

// const fs = require('fs')
// const path = require('path')

// const filename1 = path.resolve(__dirname,'data.txt')
// const filename2 = path.resolve(__dirname,'data.bak.txt')

// const readStream = fs.createReadStream(filename1)
// const writeStream = fs.createWriteStream(filename2)
// //通过管道将第一个水桶和第二个水桶链接
// readStream.pipe(writeStream)

// readStream.on('data',(chunk)=>{
//     console.log(chunk.toString())
// })

// readStream.on('end',()=>{
//     console.log('copy done')
// })


//通过浏览器URL 访问http://localhost:9000/
const fs = require('fs')
const path = require('path')
const http = require('http')

const filename1 = path.resolve(__dirname,'data.txt')
const server = http.createServer((req,res)=>{
    if(req.method === 'GET') {
        const readStream = fs.createReadStream(filename1)
        readStream.pipe(res)
    }
})

server.listen(9000)






