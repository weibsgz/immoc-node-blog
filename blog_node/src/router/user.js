const {login} = require('../controller/user')
const { SuccessModel , ErrorModel } = require('../model/resModel')
const {set} = require('../db/redis')
const handleUserRouter = (req,res) =>{
    const method = req.method;

    //登录

    if(method === 'POST' && req.path === '/api/user/login') {
        const {username,password} = req.body
        //const {username,password} = req.query
        const result = login(username,password)

        return result.then(data=>{
            if(data.username) {
                //设置SEESION
                req.session.username = data.username
                req.session.realname = data.realName

                //同步到redis app.js中定义了
                // 这样访问http://localhost:8000/api/user/login-test
                // 打开CMD的 redis窗口 redis-cli.exe
                // keys * 就有这个 userid 一大堆随机数的KEY了
                //http://localhost:8000/api/user/login?username=zhangsan&password=123
                //就能存入usernmae了
                set(req.sessionId, req.session)

                console.log('req.seesion is ', req.session)
                return new SuccessModel()
            }
            return new ErrorModel('登陆失败')
        })

    }

    //登錄驗證的測試
    if(method === 'GET' && req.path === '/api/user/login-test') {
        if(req.session.username) {
            return Promise.resolve(new SuccessModel({
                session:req.session
            }))
        }
        return  Promise.resolve(new ErrorModel('尚未登录'))
    }
}




module.exports = handleUserRouter