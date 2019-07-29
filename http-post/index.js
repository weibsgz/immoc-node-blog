
//使用POSTMAN 模拟请求  选择POST方式 填写JSON 访问http://localhost:8100



const http = require('http')


const server = http.createServer((req,res)=>{
    if(req.method  === 'POST') {
        console.log('req content-type',req.headers['content-type']) //JSON

        let postData = ''
        //一点一点接受数据 然后拼接起来
        req.on('data',chunk=>{
            postData += chunk.toString()
        })
        //接受完毕触发req的END
        req.on('end',()=>{
             console.log('postData: ' + postData)
             res.end('hello world')
        })
    }
})

server.listen(8100,()=>{
    console.log('server is linstening at 8100 port')
})