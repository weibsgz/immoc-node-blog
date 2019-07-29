const http = require('http');
const querystring = require('querystring')

const server = http.createServer((req,res)=>{
    console.log(req.method)     //GET
    const url = req.url;
    console.log('url: ', url)

    req.query = querystring.parse(url.split('?')[1])
    console.log('query: ', req.query)

    res.end(
        JSON.stringify(req.query)
    )

})

server.listen(8000,()=>{
    //浏览器输入 localhost:8000/api/get?user=weibin&age=18
    console.log('server is linstening at 8000 port')
})

//NODE控制台返回结果：
// GET
// url:  /api/get?user=weibin&age=18
// query:  { user: 'weibin', age: '18' }
// GET
// url:  /favicon.ico
// query:  {}

