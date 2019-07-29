const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')


//登录验证
const loginCheck = (req) =>{
    if(!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}


const handleBlogRouter = (req, res) => {
    const method = req.method;
    const id = req.query.id

    //获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        //通过app.js里的querystring得到URL ？后边的对象形式
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';

        //获得数据data数组假数据写法
        // const listData = getList(author,keyword)
        // return new SuccessModel(listData)
        //接入真数据后 getList 返回promise了


        if (req.query.isadmin) {
            // 管理员界面
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                // 未登录
                return loginCheckResult
            }
            // 强制查询自己的博客
            author = req.session.username
        }

        const result = getList(author, keyword)

        return result.then((listData) => {
            //http://localhost:8000/api/blog/list?author=zhangsan&keyword=C
            return new SuccessModel(listData)
        })
    }

    //获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {

        // const data  = getDetail(id)
        // return new SuccessModel(data)
        const result = getDetail(id);
        return result.then(detail => {
            //http://localhost:8000/api/blog/detail?id=2
            return new SuccessModel(detail)
        })
    }

    //新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        //req.body 已經在APP.JS中通過promise resolve了 拼接的是请求参数
        // newblog 返回對象 {id:3} data就是{id:3}        
        // const data = newBlog(req.body)
        // // 最後執行结果就是{"data": {"id": 3},"errno": 0}
        // return new SuccessModel(data)

        //假数据 因为controller/blog.js里newBlog要用，新建文章是需要作者的
        //待开发登录时再改真是数据
        const author = req.session.username

        const loginCheckResult = loginCheck(req);
        if(loginCheckResult) {
            //未登录
            return loginCheckResult
        }

        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    //更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        if(loginCheckResult) {
            //未登录
            return loginCheckResult
        }

        const result = updateBlog(id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            }
            else {
                return new ErrorModel('更新博客失败')
            }
        })
    }

    //删除博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        if(loginCheckResult) {
            //未登录
            return loginCheckResult
        }
      
        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            }
            else {
                return new ErrorModel('删除博客失败')
            }
        })


    }
}

module.exports = handleBlogRouter