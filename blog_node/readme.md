### 安装依赖
`cnpm install nodemon cross-env -D`

### 运行
npm run dev
启动mysql,redis,nginx,静态资源文件夹 anywhere服务


//查看日志浏览器占比，基于stream 
node src/utils/readline.js


### 目录
/bin/www.js 创建服务，不包含业务
app.js 只管设置头 路由 404等基础配置或功能
router/  负责路由处理 返回数据
model/   数据模型
controller 只关心数据部分
conf/db  数据库配置
db/     数据库相关操作
logs/日志  access.log访问日志   event.log 自定义事件日志  error.log错误日志

流程：服务-路由-数据

www.js ->創建HTTP服務 服務來自APP.JS




nginx
  ###test
     server {
        listen       8080;
        server_name  localhost;
	# / 代表根目录就代理到8001 localhost:8080/api/ 接口代理到 localhost8000的NODE服务
	# 进入localhost:8080/index.html  10.200.16.228是anywhere起的服务
        location / {
           proxy_pass  http://10.200.16.228:8001;
        }
	location /api/ {
           proxy_pass  http://localhost:8000;
	   proxy_set_header Host $host;
        }
    }
