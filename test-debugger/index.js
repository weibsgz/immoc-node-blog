const http = require('http');
const server = http.createServer((req,res)=>{
    res.writeHead(200,{'content':'text/html'})
    res.end('<h1>Hello World</h1>')
})

server.listen(3000,()=>{
    console.log('listen on 3000 port');
})