1.全局安装express-generator

2. express blog-express 生成文件夹

3. npm i   

4. npm i nodemon cross-env --D  

   npm i mysql xss -S

   npm i express-session -S 

    npm i redis connect-redis -S

5. 更改package.json  "dev": "cross-env NODE_ENV=dev nodemon ./bin/www"



### 运行
npm run dev
启动mysql,redis,nginx,静态资源文件夹html-test anywhere服务 访问http://localhost:8080/

nginx配置：
server {
        listen       8080;
        server_name  localhost;
	# / 代表根目录就代理到8001 localhost:8080/api/ 接口代理到 localhost8000的NODE服务
	# 进入localhost:8080/index.html 
        location / {
           proxy_pass  http://10.200.16.228:8001;
        }
	location /api/ {
           proxy_pass  http://localhost:8000;
	   proxy_set_header Host $host;
        }
    }