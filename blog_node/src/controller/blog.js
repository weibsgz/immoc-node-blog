const {exec} = require('../db/mysql')

//可通过作者 或者 关键词查询
const getList = (author,keyword) =>{
    //先返回假数据
    // return [
    //     {
    //         id:1,
    //         title:'标题A',
    //         content:'内容A',
    //         createTime:1562834596457,
    //         author:'zhangsan'
    //     },
    //     {
    //         id:1,
    //         title:'标题B',
    //         content:'内容B',
    //         createTime:1562834662494,
    //         author:'lisi'
    //     }
    // ]
    //1=1 是占位永远成立，如果auther和 keyword都没有值 那么就变成了 select from bolgs where 就会报错
    let sql = `select * from blogs where 1=1`
    if(author){
        sql += ` and author = '${author}'`
    }
    if(keyword) {
        sql += ` and title like '%${keyword}%' `
    }
    sql += ` order by createtime desc;`
    console.log('-------sql: ',sql)
    //返回promise
    return exec(sql)

}

const getDetail = (id) =>{
    // return {
    //     id:1,
    //     title:'标题A',
    //     content:'内容A',
    //     createTime:1562834596457,
    //     author:'zhangsan'
    // }

    const sql = `select * from blogs where id = '${id}'`
    //查询出一条也是一个数组 要 取数组的第一个
    return exec(sql).then(rows=>{
        return rows[0]
    })

}

const newBlog = (blogData = {}) =>{
    //打印的是请求参数这里 因为router/blog.js里边传入了req.body 
    //req.body在app.js里赋值postData 为resolve出拼接的请求参数
    // console.log('new Blog DATA... ' , blogData)
    // return {
    //     id:3 //表示新建博客插入到數據表裡的ID
    // }

    const title = blogData.title;
    const content = blogData.content;
    const author = blogData.author;
    const createtime = Date.now()

    const sql = `
        insert into blogs (title,content,createtime,author) 
        values ('${title}','${content}',${createtime},'${author}')
    `
    return exec(sql).then(insertData=>{
        console.log('insertData is : ',insertData)
        return {
            //新建成功 返回一个对象 这个对象里有insertId
            id:insertData.insertId
        }
    })
}

const updateBlog = (id,blogData={}) =>{
    // //id是要更新博客的ID
    // console.log(id,blogData)
    // return true

    const title = blogData.title;
    const content = blogData.content;

    const sql = `
        update blogs set title = '${title}', content='${content}' 
         where id = ${id}`
    return exec(sql).then(updateData=>{
        console.log('updateData is ' , updateData)
        if(updateData.affectedRows > 0) {
            return true
        }
        return false;
    })
}

const delBlog = (id,author) =>{
    //id 是删除博客的ID

    const sql = `delete from blogs where id = '${id}' and author='${author}'`

    return exec(sql).then(deleteData=>{
        console.log('deleteData is ' , deleteData)
        if(deleteData.affectedRows > 0) {
            return true
        }
        return false;
    })
}




module.exports = {
    getList,getDetail,newBlog,updateBlog,delBlog
}