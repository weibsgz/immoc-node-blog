const {login} = require('../controller/user')
const { SuccessModel , ErrorModel } = require('../model/resModel')
var express = require('express');
var router = express.Router();

router.post('/login', function(req, res, next) {
    //app.js里通过app.use(express.json())已经将请求数据挂在到req.body上了
    //测试POST用POSTMAN
    const {username,password} = req.body
    //const {username,password} = req.query
    //查询sql
    const result = login(username,password)

    return result.then(data=>{
        console.log('router/user.js中登录的data: ',data) // RowDataPacket { username: 'zhangsan', realname: '张   三' }

        if(data.username) {
            //设置SEESION express-session自动同步到redis
            req.session.username = data.username
            req.session.realname = data.realName

            res.json(
                new SuccessModel()
            )
            return 
        }
            res.json(
                new ErrorModel('登陆失败')
            )        
    })

});

//测试登录
//登录后再在浏览器输入这个接口
router.get('/login-test',(req,res,next)=>{
    if(req.session.username) {
        res.json({
            errno:0,
            msg:'测试登录成功'
        })
        return
    }
    res.json({
        errno:-1,
        msg:'未登录'
    })
})


//测试session 访问http://localhost:3000/api/user/session-test 多浏览器访问
router.get('/session-test',(req,res,next)=>{
    //app.js里已经用过session中间件
    const session = req.session
    if(!session.viewNum) {
        session.viewNum  = 0
    }
    session.viewNum++;
    res.json({
        viewNum:session.viewNum
    })
})
  

module.exports = router;
