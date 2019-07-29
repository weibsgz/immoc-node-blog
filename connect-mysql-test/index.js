const mysql = require('mysql');
//创建连接对象
const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'F28923wb',
    port:'3306',
    database:'myblog'
})
//开始连接
con.connect()

//执行SQL
//const sql = 'select * from users'

const sql = "insert into blogs(title,content,createtime,author) values('标题C','内容c',1562929071402,'zhangsan')"

con.query(sql,(err,result)=>{
    if(err) {
        console.error(err)
        return
    }
    console.log(result)
})
//关闭连接
con.end()