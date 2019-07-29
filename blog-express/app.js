var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//以下为自己引入 以上为脚手架引入
var session = require('express-session')
//通过connect-redis这个函数 session已经和redis做了关联将session相关信息持久化。
//express-session connect-redis通常一起使用
var redisStore = require('connect-redis')(session)
var redisClient = require('./db/redis')


const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

//初始化EXPRESS 相当于生成一个HTTP请求的实例
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//记录 log

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  //https://github.com/expressjs/morgan
  // //ctrl+f Predefined Formats
  
  app.use(logger('dev'));
}
//生產環境可以dev改成combined记录详细日志 
else {
  const fullFileName = path.join(__dirname,'logs','access.log')
  const writeStream = fs.createWriteStream(fullFileName,{
    flags:'a' //追加
  })
  app.use(logger('combined', {
    stream: writeStream //綫上環境日志寫入文件中
  }));
}
//如果有POST传来的数据可以在路由用 用req.body取得数据
//当然 GET请求从req.query取
//相当于 blog_node里app.js的getPostData
app.use(express.json());
//POST参数为不是JSON的格式兼容 和上边app.use(express.json()) 作用都是在req.body上加入传入的参数
app.use(express.urlencoded({ extended: false }));

//处理解析cookie 在路由里边就可以用req.cookies取得COOKIE
//blog_node相应代码为 解析COOKIE
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// 通过connect-redis函数 设置连接redis 并且
const sessionStore = new redisStore({
  client: redisClient
})

//在处理路由前处理session
app.use(session({
  secret: 'abcd#13',//secret是个密匙 随便写的
  cookie: {
    path: '/', //默认配置
    httpOnly: true, // //默认配置 只有服务端能修改cookie
    maxAge: 24 * 60 * 60 * 1000 //过期时间24小时
  },
  store: sessionStore //session和redis关联存入redis中
}))


// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
//没有命中路由 处理404页面
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
