const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const  loginCheck = require('../middleware/loginCheck')
var express = require('express');
var router = express.Router();

router.get('/list', function (req, res, next) {
    //res.json 相当于原生NODE的 res.end(JSON.stringify(data))
    //同时还可以设置响应头为application/json
    //   res.json({
    //       errno:0,
    //       data:[1,2,3]
    //   })

    //express里req.query自带分析链接后边的参数，如果是NODE原生还需要querstring来转
    let author = req.query.author || '';
    const keyword = req.query.keyword || '';

    if (req.query.isadmin) {
        // 管理员界面       
        if (req.session.username == null) {
            // 未登录
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        // 强制查询自己的博客
        author = req.session.username
    }

    const result = getList(author, keyword)

    result.then((listData) => {
        //http://localhost:8000/api/blog/list?author=zhangsan&keyword=C
        res.json(
            new SuccessModel(listData)
        )
    })

});
//详情页
router.get('/detail', function (req, res, next) {
    const result = getDetail(req.query.id);
    return result.then(detail => {
        //http://localhost:8000/api/blog/detail?id=2
        res.json(
            new SuccessModel(detail)
        )
    })
});
//新建博客
router.post('/new',loginCheck,(req, res, next) => { 
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
         res.json(
            new SuccessModel(data)
         )
    })
})

//更新
router.post('/update',loginCheck,(req,res,next)=>{
    const result = updateBlog(req.query.id, req.body)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        }
        else {
           res.json(
             new ErrorModel('更新博客失败')
           )
        }
    })
})

//刪除
router.post('/del',loginCheck,(req,res,next)=>{
    const author = req.session.username
    const result = delBlog(req.query.id, author)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        }
        else {
            res.json(
                new ErrorModel('刪除博客失敗')
              )
        }
    })

})

module.exports = router;
