const express = require('express')
 
//运行后 浏览器输入 localhost:3000/api/get-cookie
//执行顺序  app.use  app.get app.post会同步走下去 只要有NEXT() 没有NEXT()后边的USE，get,POST都不会执行
//除非遇到比如GET请求 api.post不会执行  或者 路由没有匹配也不会执行

//本次APP请求的实例
const app = express()

app.use((req,res,next)=>{
    console.log('请求开始。。。',req.method,req.url)
    next()
})

app.use((req,res,next)=>{
    //假设在处理cookie
    req.cookie = {
        userId:'abc123'
    }
    next()
})


app.use((req,res,next)=>{
    //假设处理POSTDATA 异步
    setTimeout(()=>{
        req.body = {
            a:100,
            b:200
        }
        next()
    },100)

})

app.use('/api',(req,res,next)=>{
    console.log('处理API路由')
    next()
})

app.get('/api',(req,res,next)=>{
    console.log('get 处理API路由')
    next()
})

app.post('/api',(req,res,next)=>{
    console.log('post 处理API路由')
    next()
})

function loginCheck(req,res,next) {
    console.log('模拟登陆成功')
    setTimeout(()=>{
        next()
    })
}
//也可以这样写多个函数
app.get('/api/get-cookie',loginCheck,(req,res,next)=>{
    console.log('/api/get-cookie')
    res.json({
        errno:0,
        data:req.cookie
    })
})

app.post('/api/get-post-data',(req,res,next)=>{
    console.log('post /api/get-post-data')
    res.json({
        errno:0,
        data:req.body
    })
})

app.use((req,res,next)=>{
    console.log('处理404')
    res.json({
        erron:-1,
        msg:'404 not found'
    })
})

app.listen(3000,()=>{
    console.log(`server is running at 3000`)
})