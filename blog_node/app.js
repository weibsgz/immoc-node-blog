
// const Promise = require('promise');

const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const { access } = require('./src/utils/log')
const handleUserRouter = require('./src/router/user')
const {get,set} = require('./src/db/redis')
//session数据
// const SESSION_DATA = {}


//获取COOKIE过期时间
const getCookieExpries =() =>{
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000 ))
    return d.toGMTString()
}


const serverHandle = (req, res) => {

     // 记录 access log
     access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    //设置返回格式
    res.setHeader('content-type', 'application/json')
    //获取PATH
    const url = req.url;
    req.path = url.split('?')[0]

    //获取QUERY
    req.query = querystring.parse(url.split('?')[1])
  
    //解析COOKIE
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''   //k1=v1;k2=v2;
    console.log('cookieStr: ',cookieStr)
    cookieStr.split(';').forEach(item=>{        
        if(!item) {
            return 
        }
        const arr = item.split('=');
        console.log('arr: ',arr)
        const key = arr[0].trim();
        const val = arr[1].trim();
        req.cookie[key] = val;
    })

    //解析 session
    // let needSetCookie = false;
    // let userId = req.cookie.userid;
    // if(userId) {
    //     if(!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }        
    // }
    // else{
    //     needSetCookie = true;
    //     //如果没有就随便给个值
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    //解析 session 使用redis
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if(!userId) {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`
        //初始化redis中的SESSION
        set(userId,{})
    }
    //获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData=>{
       if(sessionData == null) {
        set(req.sessionId,{})
        req.session = {}
       }
       else{
           req.session = sessionData
       }
       console.log('req.session ',req.session)
       //处理POSTDATA
       //这里必须改成链式调用了，因为req上挂在了SEESON 不改后边拿不到
       return getPostData(req)
    }).then(postData => {
        
        req.body = postData

        //处理BOLG路由 假数据
        // const blogData = handleBlogRouter(req, res)
        // if (blogData) {
        //     //http://localhost:8000/api/blog/list 返回数据
        //     res.end(JSON.stringify(blogData))
        //     return
        // }

        //因为返回promise所以改成这样
        const blogResult = handleBlogRouter(req, res)
        if(blogResult) {
            blogResult.then((blogData)=>{
                if(needSetCookie) {
                    res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${getCookieExpries()}`)
                }
                res.end(JSON.stringify(blogData))
                
            })
            return
        }


        //处理user路由
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(JSON.stringify(userData))
        //     return
        // }
        const userResult = handleUserRouter(req, res)
        if(userResult) {
            userResult.then(userData=>{
                if(needSetCookie) {
                    res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${getCookieExpries()}`)
                }
                res.end(JSON.stringify(userData))                
            })
            return
        }


        //未命中路由 返回404  现在直接访问 http://localhost:8000/ 返回404
        res.writeHead(404, { "content-type": "text/plain" })
        res.write('404 not found\n')
        res.end()
    })
}


const getPostData = req => {
    const myPromise = new Promise((resolve, reject) => {
        //只处理POST的请求 否则返回空对象
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        // 请求不是JSON 返回空对象
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        //拼接请求参数
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            //如果结果为空 返回空
            if (!postData) {
                resolve({})
                return
            }
            //一切正常RESOLVE 数据
            resolve(
                JSON.parse(postData)
            )
        })
    })

    return myPromise
}

module.exports = serverHandle