###常用命令

pm2 start 文件名|配置文件
pm2 list 进程列表
pm2 restart <appName>/id (pm2 list的进程表里有)
pm2 stop <appName>/id
pm2 delete <appName>/id
pm2 info <appName>/id
pm2 log <appName>/id
pm2 monit <appName>/id //监控CPU,内存信息


配置文件：

{
    "apps": {
        "name": "pm2-test-server",
        "script": "app.js",
        "watch": true,
        "ignore_watch": [
            "node_modules",
            "logs"
        ],
        "instances": 4, //多进程
        "error_file": "logs/err.log",
        "out_file": "logs/out.log",
        "log_date_format": "YYYY-MM-DD HH:mm:ss"
    }
}
