const {ErrorModel} = require('../model/resModel')

module.exports = (req,res,next) =>{
    //是否登录
    if(req.session.username) {
        next()
        return 
    }

    res.json(
        new ErrorModel('未登录')
    )
}