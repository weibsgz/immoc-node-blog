const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [],   // app.use(...)
            get: [],   // app.get(...)
            post: []   // app.post(...)
        }
    }
    //注冊中間件方法 打開express-test 看下app.js中間件的使用形式
    //app.use/app.get/app.post 第一個參數是一個字符串的URl 或者 直接是一個函數
    register(path) {
        const info = {}
        if (typeof path === 'string') {
            info.path = path
            // 从第二个参数开始就是函數，转换为数组，存入 stack
            //slice() 方法返回一个新的数组对象 slice.call數組
           
            info.stack = slice.call(arguments, 1)
        } else {
            info.path = '/'
            console.log(this,arguments)
            // 从第一个参数开始，转换为数组，存入 stack
            info.stack = slice.call(arguments, 0)
        }
        return info
    }

    use() {
        //app.use()里边传入的参数有可能是url 有可能是函数 他们都是arguments
        //相当于运行了 register(arguments)
       // console.log(arguments) //一个FUNCTION
       //arguments通常认为是一个类数组 
       //用apply的特性可以将其中的数组元素将作为单独的参数传给 register 函数
       //如果不用apply arguments在regster里打印出来是 { '0': [Function] }
        //用了apply则是一个函数(req, res, next) => {
    // console.log('请求开始...', req.method, req.url)
    // next()

        const info = this.register.apply(this,arguments)
        this.routes.all.push(info)
    }

    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }

    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }

    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }

        // 获取 routes
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all) //app.use注册的
        curRoutes = curRoutes.concat(this.routes[method])

        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                // url === '/api/get-cookie' 且 routeInfo.path === '/'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api/get-cookie'
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    // 核心的 next 机制
    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
          
            const middleware = stack.shift()

            console.log('middleware',middleware)
            if (middleware) {
                // 执行中间件函数
                middleware(req, res, next)
            }
        }
        next()
    }

    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()
            //看哪些中间件需要访问哪些不需要访问
            // 如果路由没命中啊 这种就是不需要访问
            const resultList = this.match(method, url)
            this.handle(req, res, resultList)
        }
    }
    //...args剩余参数语法允许我们将一个不定数量的参数表示为一个数组。
    // function test(...arg) {
    //     arg.forEach(v=>{                                    
    //         console.log(v)
    //     })
    // }
    // test(1,2,3,4) //1,2,3,4
    listen() {
        // console.log(...arguments)
        const server = http.createServer(this.callback())
        var arg = Array.prototype.slice.call(arguments)
        console.log(arg)
        server.listen(...arg)
    }
}

// 工厂函数
module.exports = () => {
    return new LikeExpress()
}