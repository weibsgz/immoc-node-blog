const http = require('http')
const querystring = require('querystring')


const server = http.createServer((req,res)=>{
    const method = req.method;
    const url = req.url
    const path = url.split('?')[0]
    const query = querystring.parse(url.split('?')[1])

    //设置返回格式为JSON
     res.setHeader('Content-type','application/json')
     
    //返回数据
    const resData = {
        method,
        url,
        path,
        query
    }

    //返回结果
    if(method  === 'GET') {
        res.end(JSON.stringify(resData))
    }

    if(method === 'POST') {
        let postData = ''
        //一点一点接受数据 然后拼接起来
        req.on('data',chunk=>{
            postData += chunk.toString()
        })
        //接受完毕触发req的END
        req.on('end',()=>{
            resData.postData = postData
            res.end(JSON.stringify(resData))
        })
      
    }

})

server.listen(8000,()=>{
    console.log('server is linstening at 8000 port')
})